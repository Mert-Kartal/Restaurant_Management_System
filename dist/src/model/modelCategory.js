import db from "../db";
export async function modelCreateCategory(data) {
    try {
        const createdCategory = await db("categories").insert(data).returning("*");
        return createdCategory[0];
    }
    catch (error) {
        throw error;
    }
}
export async function modelAllCategories(showDeleted) {
    try {
        const query = db("categories").select("*");
        if (showDeleted === "false") {
            query.whereNull("deleted_at");
        }
        else if (showDeleted === "onlyDeleted") {
            query.whereNotNull("deleted_at");
        }
        return query;
    }
    catch (error) {
        throw error;
    }
}
export async function modelGetCategoryByID(id) {
    try {
        return db("categories").where({ id }).first();
    }
    catch (error) {
        throw error;
    }
}
export async function modelUpdateCategory(id, data) {
    try {
        const updatedCategory = db("categories")
            .where({ id })
            .update(data)
            .returning("*");
        return updatedCategory;
    }
    catch (error) {
        throw error;
    }
}
export async function modelDeleteCategory(id) {
    try {
        const deletedCategory = await db("categories")
            .where({ id })
            .update({ deleted_at: new Date() })
            .returning("*");
        return deletedCategory[0];
    }
    catch (error) {
        throw error;
    }
}
export async function modelExistCategory(id, name) {
    try {
        const payload = {};
        if (id) {
            payload.id = id;
        }
        if (name) {
            payload.name = name;
        }
        return db("categories").select("*").where(payload).first();
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=modelCategory.js.map