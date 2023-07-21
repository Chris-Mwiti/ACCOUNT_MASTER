const filterUserDetails = (data) => {
    if (Array.isArray(data)){
        return data.map((user) => {
            const {id,firstName,lastName,userName,email,idNumber,role} = user
            return {id,firstName,lastName,userName,email,idNumber,role}
        })
    }else if (typeof data == 'object' && data !== null){
        const filteredInfo = {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            idNumber: data.idNumber,
            role: data.role
        }
        return filteredInfo
    }else return null
}

module.exports = filterUserDetails