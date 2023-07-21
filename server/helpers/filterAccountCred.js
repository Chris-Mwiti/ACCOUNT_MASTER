const filterAccountCred = (data,role) => {
    if(role == 'admin'){
        if(Array.isArray(data)){
            return data
        }else if(typeof data == 'object' &&  data !== null){
            return data
        }else return undefined
    }else if (role == 'user'){
        if (typeof data == 'object' && data !== null){
            const {accountNumber,status,balance} = data
            return {accountNumber,status,balance}
        }
        return undefined
    }else{
        return undefined
    }
}

module.exports = filterAccountCred