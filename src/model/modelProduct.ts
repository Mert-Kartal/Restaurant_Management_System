import db from "../db";

interface ProductRequest {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  deleted_at?: Date | null;
}
type PartialProduct = Partial<ProductRequest>;
type ShowDeletedProduct = "false" | "true" | "onlyDeleted";
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
  showDeleted: ShowDeletedProduct
): Promise<ProductRequest[]> {
  try {
    const query = db("products").select("*");
    if (showDeleted === "false") {
      query.whereNull("deleted_at");
    } else if (showDeleted === "onlyDeleted") {
      query.whereNotNull("deleted-at");
    }
    return query;
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
      .update(data)
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
