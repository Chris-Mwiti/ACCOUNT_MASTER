const TryCatchHelper = require("../helpers/TryCatch");
const calculateInterest = require("../helpers/calculateCompoundInterest");
const SavingsAccount = require("../models/SavingAccount");

const compoundInterestController = async () => {
    const savingsModel =  new SavingsAccount();
    const {data: accountDetails, error} = await TryCatchHelper(() => savingsModel.getAccounts());
    if (error) return new Error("Unable to fetch accounts details");
    if (Array.isArray(accountDetails)) {
        for (let index in accountDetails) {
        const { balance, id: accountId } = accountDetails[index];
        console.log(accountId)
        const strInterest = calculateInterest(balance, 5, 0, 5);
        const interest = Number(strInterest);
        console.log(typeof interest);
        const newBalance = balance + interest;
        const savingsModel = new SavingsAccount();
        const { data: updtAccBalance, error: errUpdtAccBalance } =
            await TryCatchHelper(() =>
            savingsModel.updateAccountBalance(accountId, newBalance)
        );
        if (errUpdtAccBalance) new Error(`Error while updating account balance for this account id${accountId}`);
        }
    }else new Error("Savings accounts not valid");
    
};

module.exports = compoundInterestController
