import express, { NextFunction, Request, Response } from "express"
import {Pool} from "pg";
import dotenv from "dotenv";
import path from "path";
import { setDefaultCACertificates } from "tls";
import { title } from "process";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;

// parser
app.use(express.json())

// DB
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
})

const initDB = async() => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
        
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
}
initDB()

//logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
    next();
}

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next LEVEL developers!')
})

// users CRUD
app.post("/users", async(req: Request, res: Response) => {
    const {name, email} = req.body;

    try{
        const result = await pool.query(`INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]);
        res.status(201).json({
            success: false,
            message: "Data Inserted successfully",
            data: result.rows[0],
        });
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})

app.get("/users", logger, async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM users`);

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        })
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
})

app.get("/users/:id", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);

        if(result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }else{
            res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: result.rows[0],
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

app.put("/users/:id", async(req: Request, res: Response) => {
    const { name, email } = req.body;
    try{
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, req.params.id]);

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        } else{
            res.status(200).json({
                success: true,
                message: "user updated successfully",
                data: result.rows[0],
            });
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

app.delete("/users/:id", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);

        if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }else{
            res.status(200).json({
                success: true,
                message: "Users deleted successfully",
                data: result.rows,
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

// todos CRUD
app.post("/todos", async(req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try{
        const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]);
        res.status(201).json({
            success: true,
            message: "todo created",
            data: result.rows[0],
        })
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        })

    }
})

app.get("/todos", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM todos`);

        res.status(200).json({
            success: true,
            message: "todos retrieved successfully",
            data: result.rows,
        })
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
})

app.get("/todos/:id", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [req.params.id]);

        if(result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "todos not found",
            });
        }else{
            res.status(200).json({
                success: true,
                message: "todos fetched successfully",
                data: result.rows[0],
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

app.put("/todos/:id", async(req: Request, res: Response) => {
    const { user_id, title } = req.body;
    console.log("user_id: ", user_id, "title: ", title);
    try{
        const result = await pool.query(`UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`, [user_id, title, req.params.id]);

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: "todo not found",
            })
        } else{
            res.status(200).json({
                success: true,
                message: "todo updated successfully",
                data: result.rows[0],
            });
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

app.delete("/todos/:id", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [req.params.id]);

        if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "todo not found",
            });
        }else{
            res.status(200).json({
                success: true,
                message: "todo deleted successfully",
                data: result.rows,
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
})

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
