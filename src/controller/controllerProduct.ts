import { Request, Response } from "express";
import {
  modelCreateProducts,
  modelAllProducts,
  modelGetProductByID,
  modelUpdateProduct,
  modelDeleteProduct,
  modelExistProduct,
  modelGetProductIngredients,
  modelPutProductIngredients,
} from "../model/modelProduct";
import { modelExistCategory } from "../model/modelCategory";
import { ExistIngredients } from "../model/modelIngredient";
import { ShowDeleted } from "src/constant";
export async function addProduct(
  req: Request<
    {},
    {},
    { category_id: string; name: string; description?: string; price: string }
  >,
  res: Response
) {
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
    const existCategory = await modelExistCategory(+category_id);
    if (!existCategory) {
      res.status(404).json({
        error: "This category does not exist",
      });
      return;
    }
    const existProductName = await modelExistProduct(undefined, name);
    if (existProductName) {
      res.status(400).json({
        error: "This name has taken",
      });
      return;
    }

    const payload: {
      category_id: number;
      name: string;
      description: string | undefined;
      price: number;
    } = { category_id: +category_id, name, description, price: +price };

    const createdProduct = await modelCreateProducts(payload);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function listProduct(
  req: Request<{}, {}, {}, { showDeleted: ShowDeleted }>,
  res: Response
) {
  const { showDeleted = "false" } = req.query;
  try {
    const listedProducts = await modelAllProducts(showDeleted);
    if (listedProducts.length === 0) {
      res.status(404).json({ error: "no product found" });
      return;
    }
    res.status(200).json(listedProducts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function getProduct(req: Request<{ id: string }>, res: Response) {
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
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function editProduct(
  req: Request<
    { id: string },
    {},
    {
      category_id?: string;
      name?: string;
      description?: string;
      price?: string;
    }
  >,
  res: Response
) {
  const id = req.params.id;
  const { category_id, name, description, price } = req.body;
  if (
    id === ":id" ||
    isNaN(+id) ||
    (category_id && isNaN(+category_id)) ||
    (price && isNaN(+price)) ||
    (!category_id && !name && !description && !price)
  ) {
    res.status(400).json({
      error: "Invalid Data",
    });
    return;
  }
  try {
    const existProductID = await modelExistProduct(+id);
    if (!existProductID) {
      res.status(404).json({
        error: "This product does not exist",
      });
      return;
    }
    if (existProductID.deleted_at) {
      res.status(400).json({
        error: "This product is deleted",
      });
      return;
    }
    if (category_id) {
      const existCategoryID = await modelExistCategory(+category_id);
      console.log(existCategoryID);
      if (!existCategoryID || existCategoryID.deleted_at) {
        res.status(404).json({
          error: "This category does not exist",
        });
        return;
      }
    }
    if (name) {
      const existProductName = await modelExistProduct(undefined, name);
      console.log(existProductName);

      if (existProductName) {
        res.status(400).json({
          error: "This name has taken",
        });
        return;
      }
    }
    const payload: {
      category_id?: number;
      name?: string;
      description?: string;
      price?: number;
    } = {};
    if (category_id) payload.category_id = +category_id;
    if (name) payload.name = name;
    if (description) payload.description = description;
    if (price) payload.price = +price;
    const updatedProduct = await modelUpdateProduct(+id, payload);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function removeProduct(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = req.params.id;
  if (id === ":id" || isNaN(+id)) {
    res.status(400).json({
      error: "Invalid Data",
    });
    return;
  }
  try {
    const existProduct = await modelExistProduct(+id);
    console.log(existProduct);
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
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function listProductIngredient(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = req.params.id;
  try {
    if (id === ":id" || isNaN(+id)) {
      res.status(400).json({
        error: "Invalid Data",
      });
      return;
    }

    const getProductByID = await modelGetProductByID(+id);

    if (getProductByID === undefined || getProductByID.deleted_at) {
      res.status(404).json({ error: "no data" });
      return;
    }

    const getProductIngredients = await modelGetProductIngredients(+id);
    if (getProductIngredients.length === 0) {
      res.status(404).json({ error: "no data" });
      return;
    }
    res.status(200).json(getProductIngredients);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function editProductIngredient(
  req: Request<{ id: string }, {}, { ingredientList: number[] }>,
  res: Response
) {
  const id = req.params.id;
  const { ingredientList } = req.body;
  try {
    if (
      id === ":id" ||
      isNaN(+id) ||
      !ingredientList ||
      !Array.isArray(ingredientList)
    ) {
      res.status(400).json({
        error: "Invalid Data",
      });
      return;
    }

    const notNumberContent = ingredientList.filter(
      (ingredient) => typeof ingredient !== "number"
    );

    if (notNumberContent.length > 0) {
      res.status(400).json({ error: "Invalid data:" + notNumberContent });
      return;
    }
    const getProductByID = await modelGetProductByID(+id);

    if (getProductByID === undefined || getProductByID.deleted_at) {
      res.status(404).json({ error: "no data" });
      return;
    }

    const existIngredients = await ExistIngredients(ingredientList);

    const existIds = existIngredients.map((item) => item.id);

    const notExistIds = ingredientList.filter((id) => !existIds.includes(id));

    if (existIngredients.length !== ingredientList.length) {
      res.status(404).json({ error: `Invalid data:${notExistIds}` });
      return;
    }
    const updatedProductIngredient = await modelPutProductIngredients(
      +id,
      ingredientList
    );

    res.status(200).json(updatedProductIngredient);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
