import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
import admin from "../middlewares/admin.mid";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (_, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send("Seed is already done!");
      return;
    }
    await FoodModel.create(sample_foods);
    res.send("Seed Is Done!");
  })
);

router.get(
  "/",
  asyncHandler(async (_, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.post(
  "/",
  admin,
  asyncHandler(async (req, res) => {
    const { name, price, tags, favorite, imageUrl, origins, cookTime } =
      req.body;
    console.log("update food", req.body);

    const food = new FoodModel({
      name,
      price,
      tags: tags.split ? tags.split(",") : tags, // si la fct split existe alors '','','' => ['','','']
      favorite,
      imageUrl,
      origins: origins.split ? origins.split(",") : origins,
      cookTime,
    });

    await food.save();

    res.send(food);
  })
);

router.put(
  "/",
  admin,
  asyncHandler(async (req, res) => {
    const { id, name, price, tags, favorite, imageUrl, origins, cookTime } =
      req.body;
    console.log("update food", req.body);
    await FoodModel.updateOne(
      { _id: id },
      {
        name,
        price,
        tags: tags.split ? tags.split(",") : tags, // si la fct split existe alors '','','' => ['','','']
        favorite,
        imageUrl,
        origins: origins.split ? origins.split(",") : origins,
        cookTime,
      }
    );
    res.send();
  })
);

router.delete(
  "/:foodId",
  admin,
  asyncHandler(async (req, res) => {
    const { foodId } = req.params;
    await FoodModel.deleteOne({ _id: foodId });
    res.send();
  })
);

router.get(
  "/tags",
  asyncHandler(async (_, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/tag/:tagName",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

router.get(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  })
);

export default router;
