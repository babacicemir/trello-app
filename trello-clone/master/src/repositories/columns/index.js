const Column = require("../../models/column")
const uuid = require("uuid")

const createNewColumn = async(data) => {
    const column = new Column({
        id: uuid.v4(),
        name: data.name,
        boardId: data.boardId,
        default: data.default
    })
    console.log(column)
    const createdColumn = await column.save()
    return createdColumn
}

module.exports = {
    createNewColumn,
}