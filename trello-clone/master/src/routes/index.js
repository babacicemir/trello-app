const { Router } = require("express")
const userRouter = require("./users")
const boardRouter = require("./boards")

const router = Router()

router.use("/users", userRouter)
router.use("/boards", boardRouter)

module.exports = router
