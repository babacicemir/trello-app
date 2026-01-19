const chai = require("chai")
const chaiHttp = require("chai-http")
const { app } = require("../app")
const user = require("./user")
const { createDatabaseConnectionTest } = require("../config/database")

chai.use(chaiHttp)
const expect = chai.expect

describe("E2E tests", () => {
  let code
  let token
  //const boardId = user.BOARD_ID
  let boardId
  const firstName = user.FIRST_NAME
  const lastName = user.LAST_NAME
  const email = user.USER_EMAIL
  const password = user.USER_PASSWORD
  const inviteEmail = user.EMAIL_INVITATION
  before(async () => {
    await createDatabaseConnectionTest()
    
  })

  describe("Signup API", () => {
    it("should signup a new user", async () => {
      const res = await chai.request(app)
        .post("/api/users/signup")
        .send({
          firstName,
          lastName,
          email,
          password
        })

      expect(res).to.have.status(200)
    })

    it("should return an error if required fields are missing", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/signup")
        .send({
          firstName,
          password,
        })

      expect(res).to.have.status(400)
      expect(res.body.errors).to.deep.equal([
        "Last name is a required field",
        "Email is a required field",
      ])
    })

    it("should return an error if the password is too short", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/signup")
        .send({
          firstName,
          lastName,
          email,
          password: "pass",
        })

      expect(res).to.have.status(400)
      expect(res.body).to.be.an("object")
      expect(res.body.errors).to.deep.equal([
        "Password should have a minimum length of 5",
      ])
    })

    it("should return an error if the password is too long", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/signup")
        .send({
          firstName,
          lastName,
          email,
          password: "sifrasifra123456789",
        })

      expect(res).to.have.status(400)
      expect(res.body.errors).to.deep.equal([
        "Password should have a maximum length of 15",
      ])
    })

    it("should return an error if the email format is invalid", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/signup")
        .send({
          firstName,
          lastName,
          email: "test",
          password,
        })

      expect(res).to.have.status(400)
      expect(res.body.errors).to.deep.equal([
        "Email should be a valid email address",
      ])
    })

    it("should return an error if the password contains special characters", async () => {
      const res = await chai
        .request(app)
        .post("/api/users/signup")
        .send({
          firstName,
          lastName,
          email,
          password: "sifra123!",
        })

      expect(res).to.have.status(400)
      expect(res.body.errors).to.deep.equal([
        "Password should only contain alphanumeric characters",
      ])
    })
  })


  describe("Login API ", () => {
    it("should login the user and get a token", async () => {
      const res = await chai.request(app)
        .post("/api/users/login")
        .send({
          email,
          password,
        })
      expect(res).to.have.status(200)
      expect(res.body).to.have.property("data")
      expect(res.body.data).to.have.property("token")
      token = res.body.data.token
    })

    it("should return an error for invalid password", async () => {
      await chai
        .request(app)
        .post("/api/users/login")
        .send({ email, password: "lozinka" })
        .end((err, res) => {
          expect(res).to.have.status(401)
          expect(res.body).to.have.property("error")
        })
    })

    it("should return an error if required fields are missing", async () => {
      await chai
        .request(app)
        .post("/api/users/login")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body.errors).to.deep.equal([
            "Email is a required field",
            "Password is a required field",
          ])
        })
    })

    it("should return an error if the email format is invalid", async () => {
      await chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "test.com",
          password,
        })
        .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body.errors).to.deep.equal([
            "Email should be a valid email address",
          ])
        })
    })
  })

  describe("Create board for invitation tests", () => {
  it("should create a board", async () => {
    const res = await chai.request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Invite board test"
      })

    expect(res).to.have.status(201)
    expect(res.body).to.have.property("createdBoard")
    expect(res.body.createdBoard).to.have.property("id")

    boardId = res.body.createdBoard.id
  })
  })


  describe("Send invite API", () => {
  it("should send an invite to another user", async () => {
    const res = await chai.request(app)
      .post("/api/users/invite")
      .set("Authorization", `Bearer ${token}`)
      .send({
        idBoard: boardId,
        email: inviteEmail
      })

    expect(res).to.have.status(200)
    expect(res.body).to.have.property("confirmationCode")

    code = res.body.confirmationCode
  })

  it("should return error if user is already invited", async () => {
    const res = await chai.request(app)
      .post("/api/users/invite")
      .set("Authorization", `Bearer ${token}`)
      .send({
        idBoard: boardId,
        email: inviteEmail
      })

    expect(res).to.have.status(400)
    expect(res.body).to.have.property("error")
  })

  it("should return error if required fields are missing", async () => {
    const res = await chai.request(app)
      .post("/api/users/invite")
      .set("Authorization", `Bearer ${token}`)
      .send({})

    expect(res).to.have.status(400)
    expect(res.body.errors).to.include("Board ID is required.")
    expect(res.body.errors).to.include("Email is required.")
  })
})



  describe("Accept invite API", () => {
    it("should accept the invitation", async () => {
      const res = await chai.request(app)
        .get(`/api/boards/${boardId}/join/${code}`)
      expect(res).to.have.status(200)
    })

    it("should return an error when invitation is already accepted", async () => {
      const invitation = {
        acceptedInvitation: true,
        email: inviteEmail
      }
      const res = await chai.request(app)
        .get(`/api/boards/${boardId}/join/${code}`)

      expect(res).to.have.status(400)
    })
  })
})
