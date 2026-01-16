const columnRepository  = require("../../repositories/columns")
const boardRepository = require("../../repositories/boards")
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
        if(error.code===11000){
            return res.status(400).json({
                error: `Column with name "${err.keyValue.name}" already exists in this board.`,
            })
        }
        return res.status(500).json({ error: "Error creating new column." })
    }

}

const updateColumn = async(req, res) => {
    try{
        const { name, isDefault } = req.body;
        const { columnId } = req.params;
        
        if (!name && typeof isDefault === "undefined"){
            return res.status(400).json({message: "Nothing to update!"})
        }

        const updateData = {
            name,
            isDefault
        }

        const updatedColumn = await columnRepository.editColumn(columnId, updateData)

        if(!updatedColumn){
            return res.status(404).json({
                error: "Column not found!"
            })
        }

        return res.status(200).json({
            message: "Column is successfully updated!",
            updatedColumn
        })

    }
    catch(error){
        return res.status(500).json({
            error: "Error updating column."
        })
    }
}

module.exports = { 
    createColumn,
    updateColumn
 }