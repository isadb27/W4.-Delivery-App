import { Router } from "express"
import { getAllStores } from "./store.controller"

const router = Router()

router.get("/", getAllStores)

export default router