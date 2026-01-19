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

    console.log(ticket)

    const createdTicket = await ticket.save()
    return createdTicket
}

const findTicketById = async(id) => {
    const ticket = Ticket.findOne( { id } )
    return ticket
}

const updateTicket = async(id, updateData) => {
    console.log(id, updateData)
    const ticket = await Ticket.findOne( { id } )
    if(!ticket){
        return null
    }

    if(updateData.title!==undefined) ticket.title = updateData.title
    if(updateData.description!==undefined) ticket.description = updateData.description
    if(updateData.columnId!==undefined) ticket.columnId = updateData.columnId
    if(updateData.attachments!==undefined)  ticket.attachments = updateData.attachments
    if(updateData.assignee!==undefined) ticket.assignee = updateData.assignee
    if(updateData.estimate!==undefined) ticket.estimate = updateData.estimate

    await ticket.save()

    return ticket
}

module.exports = {
    createNewTicket,
    findTicketById,
    updateTicket
}