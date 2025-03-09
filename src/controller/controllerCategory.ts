import { Request, Response } from "express";
import {
  modelCreateCategory,
  modelAllCategories,
  modelGetCategoryByID,
  modelUpdateCategory,
  modelDeleteCategory,
  modelExistCategory,
} from "src/model/modelCategory";
type ShowDeletedCategory = "true" | "false" | "onlyDeleted";

export async function addCategory(
  req: Request<{}, {}, { name: string; description?: string }>,
  res: Response
) {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({
      error: "Missing Data",
    });
    return;
  }
  try {
    const existCategory = await modelExistCategory(undefined, name);
    console.log(existCategory);
    if (existCategory) {
      res.status(400).json({
        error: "This name has taken",
      });
      return;
    }
    const createdCategory = await modelCreateCategory({ name, description });
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function listCategory(
  req: Request<{}, {}, {}, { showDeleted: ShowDeletedCategory }>,
  res: Response
) {
  const { showDeleted = "false" } = req.query;
  try {
    const listedCategories = await modelAllCategories(showDeleted);
    if (listedCategories.length === 0) {
      res.status(404).json({ error: "no category found" });
      return;
    }
    res.status(200).json(listedCategories);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function getCategory(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  console.log(id);
  if (id === ":id" || isNaN(+id)) {
    res.status(400).json({
      error: "Invalid Data",
    });
    return;
  }
  try {
    const getCategoryByID = await modelGetCategoryByID(+id);
    if (getCategoryByID === undefined || getCategoryByID.deleted_at) {
      res.status(404).json({ error: "no data" });
      return;
    }
    res.status(200).json(getCategoryByID);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function editCategory(
  req: Request<{ id: string }, {}, { name?: string; description?: string }>,
  res: Response
) {
  const id = req.params.id;
  const { name, description } = req.body;
  if (id === ":id" || isNaN(+id) || (!name && !description)) {
    res.status(400).json({
      error: "Invalid Data",
    });
    return;
  }
  try {
    const existCategory = await modelExistCategory(undefined, name);
    console.log(existCategory);
    if (existCategory) {
      res.status(400).json({
        error: "This name has taken",
      });
      return;
    }
    const updatedCategory = await modelUpdateCategory(+id, {
      name,
      description,
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
export async function removeCategory(
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
    const existCategory = await modelExistCategory(+id);
    if (existCategory[0].deleted_at) {
      res.status(404).json({
        error: "no data",
      });
      return;
    }
    const deletedCategory = await modelDeleteCategory(+id);
    res.status(200).json(deletedCategory);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
