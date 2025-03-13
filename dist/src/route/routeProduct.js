import express from "express";
import { addProduct, listProduct, getProduct, editProduct, removeProduct, } from "../controller/controllerProduct";
const router = express.Router();
router.post("/", addProduct);
router.get("/", listProduct);
router.get("/:id", getProduct);
router.patch("/:id", editProduct);
router.delete("/:id", removeProduct);
export default router;
//# sourceMappingURL=routeProduct.js.map