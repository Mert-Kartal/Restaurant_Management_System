import { Request, Response } from "express";
import { create, list, get_id, update, delete_ } from "src/model/category";
import { ErrorCode, ErrorStatusMap } from "src/model/category";
interface createCategoryType {
  name: string;
  description: string;
}

interface reqQuery {
  showDeleted: "false" | "true" | "onlyDeleted";
}

export async function createCategory(
  req: Request<{}, {}, createCategoryType>,
  res: Response
) {
  const { name, description } = req.body;
  try {
    if (!name) {
      res.status(400).json({
        error: "Missing Data",
        code: "MISSING_DATA",
      });
      return;
    }
    const modelCreate = await create(name, description);

    if ("error" in modelCreate) {
      const status: number =
        ErrorStatusMap[modelCreate.code as ErrorCode] || 400;
      res.status(status).json(modelCreate);
      return;
    }

    res.status(201).json({
      message: "Category Successfully Created",
      data: modelCreate,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong ${(error as Error).message}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
export async function listCategory(
  req: Request<{}, {}, {}, reqQuery>,
  res: Response
) {
  const { showDeleted = "false" } = req.query;

  try {
    if (!["false", "true", "onlyDeleted"].includes(showDeleted)) {
      res.status(400).json({
        message: "Invalid showDeleted value",
        code: "INVALID_DATA",
      });
      return;
    }

    const modelAllCategory = await list(showDeleted);

    if ("error" in modelAllCategory) {
      const status = ErrorStatusMap[modelAllCategory.code as ErrorCode];
      res.status(status).json(modelAllCategory);
      return;
    }

    res.status(200).json({
      message: "All categories are listed",
      data: modelAllCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong ${(error as Error).message}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
export async function getCategoryById(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = req.params.id;
  try {
    if (!id) {
      res.status(400).json({
        message: "Missing Id",
        code: "MISSING_ID",
      });
      return;
    }

    if (isNaN(+id)) {
      res.status(400).json({
        message: `Invalid ID`,
        code: "INVALID_ID",
      });
      return;
    }

    const category_id = +id;

    const modelExistCategory = await get_id(category_id);

    if ("error" in modelExistCategory) {
      const status = ErrorStatusMap[modelExistCategory.code as ErrorCode];
      res.status(status).json(modelExistCategory);
      return;
    }

    res.status(200).json({
      message: "Category Successfully Listed",
      data: modelExistCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong ${(error as Error).message}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
export async function updateCategory(
  req: Request<{ id: string }, {}, { name: string; description: string }>,
  res: Response
) {
  const id = req.params.id;
  const { name, description } = req.body;
  try {
    if (!id) {
      res.status(404).json({
        message: "Missing Data",
        code: "MISSING_DATA",
      });
      return;
    }

    if (isNaN(+id)) {
      res.status(400).json({
        message: "Invalid ID",
        code: "INVALID_ID",
      });
      return;
    }

    if (!name && !description) {
      res.status(404).json({
        message: "Missing Data",
        code: "MISSING_DATA",
      });
      return;
    }
    const categoryID = +id;

    const modelUpdateCategory = await update(categoryID, name, description);

    if ("error" in modelUpdateCategory) {
      const status: number =
        ErrorStatusMap[modelUpdateCategory.code as ErrorCode] || 400;
      res.status(status).json(modelUpdateCategory);
      return;
    }
    res.status(200).json({
      message: "Successfully Updated",
      data: modelUpdateCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong ${(error as Error).message}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
export async function deleteCategory(
  req: Request<{}, {}, { name: string }>,
  res: Response
) {
  const { name } = req.body;
  try {
    if (!name) {
      res.status(400).json({
        message: "Missing Data",
        code: "MISSING_DATA",
      });
      return;
    }
    const modelDeleteCategory = await delete_(name);

    if ("error" in modelDeleteCategory) {
      const status: number =
        ErrorStatusMap[modelDeleteCategory.code as ErrorCode] || 400;
      res.status(status).json(modelDeleteCategory);
      return;
    }

    res.status(200).json({
      message: "Successfully Deleted",
      data: modelDeleteCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong ${(error as Error).message}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
