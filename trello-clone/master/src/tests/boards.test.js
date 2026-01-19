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
let columnId
let ticketId
let INVALID_TICKET_ID = user.INVALID_TICKET_ID

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


describe ("Columns API", () => {
  it("should create a column", async() => {
    const res = await chai.request(app)
      .post("/api/boards/columns")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Todo Column", boardId })
    expect(res).to.have.status(200)
    columnId=res.body.column.id
  })
 
  it("should return error if no token is provided", async () => {
    const res = await chai.request(app)
      .put(`/api/boards/columns`)
      .send({ name: "Todo Column", boardId })

    expect(res).to.have.status(401)
  })

  it("should fail to create a column with invalid boardId", async() => {
    const res = await chai.request(app)
      .post("/api/boards/columns")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Invalid Column", boardId: 1 })
    expect(res).to.have.status(400)
  })

  it("should update a column name and set as default", async() => {
    const res = await chai.request(app)
      .put(`/api/boards/columns/${columnId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "In Progress", isDefault: true })
    expect(res).to.have.status(200)
  })

  it("should fail to update a non-existing column", async () => {
      const res = await chai.request(app)
        .put("/api/boards/columns/nonexistent-column")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Doesn't Exist" });
      expect(res).to.have.status(404);
    })
})

describe("Ticket API", () => {
  let id
  it("should create a new ticket", async() => {
    const res = await chai.request(app)
    .post(`/api/boards/${boardId}/tickets`)
    .set("Authorization", `Bearer ${token}`)
    .send({
          title: "Test Ticket",
          description: "This is a test ticket",
          columnId: columnId,
          attachments: ["https://example.com/file1.png"],
          assignee: user.USER_EMAIL,
          estimate: 5
    })
    expect(res).to.have.status(200)
    expect(res.body.createdTicket).to.have.property("title", "Test Ticket")
    ticketId = res.body.createdTicket.id
    id = res.body.createdTicket.id
  })

  it("should fail to create a ticket with non-existent assignee", async () => {
    const res = await chai.request(app)
      .post(`/api/boards/${boardId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Ticket with invalid assignee",
        description: "This should fail",
        columnId: columnId,
        assignee: "nonexistent@test.com",
        estimate: 2,
      });

    expect(res).to.have.status(401)
    expect(res.body).to.have.property("error", "User doesn't exist!")
  })


  it("should fail to create a ticket without title", async () => {
    const res = await chai.request(app)
      .post(`/api/boards/${boardId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "No title here",
        columnId: columnId,
        assignee: user.USER_EMAIL,
        estimate: 2,
      })

    expect(res).to.have.status(400)
    expect(res.body.errors).to.include("Title is required")
  })

  it("should get a ticket by ID successfully", async () => {
    const res = await chai.request(app)
      .get(`/api/boards/${boardId}/ticket/${id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res).to.have.status(200)
    expect(res.body).to.have.property("id", ticketId)
    expect(res.body).to.have.property("title")
    expect(res.body).to.have.property("columnId")
  })

  it("should return error for non-existent ticket ID", async () => {
    const res = await chai.request(app)
      .get(`/api/boards/${boardId}/ticket/${INVALID_TICKET_ID}`)
      .set("Authorization", `Bearer ${token}`)

      expect(res).to.have.status(404)
  })

  it("should update a ticket successfully", async () => {
    const res = await chai.request(app)
      .put(`/api/boards/${boardId}/ticket/${ticketId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Ticket Title",
        description: "Updated description",
        estimate: 8
      })

    expect(res).to.have.status(200)
    expect(res.body).to.have.property("message", "Ticket is successfully updated")
  })

  it("should return error when updating non-existent ticket", async () => {
    const invalidTicketId = "nonexistent-ticket-id";
    const res = await chai.request(app)
      .put(`/api/boards/${boardId}/ticket/${invalidTicketId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Should not update"
      })

    expect(res).to.have.status(404)
    expect(res.body).to.have.property("error", "Ticket not found")
  })

  it("should return error if no token is provided", async () => {
    const res = await chai.request(app)
      .put(`/api/boards/${boardId}/ticket/${ticketId}`)
      .send({
        title: "Updated Ticket Title"
      });

    expect(res).to.have.status(401)
  })

  it("should return error if title is too short", async () => {
    const res = await chai.request(app)
      .put(`/api/boards/${boardId}/ticket/${ticketId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "a"
      })

    expect(res).to.have.status(500)
  })
})


