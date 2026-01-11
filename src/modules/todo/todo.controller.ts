import { Request, Response } from "express";
import { todoServices } from "./todo.services";
import { pool } from "../../config/db";

const createTodo = async(req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try{
        const result = await todoServices.createTodo(user_id as string, title)
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
}

const getTodo = async(req: Request, res: Response) => {
    try{
        const result = await todoServices.getTodo()

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
}

const getSingleTodo = async(req: Request, res: Response) => {
    try{
        const result = await todoServices.getSingleTodo(req.params.id as string)

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
}

const updateTodo = async(req: Request, res: Response) => {
    const { user_id, title } = req.body;
    // console.log("user_id: ", user_id, "title: ", title);
    try{
        const result = await todoServices.updateTodo(user_id, title, req.params.id as string);

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
}

const deleteTodo = async(req: Request, res: Response) => {
    try{
        const result = await todoServices.deleteTodo(req.params.id as string);

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
}

export const todoController = {
    createTodo,
    getTodo,
    getSingleTodo,
    updateTodo,
    deleteTodo,
}