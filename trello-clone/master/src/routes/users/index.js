const { Router } = require("express")
const user = require("../../controllers/users/index")
const validation = require("../../middlewares/validations/index")
const { checkJWT } = require("../../middlewares/index")

const router = Router()

router.post("/login", validation.validateLogin, user.login)
router.post("/signup", validation.signupValidate, user.signup)
router.post("/invite", checkJWT, validation.inviteValidate, user.invite)

module.exports = router
