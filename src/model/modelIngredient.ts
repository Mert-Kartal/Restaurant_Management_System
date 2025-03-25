import db from "../db";
interface IngredientRequest {
  name: string;
  is_allergen: boolean;
  deleted_at?: Date | null;
}
import { ShowDeleted } from "src/constant";
type PartialIngredient = Partial<IngredientRequest>;
export async function modelCreateIngredient(
  data: IngredientRequest
): Promise<IngredientRequest> {
  try {
    const createIngredient = await db("ingredients")
      .insert(data)
      .returning("*");
    return createIngredient[0];
  } catch (error) {
    throw error;
  }
}

export async function modelAllIngredients(
  showDeleted: ShowDeleted
): Promise<IngredientRequest[]> {
  try {
    const query = db("ingredients").select("*");
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

export async function modelGetIngredientByID(
  id: number
): Promise<IngredientRequest> {
  try {
    const existIngredient = await db("ingredients")
      .select("*")
      .where({ id })
      .first();
    return existIngredient;
  } catch (error) {
    throw error;
  }
}

export async function modelUpdateIngredient(
  id: number,
  data: PartialIngredient
): Promise<IngredientRequest> {
  try {
    const updatedIngredient = await db("ingredients")
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning("*");
    return updatedIngredient[0];
  } catch (error) {
    throw error;
  }
}

export async function modelDeleteIngredient(
  id: number
): Promise<IngredientRequest> {
  try {
    const deletedIngredient = await db("ingredients")
      .where({ id })
      .update({ deleted_at: new Date() })
      .returning("*");
    return deletedIngredient[0];
  } catch (error) {
    throw error;
  }
}

export async function modelExistIngredient(
  id?: number,
  name?: string
): Promise<IngredientRequest> {
  try {
    const payload: { id?: number; name?: string } = {};
    if (id) {
      payload.id = id;
    }
    if (name) {
      payload.name = name;
    }
    return db("ingredients").select("*").where(payload).first();
  } catch (error) {
    throw error;
  }
}

export async function modelGetIngredientProducts(ingredient_id: number) {
  try {
    const ingredientProducts = await db("product_ingredients")
      .select("*")
      .where({
        ingredient_id,
      });
    return ingredientProducts;
  } catch (error) {
    throw error;
  }
}

export async function ExistIngredients(ingredient_ids: number[]) {
  try {
    const checkedIngredients = await db("ingredients")
      .whereIn(`id`, ingredient_ids)
      .whereNull("deleted_at");
    return checkedIngredients;
  } catch (error) {
    throw error;
  }
}
