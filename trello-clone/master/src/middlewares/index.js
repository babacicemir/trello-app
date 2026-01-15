const jwt = require("jsonwebtoken")
const { getUserById } = require("../repositories/users")
const { getBoardById } = require("../repositories/boards")

const checkJWT = async (req, res, next) => {
  let token = req.header("Authorization")
  if (!token) {
    return res.status(401).json({ error: "Missing token" })
  }
  token = token.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_CODE)
    const user = await getUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" })
  }
}

const checkAccess = (expectedRole) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params
      const board = await getBoardById(id)

      if (!board) {
        return res.status(404).json({ error: "Board not found" })
      }

      const user = board.users.find(
        u => u.email === req.user.email && u.role === expectedRole
      )

      if (!user) {
        return res.status(403).json({ error: "Access denied" })
      }

      next()
    } catch (error) {
      res.status(400).json(error)
    }
  }
}

module.exports = { checkJWT, checkAccess }
