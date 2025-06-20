import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema, signInSchema, createRoomSchema} from "@repo/common/types"

const app = express()

app.use(express.json())

//@ts-ignore
app.post("/signup",async(req,res)=>{
    const data = createUserSchema.safeParse(req.body)
    if(!data.success){
        return res.json({
            message:"Incorrect"
        })
    }
    res.json({
        userId:"123"
    })
})

//@ts-ignore
app.post("/signin",async(req,res)=>{

    const data = signInSchema.safeParse(req.body)
    if(!data.success){
        return res.json({
            message:"Incorrect"
        })
    }

    const userId = 1;
    const token = jwt.sign({
        userId
    },JWT_SECRET)
    res.json({
        token
    })

})
//@ts-ignore
app.post("/room",middleware,async(req,res)=>{
    const data = createRoomSchema.safeParse(req.body)
    if(!data.success){
        return res.json({
            message:"Incorrect"
        })
    }

    res.json({
        userId:"123"
    })
})

app.listen(3001)