import express from "express"
import isAuth from "../middlewears/isAuth.js";
import { addItem, deleteItem, editItem, getItemByCity, getItemById, getItemsByShop, rating, searchItems } from "../controllers/item.controller.js";
import { upload } from "../middlewears/multer.js";

const itemRouter = express.Router()

itemRouter.post("/add-item",isAuth,upload.single("image"),addItem); 
itemRouter.post("/edit-item/:itemId",isAuth,upload.single("image"),editItem); 
itemRouter.post("/rating",isAuth,rating)
itemRouter.get("/get-by-id/:itemId", isAuth, getItemById);
itemRouter.get("/get-by-city/:city", isAuth, getItemByCity);
itemRouter.get("/get-by-shop/:shopId", isAuth, getItemsByShop);
itemRouter.get("/search-items", isAuth, searchItems);
itemRouter.get("/delete/:itemId", isAuth, deleteItem);

export default itemRouter