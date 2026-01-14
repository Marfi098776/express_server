import express, { NextFunction, Request, Response } from "express"
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();
const port = config.port;

// parser
app.use(express.json())

// initializing DB
initDB()

// logger middleware
app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next LEVEL developers!')
})

// users CRUD
app.use("/users", userRoutes);
// todos CRUD
app.use("/todos", todoRoutes);
// auth
app.use("/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    })
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
