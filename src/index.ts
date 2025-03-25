import express from "express";
import categoryRouter from "./route/routeCategory";
import productRouter from "./route/routeProduct";
import ingredientRouter from "./route/routeIngredient";
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/ingredient", ingredientRouter);

app.listen(PORT, () => console.log(`Server is working on port ${PORT}!`));
