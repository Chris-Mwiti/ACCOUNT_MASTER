const TryCatchHelper = require("../helpers/TryCatch");
const WithdrawsModel = require("../models/Withdrawals");
const SavingsAccount = require('../models/SavingAccount');
const GeneralAccount = require('../models/GeneralAccount');

const savingsWithdrawsRules = async (accountId,amount) => {
    const withdrawsModel = new WithdrawsModel(null, "savings");
    const {data: counts, error} = await TryCatchHelper(() => withdrawsModel.countWithdrawalsByDate('2023-07-25',accountId));
    if (error) return new Error("Error while fetching number of fields");
    if(counts > 2) return false

    const savingsModel = new SavingsAccount()
    const {data: accountInfo, error: errGettingWithdrawInfo} = await TryCatchHelper(() => savingsModel.getAccountInfoById(accountId))
    if(errGettingWithdrawInfo) return new Error("Error while getting account information");

    const {balance} = accountInfo
    if(amount > balance) return false

    return true

}

const generalWithdrawsRules = async (accountId,amount) => {
    const withdrawsModel = new WithdrawsModel(null, "general");
    const {data: counts, error} = await TryCatchHelper(() => withdrawsModel.countWithdrawalsByDate('2023-07-25',accountId));
    if (error) return new Error("Error while fetching number of fields");

    if(counts > 5) return false

    const generalModel = new GeneralAccount();
    const {data: accountInfo, error: errGettingAccInfo} = await TryCatchHelper(() => generalModel.getAccountInfoById(accountId));
    if (errGettingAccInfo) return new Error("Error while getting account information");

    const {balance} = accountInfo;
    console.log(balance);
    if (amount > balance) return false

    return true

}

module.exports = {
    savingsWithdrawsRules,
    generalWithdrawsRules
}