import { Router } from "express";
import asyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderModel } from "../models/order.model";
import { OrderStatus } from "../constants/order_status";
import auth from "../middlewares/auth.mid";
import { UserModel } from "../models/user.model";
import { sendEmailReceipt } from "../helpers/mail.helper";

const router = Router();
router.use(auth);

router.post(
  "/create",
  asyncHandler(async (req: any, res: any) => {
    const requestOrder = req.body;

    if (requestOrder.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart Is Empty!");
      return;
    }

    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);

router.get(
  "/newOrderForCurrentUser",
  asyncHandler(async (req: any, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
  })
);

router.post(
  "/pay",
  asyncHandler(async (req: any, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(HTTP_BAD_REQUEST).send("Order Not Found!");
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    sendEmailReceipt(order);

    res.send(order._id); // besoin pour rediriger le user à la TrackPage
  })
);

router.get(
  "/track/:id",
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
  })
);

router.get("/allstatus", (_, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

router.get(
  "/:status?",
  asyncHandler(async (req: any, res: any) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter: any = {};

    if (!user?.isAdmin) filter.user = user?._id;
    if (status) filter.status = status;

    const orders = await OrderModel.find(filter).sort("-createdAt");

    res.send(orders);
  })
);

async function getNewOrderForCurrentUser(req: any) {
  return await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate("user"); // "populate" pour faire le lien avec la
  // "ref" 'user' du orderSchema => ça va mettre l'objet user dans l'objet orderSchema
}

export default router;
