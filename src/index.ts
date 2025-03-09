import express from "express";
import { router as category } from "./route/routeCategory";
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/category", category);

app.listen(PORT, () => console.log(`Server is working on port ${PORT}!`));
