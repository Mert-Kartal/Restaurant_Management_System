import express from "express";

import {
  addIngredient,
  listIngredient,
  getIngredient,
  editIngredient,
  removeIngredient,
  listIngredientProducts,
} from "../controller/controllerIngredient";
const router = express.Router();

router.post("/", addIngredient);
router.get("/", listIngredient);
router.get("/:id", getIngredient);
router.patch("/:id", editIngredient);
router.delete("/:id", removeIngredient);
router.get("/:id/product", listIngredientProducts);

export default router;
