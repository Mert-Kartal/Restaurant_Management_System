import express from "express";
import {
  addProduct,
  listProduct,
  getProduct,
  editProduct,
  removeProduct,
  listProductIngredient,
  editProductIngredient,
} from "../controller/controllerProduct";
const router = express.Router();

router.post("/", addProduct);
router.get("/", listProduct);
router.get("/:id", getProduct);
router.patch("/:id", editProduct);
router.delete("/:id", removeProduct);
router.get("/:id/ingredient", listProductIngredient);
router.put("/:id/ingredient", editProductIngredient);

export default router;
/*convention
entity 
resource
*/
