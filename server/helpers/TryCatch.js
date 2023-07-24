const TryCatchHelper = async (func) => {
    let data = null
    let error = null
    try{
        const response = await func();
        data = response
    }catch(err){
        console.error(err);
        error = err
    }

    return {data,error}
}

module.exports = TryCatchHelper