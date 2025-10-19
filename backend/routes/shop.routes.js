import express from "express"
import isAuth from "../middlewears/isAuth.js";
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js"
import { upload } from "../middlewears/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth,upload.single("image"), createEditShop);
shopRouter.get("/get-my",isAuth, getMyShop);
shopRouter.get("/get-by-city/:city",isAuth, getShopByCity);

export default shopRouter