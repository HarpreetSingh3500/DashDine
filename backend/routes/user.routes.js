import express from "express";
import isAuth from "../middlewears/isAuth.js";
import { getCurrentUser, updateUserLocation } from "../controllers/user.controllers.js";
const userRouter = express.Router();

// user route that first check token in cookies if exist then take data of user from DB (userId is in token)
userRouter.get("/current-user",isAuth,getCurrentUser)
userRouter.post("/update-location",isAuth,updateUserLocation)

export default userRouter;
