import { Request, Response } from "express";
import {
  modelCreateIngredient,
  modelAllIngredients,
  modelGetIngredientByID,
  modelUpdateIngredient,
  modelDeleteIngredient,
  modelExistIngredient,
  modelGetIngredientProducts,
} from "../model/modelIngredient";
import { ShowDeleted } from "src/constant";

export async function addIngredient(
  req: Request<{}, {}, { name: string; is_allergen: boolean }>,
  res: Response
) {
  const { name, is_allergen } = req.body;
  if (!name || !is_allergen) {
    res.status(400).json({
      error: "missing data",
    });
    return;
  }
  try {
    const existIngredient = await modelExistIngredient(undefined, name);

    if (existIngredient) {
      res.status(400).json({
        error: "This name has taken",
      });
      return;
    }

    const payload: { name: string; is_allergen: boolean } = {
      name,
      is_allergen,
    };

    const createIngredient = await modelCreateIngredient(payload);
    res.status(201).json(createIngredient);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function listIngredient(
  req: Request<{}, {}, {}, { showDeleted: ShowDeleted }>,
  res: Response
) {
  const { showDeleted = "false" } = req.query;
  try {
    const listedIngredient = await modelAllIngredients(showDeleted);
    if (listedIngredient.length === 0) {
      res.status(404).json({ error: "no ingredient found" });
      return;
    }
    res.status(200).json(listedIngredient);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function getIngredient(
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
    const getIngredientByID = await modelGetIngredientByID(+id);
    if (getIngredientByID === undefined || getIngredientByID.deleted_at) {
      res.status(404).json({ error: "no data" });
      return;
    }
    res.status(200).json(getIngredientByID);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function editIngredient(
  req: Request<{ id: string }, {}, { name?: string; is_allergen?: boolean }>,
  res: Response
) {
  const id = req.params.id;
  const { name, is_allergen } = req.body;
  if (id === ":id" || isNaN(+id) || (!name && !is_allergen)) {
    res.status(400).json({
      error: "Invalid Data",
    });
    return;
  }
  try {
    const existIngredientID = await modelExistIngredient(+id);
    const existIngredientName = await modelExistIngredient(undefined, name);
    if (!existIngredientID) {
      res.status(404).json({
        error: "This ingredient does not exist",
      });
      return;
    }
    if (existIngredientID.deleted_at) {
      res.status(400).json({
        error: "This ingredient is deleted",
      });
      return;
    }
    if (existIngredientName) {
      res.status(400).json({
        error: "This name has taken",
      });
      return;
    }
    const payload: { name?: string; is_allergen?: boolean } = {};
    if (name) payload.name = name;
    if (is_allergen) payload.is_allergen = is_allergen;
    const updatedIngredient = await modelUpdateIngredient(+id, payload);
    res.status(200).json(updatedIngredient);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function removeIngredient(
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
    const existIngredient = await modelExistIngredient(+id);
    if (!existIngredient) {
      res.status(404).json({
        error: "This Id does not exist",
      });
      return;
    }
    if (existIngredient.deleted_at) {
      res.status(404).json({
        error: "no data",
      });
      return;
    }
    const deletedIngredient = await modelDeleteIngredient(+id);
    res.status(200).json(deletedIngredient);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function listIngredientProducts(
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

    const getIngredientByID = await modelGetIngredientByID(+id);

    if (getIngredientByID === undefined || getIngredientByID.deleted_at) {
      res.status(404).json({ error: "no data" });
      return;
    }
    const getIngredientProducts = await modelGetIngredientProducts(+id);
    if (getIngredientProducts.length === 0) {
      res.status(404).json({ error: "no data" });
      return;
    }
    res.status(200).json(getIngredientProducts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
