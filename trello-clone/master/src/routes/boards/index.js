const { Router } = require("express")
const { checkJWT } = require("../../middlewares/index")
const user = require("../../controllers/users")
const board = require("../../controllers/boards")
const validation = require("../../middlewares/validations/index")

const router = Router()

router.get("/", checkJWT, board.readAllBoards)
router.post("/", checkJWT, validation.boardValidate, board.createBoard)
router.get("/:id/join/:code", user.acceptInvite)
router.get("/:id", checkJWT, board.readBoard)

module.exports = router
