const TryCatchHelper = require("../helpers/TryCatch");
const SuspendController = require("./controllers/SuspendController");

class GeneralRules{
    constructor(accountsInfo,accountType){
        this.accountsInfo = accountsInfo,
        this.accType = accountType;
        const validateAccsInfo = () => {
            if(Array.isArray(this.accountsInfo)) return true
            return false
        };
        this.validater = () => {
           return validateAccsInfo()
        } 
    }

    // @TODO: Log errors for accounts with error while checking activations and removing suspensions
    async checkIfAccsIsActive (){
        const isAccsValid = this.validater();
        if (!isAccsValid) return false;
        for (let acc in this.accountsInfo){
            const { modifiedAt,id } = this.accountsInfo[acc];
            const suspendController = new SuspendController(this.accType,modifiedAt);
            const {data,error} = await TryCatchHelper(() => suspendController.generalSuspension(id));
            if (error) return false
            return true
        }
    }

    async removeSuspensions(){
        const isAccsValid = this.validater();
        if (!isAccsValid) return false;
        for(let acc in this.accountsInfo){
            const { suspensionDuration, id } = this.accountsInfo[acc];
            console.log(suspensionDuration);
            const suspendController = new SuspendController(this.accType,suspensionDuration);
            const {data,error} = await TryCatchHelper(() => suspendController.removeSuspension(id));
            if(error) return false
            return true
        }
    }

}



module.exports = GeneralRules