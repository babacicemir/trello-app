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
    if (user) {
      next()
    } else {
      return res.status(401).json({ error: "Unauthorized" })
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" })
  }
}

const checkAccess = (expectedRole) => {
  return async (req, res, next) => {
    let token = req.header("Authorization")
    if (!token) {
      return res.status(401).json({ error: "Missing token" })
    }
    token = token.split(" ")[1]

    try {
      const { id } = req.params
      const decoded = jwt.verify(token, process.env.TOKEN_CODE)
      const board = await getBoardById(id)
      const user = board.users.find(users => users.email === decoded.email && users.role === expectedRole)
      if (user) {
        next()
      } else {
        res.status(403).json({ error: "Access denied" })
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }
}

module.exports = { checkJWT, checkAccess }
