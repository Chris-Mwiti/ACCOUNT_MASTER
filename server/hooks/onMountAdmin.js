const GeneralRules = require("../rules/GeneralRules");

class OnMountAdmin extends GeneralRules{
    constructor(accountsInfo,accType){
        super(accountsInfo,accType)
    }

    async onMountGeneral(){
       const isAccsValid =  await super.checkIfAccsIsActive();
       const removeSuspensions = await super.removeSuspensions();
       return {isAccsValid, removeSuspensions}
    }
}

module.exports = OnMountAdmin