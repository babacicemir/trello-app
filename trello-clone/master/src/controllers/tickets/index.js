const columnRepository = require("../../repositories/columns")
const ticketRepository = require("../../repositories/tickets")
const usersRepository = require("../../repositories/users")

const createTicket = async(req, res) => {
   try{
     const {
        title,
        description,
        columnId,
        attachments,
        assignee,
        estimate
     } = req.body


     const { boardId } = req.params

     const user = await usersRepository.getUserByEmail(assignee)
     if (!user) {
      return res.status(401).json({ error: "User doesn't exist!" })
       }


     let finalColumnId = columnId

     if(!finalColumnId){
        const defaultColumnId = await columnRepository.findDefaultColumn(boardId)
        if(!defaultColumnId){
            return res.status(404).json({error: "Default column not found for this board ID."})
        }
        finalColumnId = defaultColumnId
        
     }
   
     const data = {
        title,
        description,
        columnId: finalColumnId,
        attachments,
        assignee,
        estimate,
        created_at: new Date()
     }


     const createdTicket = await ticketRepository.createNewTicket(data)
     if(!createdTicket){
        return res.status(400).json( { error: "Error occurred while creating a new ticket" } )
     }
     return res.status(200).json({
        message: "Successfully created a new ticket",
        createdTicket
     })
   }
   catch(error){
    return res.status(500).json({
      error: "Error creating a new ticket"
    })
   }
}

const readTicket = async(req, res) => {
   try{
      const { id } = req.params
      
      const findTicket = await ticketRepository.findTicketById(id)
      console.log(findTicket)
      if(!findTicket){
         return res.status(404).json({ error: "Ticket cannot be find with this ID" })
      }
      return res.status(200).json(findTicket)
   }
   catch(error){
      return res.status(500).json({
      error: "Error getting a ticket by ID"
    })
   }
}

module.exports = {
    createTicket,
    readTicket
}