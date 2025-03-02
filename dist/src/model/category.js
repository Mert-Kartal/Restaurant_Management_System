import db from "src/db";
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["EXIST_CATEGORY"] = "EXIST_CATEGORY";
    ErrorCode["NO_DATA"] = "NO_DATA";
    ErrorCode["CATEGORY_NOT_FOUND"] = "CATEGORY_NOT_FOUND";
    ErrorCode["DELETED_CATEGORY"] = "DELETED_CATEGORY";
    ErrorCode["TAKEN_CATEGORY_NAME"] = "TAKEN_CATEGORY_NAME";
})(ErrorCode || (ErrorCode = {}));
export const ErrorStatusMap = {
    EXIST_CATEGORY: 409,
    NO_DATA: 404,
    CATEGORY_NOT_FOUND: 404,
    DELETED_CATEGORY: 404,
    TAKEN_CATEGORY_NAME: 409,
};
export async function create(name, description) {
    try {
        const exist_category = await db("categories")
            .select("*")
            .where({
            name,
        })
            .first();
        if (exist_category) {
            if (exist_category.deleted_at) {
                const deleted_category = await db("categories")
                    .where({ name })
                    .update({
                    deleted_at: null,
                })
                    .returning("*");
                return deleted_category[0];
            }
            return {
                error: "This category already exist",
                code: "EXIST_CATEGORY",
            };
        }
        const insert_category = await db("categories")
            .insert({
            name,
            description,
            created_at: new Date(),
        })
            .returning("*");
        return insert_category[0];
    }
    catch (error) {
        throw new Error(error.message);
    }
}
export async function list(showDeleted = "false") {
    try {
        let get_categories = db("categories").select("*");
        if (showDeleted === "false") {
            get_categories = get_categories.whereNull("deleted_at");
        }
        if (showDeleted === "onlyDeleted") {
            get_categories = get_categories.whereNotNull("deleted_at");
        }
        const categories = await get_categories;
        if (categories.length === 0) {
            return {
                error: "There is no category to shown",
                code: "NO_DATA",
            };
        }
        return categories;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
export async function get_id(id) {
    try {
        const exist_category = await db("categories")
            .select("*")
            .where({ id })
            .first();
        if (!exist_category) {
            return {
                error: "Category not found",
                code: "CATEGORY_NOT_FOUND",
            };
        }
        if (exist_category.delete_at) {
            return {
                error: "Category is deleted",
                code: "DELETED_CATEGORY",
            };
        }
        return exist_category;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
export async function update(id, name, description) {
    try {
        const exist_category = await db("categories")
            .select("*")
            .where({ id })
            .first();
        if (!exist_category) {
            return {
                error: "Category not found",
                code: "CATEGORY_NOT_FOUND",
            };
        }
        if (name && name !== exist_category.name) {
            const exist_category_name = await db("categories")
                .select("*")
                .where({ name })
                .first();
            if (exist_category_name) {
                return {
                    error: "This Category Name Has Taken",
                    code: "TAKEN_CATEGORY_NAME",
                };
            }
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        const updated_category = await db("categories")
            .where({ id })
            .update(updateData)
            .returning("*");
        return updated_category[0];
    }
    catch (error) {
        throw new Error(error.message);
    }
}
export async function delete_(name) {
    try {
        const exist_category = await db("categories")
            .select("*")
            .where({
            name,
        })
            .first();
        if (!exist_category) {
            return {
                error: "Category not found",
                code: "CATEGORY_NOT_FOUND",
            };
        }
        if (exist_category.deleted_at !== null) {
            return {
                error: "This Category Already Deleted",
                code: "DELETED_CATEGORY",
            };
        }
        const delete_category = await db("categories")
            .where({ name })
            .update({
            deleted_at: new Date(),
        })
            .returning("*");
        return delete_category[0];
    }
    catch (error) {
        throw new Error(error.message);
    }
}
//# sourceMappingURL=category.js.map