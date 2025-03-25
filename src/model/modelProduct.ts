import db from "../db";

interface ProductRequest {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  deleted_at?: Date | null;
}
interface ProductIngredient {
  product_id: number;
  ingredient_id: number;
}

type ProductIngredientList = ProductIngredient[];

type PartialProduct = Partial<ProductRequest>;
import { ShowDeleted } from "src/constant";

export async function modelCreateProducts(
  data: ProductRequest
): Promise<ProductRequest> {
  try {
    const createdProduct = await db("products").insert(data).returning("*");
    return createdProduct[0];
  } catch (error) {
    throw error;
  }
}

export async function modelAllProducts(
  showDeleted: ShowDeleted
): Promise<ProductRequest[]> {
  try {
    const query = db("products").select("*");
    if (showDeleted === "false") {
      query.whereNull("deleted_at");
    } else if (showDeleted === "onlyDeleted") {
      query.whereNotNull("deleted_at");
    }
    return await query;
  } catch (error) {
    throw error;
  }
}

export async function modelGetProductByID(id: number): Promise<ProductRequest> {
  try {
    const existProduct = await db("products").select("*").where({ id }).first();
    return existProduct;
  } catch (error) {
    throw error;
  }
}

export async function modelUpdateProduct(
  id: number,
  data: PartialProduct
): Promise<ProductRequest> {
  try {
    const updatedProduct = await db("products")
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning("*");
    return updatedProduct[0];
  } catch (error) {
    throw error;
  }
}

export async function modelDeleteProduct(id: number): Promise<ProductRequest> {
  try {
    const deletedProduct = await db("products")
      .where({ id })
      .update({ deleted_at: new Date() })
      .returning("*");
    return deletedProduct[0];
  } catch (error) {
    throw error;
  }
}

export async function modelExistProduct(
  id?: number,
  name?: string
): Promise<ProductRequest> {
  try {
    const payload: { id?: number; name?: string } = {};
    if (id) {
      payload.id = id;
    }
    if (name) {
      payload.name = name;
    }
    return db("products").select("*").where(payload).first();
  } catch (error) {
    throw error;
  }
}

/*
get productIngredient ürün malzemelerini listele              | GET /products/:productId/ingredients
put productIngredient ürün malzemeleri güncelle yoksa oluştur | PUT /products/:productId/ingredients
*/

export async function modelGetProductIngredients(
  product_id: number
): Promise<ProductIngredient[]> {
  try {
    const productIngredients = await db("product_ingredients")
      .select("*")
      .where({ product_id });

    return productIngredients;
  } catch (error) {
    throw error;
  }
}

export async function modelPutProductIngredients(
  product_id: number,
  ingredient_ids: number[]
) {
  try {
    await db("product_ingredients").where({ product_id }).delete();

    const updateField = ingredient_ids.map((ingredient_id) => ({
      product_id,
      ingredient_id,
    }));

    return await db("product_ingredients").insert(updateField).returning("*");
  } catch (error) {
    throw error;
  }
}
