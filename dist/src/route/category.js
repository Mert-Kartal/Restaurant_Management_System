import express from "express";
import { createCategory, listCategory, getCategoryById, updateCategory, deleteCategory, } from "src/controller/category";
const router = express.Router();
router.post("/", createCategory);
router.get("/", listCategory);
router.get("/:id", getCategoryById);
router.patch("/:id", updateCategory);
router.delete("/", deleteCategory);
export { router };
//# sourceMappingURL=category.js.map