const TryCatchHelper = require("../../helpers/TryCatch");
const GeneralAccount = require("../../models/GeneralAccount");
const SavingsAccount = require('../../models/SavingAccount')

class SuspendController {
  constructor(accType, date) {
    (this.accType = accType), (this.date = date);
  }

  async generalSuspension(accID) {
    const miliseconds = Date.parse(this.date);
    const sevenDaylimit =  5 * 60 * 1000;

    const timeStampDate = new Date(miliseconds);
    const currDate = new Date();
    const diffInMiliseconds = currDate - timeStampDate;

    if (diffInMiliseconds > sevenDaylimit) {
      const susDuration = Date.now() + 1 * 60 * 1000
      const susTimeStamp = new Date(susDuration);
      const model = this.accType == "general" ? new GeneralAccount() : new SavingsAccount();
      const {data, error} = await TryCatchHelper(() =>
        model.addSuspension(susTimeStamp,accID)
      );
      if (error) return new Error("Error while suspending account");
      console.log(data);
      return true;
    } else {
      return true
    }
  }

  async removeSuspension(accId){
    const model = this.accType == "general" ? new GeneralAccount() : new SavingsAccount();
    const currTimeStamp = Date.now()
    const dateToMilliSec = Date.parse(this.date);
    if(currTimeStamp >= dateToMilliSec){
        const {data,error} = await TryCatchHelper(() => model.removeSuspension(accId));
        if (error){
            console.log(error);
            return new Error("Error while deleting suspension of account")
        };
        console.log(data)
    }
    return true
  }

  
}

module.exports = SuspendController;
