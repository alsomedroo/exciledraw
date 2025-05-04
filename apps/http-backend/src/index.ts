import  express  from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { middleware } from "./middleware";

const app = express();

app.post("/signup", (req, res) => {
    res.json({
        roomId: 1,
    })
})
app.post("/signin", (req, res) => {


    const userId = 1; // This should be the ID of the user signing in
    const token = jwt.sign({
        userId 
    },JWT_SECRET);

    res.json({token})
})
//@ts-ignore
app.post("/room", middleware , (req, res) => {
    res.json({
        message: "Room created",
        roomId: 1
        
        
    })
})


app.listen(3000)