import db from "../db";

interface CategoryRequest {
  name: string;
  description?: string;
  deleted_at?: Date;
}
type PartialCategory = Partial<CategoryRequest>;

type ShowDeletedCategory = "true" | "false" | "onlyDeleted";

export async function modelCreateCategory(
  data: CategoryRequest
): Promise<CategoryRequest> {
  try {
    const createdCategory = await db("categories").insert(data).returning("*");
    return createdCategory[0];
  } catch (error) {
    throw error;
  }
}

export async function modelAllCategories(
  showDeleted: ShowDeletedCategory
): Promise<CategoryRequest[]> {
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

export async function modelGetCategoryByID(
  id: number
): Promise<CategoryRequest> {
  try {
    return db("categories").where({ id }).first();
  } catch (error) {
    throw error;
  }
}

export async function modelUpdateCategory(
  id: number,
  data: PartialCategory
): Promise<PartialCategory[]> {
  try {
    const updatedCategory = db("categories")
      .where({ id })
      .update(data)
      .returning("*");
    return updatedCategory;
  } catch (error) {
    throw error;
  }
}

export async function modelDeleteCategory(
  id: number
): Promise<CategoryRequest> {
  try {
    const deletedCategory = await db("categories")
      .where({ id })
      .update({ deleted_at: new Date() })
      .returning("*");
    return deletedCategory[0];
  } catch (error) {
    throw error;
  }
}

export async function modelExistCategory(
  id?: number,
  name?: string
): Promise<CategoryRequest> {
  try {
    const payload: { id?: number; name?: string } = {};
    if (id) {
      payload.id = id;
    }
    if (name) {
      payload.name = name;
    }
    return db("categories").select("*").where(payload).first();
  } catch (error) {
    throw error;
  }
}
