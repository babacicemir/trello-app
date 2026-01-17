const { Router } = require("express")
const { checkJWT } = require("../../middlewares/index")
const user = require("../../controllers/users")
const board = require("../../controllers/boards")
const column = require("../../controllers/columns")
const ticket = require("../../controllers/tickets")
const validation = require("../../middlewares/validations/index")

const router = Router()

router.get("/", checkJWT, board.readAllBoards)
router.post("/", checkJWT, validation.boardValidate, board.createBoard)
router.get("/:id/join/:code", user.acceptInvite)
router.get("/:id", checkJWT, board.readBoard)
router.put("/:boardId", checkJWT, board.updateBoard)

router.post("/columns", checkJWT, validation.columnValidate, column.createColumn)
router.put("/columns/:columnId", checkJWT, column.updateColumn)

router.post("/:boardId/tickets", checkJWT, validation.ticketValidate, ticket.createTicket)
router.get("/:boardId/ticket/:id", checkJWT, ticket.readTicket)
router.put("/:boardId/ticket/:id", checkJWT, ticket.updateTicket)
module.exports = router
