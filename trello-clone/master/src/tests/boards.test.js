const chai = require("chai")
const chaiHttp = require("chai-http")
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const { app } = require("../app")
const user = require("./user")
const { createDatabaseConnectionTest } = require("../config/database")

chai.use(chaiHttp)
chai.use(sinonChai)
const expect = chai.expect

let token
let boardId

describe("Create board API", () => {
  const email = user.USER_EMAIL
  const firstName = user.FIRST_NAME
  const lastName = user.LAST_NAME
  const password = user.USER_PASSWORD
  const roleSet = user.ROLE_SET
  const inviteEmail = user.EMAIL_INVITATION

  let postStub

  before(async () => {
    await createDatabaseConnectionTest()

    const signupRes = await chai.request(app)
      .post("/api/users/signup")
      .send({
        firstName,
        lastName,
        email,
        password,
      })
    expect(signupRes).to.have.status(200)


    const loginRes = await chai.request(app)
      .post("/api/users/login")
      .send({
        email,
        password,
      })

    token = loginRes.body.data.token


    postStub = sinon.stub(chai.request(app), "post")
  })

  after(() => {
    postStub.restore()
  })

  it("should create a new board", async () => {
    postStub
      .withArgs("/api/boards")
      .returns(
        Promise.resolve({
          body: {
            createdBoard: { id: "test-board-id" }
          },
          status: 201
        })
      )

    const res = await chai.request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Board 1",
        users: [
          { email: inviteEmail, role: roleSet }
        ]
      })

    expect(res).to.have.status(201)
    expect(res.body).to.have.property("createdBoard")
    boardId = res.body.createdBoard.id
  }).timeout(20000)

  it("should return an error when no token is provided", async () => {
    const res = await chai.request(app)
      .post("/api/boards")
      .send({
        name: "Test Board 2",
        users: [
          { email: inviteEmail, role: roleSet }
        ]
      })

    expect(res).to.have.status(401)
  })

  it("should return an error when creating a board with missing name", async () => {
    const res = await chai.request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        users: [
          { email: inviteEmail, role: roleSet }
        ]
      })

    expect(res).to.have.status(400)
  })

  it("should return an error when creating a board with invalid user emails", async () => {
    const res = await chai.request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Board 4",
        users: [
          { email: "invalidEmail", role: roleSet }
        ]
      })

    expect(res).to.have.status(400)
  })
})


describe("Get one board API", () => {
  it("should get a board by ID", async () => {
    const res = await chai.request(app)
      .get(`/api/boards/${boardId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.have.property("id", boardId)
  })

  it("should return an error when board doesn't exist", async () => {
    const invalidBoardId = "invalid"
    const res = await chai.request(app)
      .get(`/api/boards/${invalidBoardId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res).to.have.status(404)
  })
})


describe("All boards API", () => {
  it("should get all boards", async () => {
    const res = await chai.request(app)
      .get("/api/boards")
      .set("Authorization", `Bearer ${token}`)
    expect(res).to.have.status(200)
  })
})
