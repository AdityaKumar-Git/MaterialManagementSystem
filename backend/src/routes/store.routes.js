import {Router} from "express"
import { storeDetail } from "../controllers/store.controller.js"

const router = Router()

router.route("/storeItems").get(storeDetail)

export default router