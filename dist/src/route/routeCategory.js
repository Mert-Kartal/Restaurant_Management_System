import express from "express";
import { addCategory, listCategory, getCategory, editCategory, removeCategory, } from "../controller/controllerCategory";
const router = express.Router();
router.post("/", addCategory);
router.get("/", listCategory);
router.get("/:id", getCategory);
router.patch("/:id", editCategory);
router.delete("/:id", removeCategory);
export default router;
//# sourceMappingURL=routeCategory.js.map