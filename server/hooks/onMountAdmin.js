const GeneralRules = require("../rules/GeneralRules");

// @TODO: Refactor the code such that all suspesions are made on one single mount function
class OnMountAdmin extends GeneralRules{
    constructor(accountsInfo,accType){
        super(accountsInfo,accType)
    }

    async onMountGeneral(){
       const isGenAccsValid =  await super.checkIfAccsIsActive();
       const removeGenSuspensions = await super.removeSuspensions();
       return {isGenAccsValid, removeGenSuspensions}
    }

    async onMountSavings(){
       const isSavAccsValid =  await super.checkIfAccsIsActive();
       const removeSavSuspensions = await super.removeSuspensions();
       return {isSavAccsValid, removeSavSuspensions}
    }
}

module.exports = OnMountAdmin