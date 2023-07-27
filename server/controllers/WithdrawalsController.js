const TryCatchHelper = require("../helpers/TryCatch");
const ResponseHandler = require("../helpers/modelResponseHandlers");
const GeneralAccount = require("../models/GeneralAccount");
const SavingsAccount = require("../models/SavingAccount");
const WithdrawsModel = require("../models/Withdrawals");
const {
  generalWithdrawsRules,
  savingsWithdrawsRules,
} = require("../rules/WithdrawalRules");
const SmsController = require("./SmsController");

class WithdrawalsController {
  constructor(req, res, accType) {
    (this.req = req),
      (this.res = res),
      (this.role = req.role),
      (this.withdrawId = req.params.withdrawId),
      (this.userId = req.userId),
      (this.accModel =
        accType == "general" ? new GeneralAccount() : new SavingsAccount()),
      (this.withdrawModel = new WithdrawsModel(req.body.amount, accType));
  }

  async makeWithdrawal() {
    const { data: accInfoRes, error: errAccInfo } = await TryCatchHelper(() =>
      this.accModel.getAccountByUserId(this.userId)
    );
    if (errAccInfo)
      return this.res
        .status(500)
        .json({ err: "Error while fetching account info" });
    const { status, id: accountId } = accInfoRes;
    if (status !== "active")
      return this.res.status(500).json({
        err: "You can not complete transaction because your account has been suspended",
      });
    const withdrawRuleController =
      this.accType == "general" ? generalWithdrawsRules : savingsWithdrawsRules;

    const { amount } = this.req.body;
    const { data: isEligbleToWithdraw, error } = await TryCatchHelper(() =>
      withdrawRuleController(accountId, amount)
    );

    if (error) return this.res.status(500).json({ err: error });

    if (!isEligbleToWithdraw)
      return this.res.status(401).json({
        err: "You have surpased the withdraw limit of today or You balance is too low to complete the transaction",
      });

    const { data: postWithdrawRes, error: errPostingWithdrawal } =
      await TryCatchHelper(() => this.withdrawModel.makeWithdrawal(accountId));

    if (errPostingWithdrawal)
      return this.res
        .status(500)
        .json({ err: "Error while posting withdrawal request" });

    new ResponseHandler(postWithdrawRes, this.res).withdrawResponse();
  }

  async updateWithdraw() {
    const { data: getWithdrawDetail, error: errGettingDepositDetail } =
      await TryCatchHelper(() =>
        this.withdrawModel.getWithdralById(this.withdrawId)
      );
    if (errGettingDepositDetail)
      return this.res
        .status(500)
        .json({ err: "Error while getting deposit details" });

    const {data: updtWithdrawInfo, error: errUpdtWithdrawInfo} = await TryCatchHelper(() => this.withdrawModel.updateWithdrawStatus(this.withdrawId,"completed"));
    if(errUpdtWithdrawInfo) return this.res.status(500).json({err: "Error while updating deposit status"});
    
    const {
      amount,
      account: { balance, id: accountId, user:{ phone }},
    } = getWithdrawDetail;
    const newAccBalance = balance - amount;
    const toFixedBalance = newAccBalance.toFixed(2)

    const { data: updtAccInfo, error: errUpdtAccInfo } = await TryCatchHelper(
      () => this.accModel.updateAccountBalance(accountId, newAccBalance)
    );
    if (errUpdtAccInfo)
      return this.res
        .status(500)
        .json({ err: "Error while updating account balance" });
  
      // Info user of succesful deposit
      SmsController(phone, `Your transaction of ID ${this.withdrawId} has been completed your new account balance is ${toFixedBalance}`);

    new ResponseHandler(updtAccInfo, this.res).updateResponse();
  }

  async getDeposits() {
    const { data: getDepositsInfo, error: errGetInfos } = await TryCatchHelper(
      () => this.withdrawModel.getWithdrawals
    );
    if (errGetInfos)
      return this.res
        .status(500)
        .json({ err: "Error while fetching withdraw details" });
    new ResponseHandler(getDepositsInfo, this.res).getResponse();
  }

  async getDeposit() {
    const { data: getDepositInfo, error: errGetInfo } = await TryCatchHelper(
      () => this.withdrawModel.getWithdralById(this.withdrawId)
    );
    if (errGetInfo)
      return this.res
        .status(500)
        .json({ err: "Error while fetching withdraw details" });

    new ResponseHandler(getDepositInfo, this.res).getResponse();
  }

  async deleteDeposit() {
    const { data: delDepositInfo, error: errDelInfo } = await TryCatchHelper(
      () => this.withdrawModel.deleteWithdrawById(this.withdrawId)
    );
    if(errDelInfo) return this.res.status(500).json({err: "Error while deleting withdraw details"});
    new ResponseHandler(delDepositInfo,this.res).deleteResponse();
  }
}

module.exports = WithdrawalsController;
