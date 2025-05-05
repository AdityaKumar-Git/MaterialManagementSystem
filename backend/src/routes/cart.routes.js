import {Router} from "express"
import { removeProduct, changeQuantity, addProduct } from "../controllers/cart.controller.js"
import {verifyJWT} from "../middlewares/adminAuth.middleware.js"

const router = Router()

router.route("/addProduct/:productId").post(verifyJWT, addProduct);
router.route("/removeProduct/:productId").delete(verifyJWT, removeProduct);
router.route("/changeQuantity/:productId").put(verifyJWT, changeQuantity);

export default router