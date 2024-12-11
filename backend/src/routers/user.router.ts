import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";
import auth from "../middlewares/auth.mid";
import admin from "../middlewares/admin.mid";

const PASSWORD_HASH_SALT_ROUNDS = 10;

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (_, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }
    await UserModel.create(sample_users);
    res.send("Seed Is Done!");
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User name or password is not valid!");
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User is already exist, please login!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(
      password,
      PASSWORD_HASH_SALT_ROUNDS
    );

    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
      isBlocked: false,
    };

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));
  })
);

router.put(
  "/updateProfile",
  auth,
  asyncHandler(async (req: any, res: any) => {
    const { name, address } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    );

    res.send(generateTokenResponse(user));
  })
);

router.put(
  "/changePassword",
  auth,
  asyncHandler(async (req: any, res: any) => {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      res.status(HTTP_BAD_REQUEST).send("Change Password Failed!");
      return;
    }

    const equal = await bcrypt.compare(currentPassword, user.password);

    if (!equal) {
      res.status(HTTP_BAD_REQUEST).send("Current Password Is Not Correct!");
      return;
    }

    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    await user.save();

    res.send();
  })
);

router.get(
  "/getAll/:searchTerm?",
  admin,
  asyncHandler(async (req, res) => {
    const { searchTerm } = req.params;

    const filter = searchTerm
      ? { name: { $regex: new RegExp(searchTerm, "i") } }
      : {};

    const users = await UserModel.find(filter, { password: 0 });
    res.send(users);
  })
);

router.put(
  "/toggleBlock/:userId",
  admin,
  asyncHandler(async (req: any, res: any) => {
    const { userId } = req.params;

    if (userId === req.user.id) {
      // l'admin ne doit pas se bloquer
      res.status(HTTP_BAD_REQUEST).send("Can't block yourself!");
      return;
    }

    const user = await UserModel.findById(userId);
    user!.isBlocked = !user?.isBlocked;
    user?.save();

    res.send(user?.isBlocked);
  })
);

router.get(
  "/getById/:userId",
  admin,
  asyncHandler(async (req: any, res: any) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId, { password: 0 });

    res.send(user);
  })
);

router.put(
  "/update",
  admin,
  asyncHandler(async (req, res) => {
    const { id, name, email, address, isAdmin } = req.body;
    console.log("id", id);
    console.log("body", req.body);

    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        address,
        isAdmin,
      }
      // { new: true }
    );

    // console.log("result", user);

    // res.send(user);
    res.send();
  })
);

const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token,
  };
};

export default router;
