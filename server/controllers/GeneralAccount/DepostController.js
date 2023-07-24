const TryCatchHelper = require("../../helpers/TryCatch");
const DepositsModel = require("../../models/Deposits");
const GeneralAccount = require("../../models/GeneralAccount");
const SavingsAccount = require("../../models/SavingAccount");
const ResponseHandlers = require('../../helpers/modelResponseHandlers');

class DepositController{
    constructor(req,res,accType){
        this.req = req,
        this.userId = req.userId
        this.res = res
        this.accType = accType
    }

    async makeDeposit(){
        try{
            const accountModel = this.accType == "general" ? new GeneralAccount() : new SavingsAccount();
            const accountInfo = await accountModel.getAccountByUserId(this.userId);
            const { status, id: accountId } = accountInfo
            if(status !== "active") return this.res.status(401).json({err: "Your account has been suspended"});
            const { amount } = this.req.body
            const depositModel = new DepositsModel(this.accType,amount)
            const {data: depositRes, error: depositErr} = await TryCatchHelper(() => depositModel.makeDeposit(accountId));
            if(depositErr) return this.res.status(500).json({err: "Error while making deposit"});
            new ResponseHandlers(depositRes,this.res).depositResponse();
            
        }catch(error){
            console.error(error)
            return this.res.status(500).json({err: "Unexpected error occured"});
        }
    }
}

module.exports = DepositController