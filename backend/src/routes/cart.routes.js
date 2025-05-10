import {Router} from "express"
import { removeProduct, changeQuantity, addProduct, getCart } from "../controllers/cart.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addProduct/:productId").post(verifyJWT, addProduct);
router.route("/removeProduct/:productId").delete(verifyJWT, removeProduct);
router.route("/changeQuantity/:productId").put(verifyJWT, changeQuantity);
router.route("/getCart/:cartId").get(verifyJWT, getCart);


export default router