import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
//@ts-ignore
import { middleware } from "./middleware";
import { createUserSchema, signInSchema, createRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in environment");
}

const app = express();
app.use(express.json());

//@ts-ignore
app.post("/signup", async (req, res) => {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect input" });
  }

  const { username, password, name } = parsedData.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: username,
        password: hashedPassword,
        name,
      },
    });

    res.json({ userId: user.id });
  } catch (e) {
    
    res.status(411).json({ message: "User already exists or error occurred" });
  }
});

//@ts-ignore
app.post("/signin", async (req, res) => {
  const parsedData = signInSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect input" });
  }

  const { username, password } = parsedData.data;

  const user = await prismaClient.user.findUnique({
    where: { email: username },
  });

  if (!user) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({ token });
});

//@ts-ignore
app.post("/room", middleware, async (req , res) => {
  const parsedData = createRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect input" });
  }

  const userId = req.userId;

  try{
    const room = await prismaClient.room.create({
      //@ts-ignore
    data: {
      slug: parsedData.data.name ?? "",
      adminId: userId,
    },
  });

  res.json({ roomId: room.id });
  }catch(e){
    res.status(411).json({
      message:"room already exist"
    })
  }
});

app.get("/chats/:roomId", async(req,res)=>{
  const roomId = Number(req.params.roomId)

  const messages = await prismaClient.chat.findMany({
    where:{
      //@ts-ignore
      roomId: roomId
    },
    orderBy: {
      id: "desc"
    },
    take: 50
  })
  res.json({
    messages
  })
})

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
