import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http"
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const server = http.createServer(app);
const io = new Server(server,{
   cors:{
    origin: "http://localhost:5173",
    credentials: true,
    methods:['POST','GET']
  },
})

app.set("io",io)

// backend port
const port = process.env.PORT || 5000;

//global middlewears
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// middlewear for authentication routes
app.use("/api/auth", authRouter);
// middlewear for user routes
app.use("/api/user", userRouter);
// middlewear for shop routes
app.use("/api/shop",shopRouter)
// middlewear for item routes
app.use("/api/item",itemRouter)
// middlewear for order routes
app.use("/api/order",orderRouter)

socketHandler(io)
// start server listening
server.listen(port, () => {
  connectDb();
  console.log("Server is listening to", port);
});
