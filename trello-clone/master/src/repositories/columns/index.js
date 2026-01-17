const Column = require("../../models/column")
const uuid = require("uuid")

const createNewColumn = async(data) => {
    const column = new Column({
        id: uuid.v4(),
        name: data.name,
        boardId: data.boardId,
        default: data.isDefault
    })
    console.log(column)
    const createdColumn = await column.save()
    return createdColumn
}

const unsetDefaultColumns = async(boardId) => {
    const columns = await Column.find({boardId, default: true})

    for(const col of columns){
        col.default=false
        await col.save()
    }

}

const editColumn = async(columnId, updateData) => {
    const column = await Column.findOne( { id: columnId } )

    if(!column){
        return null
    }

    if(updateData.isDefault===true){
        await unsetDefaultColumns(column.boardId)
        column.default=true
    }

    if(updateData.isDefault===false){
        column.default=false
    }

    if(updateData.name!==undefined){
        column.name=updateData.name
    }

    await column.save()

    return column
}

const findDefaultColumn = async(boardId) => {
    const defaultColumn = await Column.findOne({default : true, boardId: boardId})
    return defaultColumn.id
}



module.exports = {
    createNewColumn,
    editColumn,
    findDefaultColumn
}