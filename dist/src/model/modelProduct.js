import db from "../db";
export async function modelCreateProducts(data) {
    try {
        const createdProduct = await db("products").insert(data).returning("*");
        return createdProduct[0];
    }
    catch (error) {
        throw error;
    }
}
export async function modelAllProducts(showDeleted) {
    try {
        const query = db("products").select("*");
        if (showDeleted === "false") {
            query.whereNull("deleted_at");
        }
        else if (showDeleted === "onlyDeleted") {
            query.whereNotNull("deleted-at");
        }
        return query;
    }
    catch (error) {
        throw error;
    }
}
export async function modelGetProductByID(id) {
    try {
        const existProduct = await db("products").select("*").where({ id }).first();
        return existProduct;
    }
    catch (error) {
        throw error;
    }
}
export async function modelUpdateProduct(id, data) {
    try {
        const updatedProduct = await db("products")
            .where({ id })
            .update(data)
            .returning("*");
        return updatedProduct[0];
    }
    catch (error) {
        throw error;
    }
}
export async function modelDeleteProduct(id) {
    try {
        const deletedProduct = await db("products")
            .where({ id })
            .update({ deleted_at: new Date() })
            .returning("*");
        return deletedProduct[0];
    }
    catch (error) {
        throw error;
    }
}
export async function modelExistProduct(id, name) {
    try {
        const payload = {};
        if (id) {
            payload.id = id;
        }
        if (name) {
            payload.name = name;
        }
        return db("products").select("*").where(payload).first();
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=modelProduct.js.map