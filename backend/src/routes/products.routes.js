import {Router} from "express"
import { upload } from '../middlewares/multer.middleware.js'
import { addProduct, allProducts, productDetail } from "../controllers/product.controller.js"
import {verifyJWT} from "../middlewares/adminAuth.middleware.js"

const router = Router()

router.route("/addProduct").post(verifyJWT,
    upload.fields([
        {
            name: "images",
            maxCount: 4
        }
    ]),
    addProduct
);

router.route("/getAllProducts").get(allProducts);
router.route("/:productId").get(productDetail);

export default router