import db from "src/db";

interface CategoryRequest {
  name: string;
  description?: string;
}
type PartialCategory = Partial<CategoryRequest>;

type ShowDeletedCategory = "true" | "false" | "onlyDeleted";

export async function modelCreateCategory(data: CategoryRequest) {
  try {
    return db("categories").insert(data).returning("*");
  } catch (error) {
    throw error;
  }
}

export async function modelAllCategories(showDeleted: ShowDeletedCategory) {
  try {
    const query = db("categories").select("*");
    if (showDeleted === "false") {
      query.whereNull("deleted_at");
    } else if (showDeleted === "onlyDeleted") {
      query.whereNotNull("deleted_at");
    }
    return query;
  } catch (error) {
    throw error;
  }
}

export async function modelGetCategoryByID(id: number) {
  try {
    return db("categories").where({ id }).first();
  } catch (error) {
    throw error;
  }
}

export async function modelUpdateCategory(id: number, data: PartialCategory) {
  try {
    return db("categories").where({ id }).update(data).returning("*");
  } catch (error) {
    throw error;
  }
}

export async function modelDeleteCategory(id: number) {
  try {
    return db("categories")
      .where({ id })
      .update({ deleted_at: new Date() })
      .returning("*");
  } catch (error) {
    throw error;
  }
}

export async function modelExistCategory(id?: number, name?: string) {
  try {
    const payload: { id?: number; name?: string } = {};
    if (id) {
      payload.id = id;
    }
    if (name) {
      payload.name = name;
    }
    return db("categories").where(payload).returning("*");
  } catch (error) {
    throw error;
  }
}
