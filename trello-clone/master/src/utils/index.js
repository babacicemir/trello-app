const bcrypt = require("bcrypt")
const hashPassword = (password) => {
  const encryptedPassword = bcrypt.hashSync(password, 10)
  return encryptedPassword
}

module.exports = { hashPassword }
