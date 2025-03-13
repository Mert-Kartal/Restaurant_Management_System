import { modelCreateProducts, modelAllProducts, modelGetProductByID, modelUpdateProduct, modelDeleteProduct, modelExistProduct, } from "../model/modelProduct";
export async function addProduct(req, res) {
    const { category_id, name, description, price } = req.body;
    if (!category_id || !name || !price) {
        res.status(400).json({
            error: "Missing Data",
        });
        return;
    }
    if (isNaN(+category_id) || isNaN(+price)) {
        res.status(400).json({
            error: "Invalid Data",
        });
        return;
    }
    try {
        const existProduct = await modelExistProduct(undefined, name);
        console.log(existProduct);
        if (existProduct) {
            res.status(400).json({
                error: "This name has taken",
            });
            return;
        }
        const payload = { category_id: +category_id, name, description, price: +price };
        const createdProduct = await modelCreateProducts(payload);
        res.status(201).json(createdProduct);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
export async function listProduct(req, res) {
    const { showDeleted = "false" } = req.query;
    try {
        const listedProducts = await modelAllProducts(showDeleted);
        if (listedProducts.length === 0) {
            res.status(404).json({ error: "no product found" });
            return;
        }
        res.status(200).json(listedProducts);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
export async function getProduct(req, res) {
    const id = req.params.id;
    if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
            error: "Invalid Data",
        });
        return;
    }
    try {
        const getProductByID = await modelGetProductByID(+id);
        console.log(getProductByID);
        if (getProductByID === undefined || getProductByID.deleted_at) {
            res.status(404).json({ error: "no data" });
            return;
        }
        res.status(200).json(getProductByID);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
export async function editProduct(req, res) {
    const id = req.params.id;
    const { category_id, name, description, price } = req.body;
    if (id === ":id" ||
        isNaN(+id) ||
        (category_id && isNaN(+category_id)) ||
        (price && isNaN(+price))) {
        res.status(400).json({
            error: "Invalid Data",
        });
        return;
    }
    try {
        const existProductID = await modelExistProduct(+id);
        const existProductName = await modelExistProduct(undefined, name);
        console.log(existProductID, existProductName);
        if (!existProductID) {
            res.status(404).json({
                error: "This category does not exist",
            });
            return;
        }
        if (existProductID.deleted_at) {
            res.status(400).json({
                error: "This category is deleted",
            });
            return;
        }
        if (existProductName) {
            res.status(400).json({
                error: "This name has taken",
            });
            return;
        }
        const payload = {};
        if (category_id)
            payload.category_id = +category_id;
        if (name)
            payload.name = name;
        if (description)
            payload.description = description;
        if (price)
            payload.price = +price;
        const updatedProduct = await modelUpdateProduct(+id, payload);
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
export async function removeProduct(req, res) {
    const id = req.params.id;
    if (id === ":id" || isNaN(+id)) {
        res.status(400).json({
            error: "Invalid Data",
        });
        return;
    }
    try {
        const existProduct = await modelExistProduct(+id);
        if (!existProduct) {
            res.status(404).json({
                error: "This Id does not exist",
            });
            return;
        }
        if (existProduct.deleted_at) {
            res.status(404).json({
                error: "no data",
            });
            return;
        }
        const deletedProduct = await modelDeleteProduct(+id);
        res.status(200).json(deletedProduct);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
//# sourceMappingURL=controllerProduct.js.map