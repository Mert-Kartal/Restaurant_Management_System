import express from "express";
import categoryRouter from "./route/routeCategory";
import productRouter from "./route/routeProduct";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.listen(PORT, () => console.log(`Server is working on port ${PORT}!`));
//# sourceMappingURL=index.js.map