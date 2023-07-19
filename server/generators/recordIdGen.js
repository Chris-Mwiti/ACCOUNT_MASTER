const { v4: uuidv4 } = require('uuid')

const recordIdGenerator = (prefix) => {
    const id = uuidv4();
    const recordId = `${prefix}_${id}`
    return recordId
}


module.exports = recordIdGenerator;