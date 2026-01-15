const columnRepository  = require("../../repositories/columns")
const randomString = require("randomstring");

const createColumn = async(req, res) => {
    try{
        const {
            name,
            boardId,
            isDefault
        } = req.body;

        const data = { name, boardId, default: isDefault || false};

        const newColumn = await columnRepository.createNewColumn(data);


        return res.status(200).json(
            {
                message: "Column is successfully created!",
                column: newColumn,

            }
        )

    }
    catch(error){
        if(error===11000){
            return res.status(400).json({
                error: `Column with name "${err.keyValue.name}" already exists in this board.`,
            })
        }
        return res.status(500).json({ error: "Error creating new column." })
    }

}

module.exports = { 
    createColumn,
 }