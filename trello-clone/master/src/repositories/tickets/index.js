const Ticket = require("../../models/ticket")
const  uuid  = require("uuid")

const createNewTicket = async(ticketData) => {
    const ticket = new Ticket({
        id: uuid.v4(),
        title: ticketData.title,
        description: ticketData.description,
        columnId: ticketData.columnId,
        attachments: ticketData.attachments,
        assignee: ticketData.assignee ,
        estimate: ticketData.estimate,
        created_at: ticketData.created_at, 
    })


    const createdTicket = await ticket.save()
    return createdTicket
}

module.exports = {
    createNewTicket,
}