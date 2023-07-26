const TryCatchHelper = require("../../helpers/TryCatch");
const DepositsModel = require("../../models/Deposits");
const GeneralAccount = require("../../models/GeneralAccount");
const SavingsAccount = require("../../models/SavingAccount");
const ResponseHandlers = require("../../helpers/modelResponseHandlers");
const ResponseHandler = require("../../helpers/modelResponseHandlers");

class DepositController {
  constructor(req, res, accType) {
    (this.req = req), (this.userId = req.userId);
    this.res = res;
    (this.accType = accType),
      (this.accountModel =
        accType == "general" ? new GeneralAccount() : new SavingsAccount());
    this.depositId = req.params.depositId;
  }

  //   User Functionality
  async makeDeposit() {
    try {
      const accountInfo = await this.accountModel.getAccountByUserId(
        this.userId
      );
      const { status, id: accountId } = accountInfo;
      if (status !== "active")
        return this.res
          .status(401)
          .json({ err: "Your account has been suspended" });
      const { amount } = this.req.body;
      const depositModel = new DepositsModel(this.accType, amount);
      const { data: depositRes, error: depositErr } = await TryCatchHelper(() =>
        depositModel.makeDeposit(accountId)
      );
      if (depositErr)
        return this.res.status(500).json({ err: "Error while making deposit" });
      new ResponseHandlers(depositRes, this.res).depositResponse();
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({ err: "Unexpected error occured" });
    }
  }

  //   Admin Funcionality
  async updateDeposit() {
    const depositModel = new DepositsModel(this.accType, null);
    const { data: getDepositInfoRes, error: errGetDepositInfo } =
      await TryCatchHelper(() => depositModel.getDepositById(this.depositId));

    if (errGetDepositInfo)
      return this.res
        .status(500)
        .json({ err: "Error while fetching deposti details" });
    if (!getDepositInfoRes)
      return this.res.status(400).json({ err: "Invalid get deposit request" });

    const {
      amount,
      account: { id: accountId, balance },
    } = getDepositInfoRes;

    const newAccBalance = amount + balance;
    const { data: updateDepositRes, error: errUpdateDeposit } =
      await TryCatchHelper(() =>
        depositModel.updataDepositStatus(this.depositId, "completed")
      );
    if (errUpdateDeposit)
      return this.res
        .status(500)
        .json({ err: "Error while updating deposit status" });

    const { data: updateAccRes, error: errUpdatingAcc } = await TryCatchHelper(
      () => this.accountModel.updateAccountBalance(accountId, newAccBalance)
    );

    if (errUpdateDeposit)
      return this.res
        .status(500)
        .json({ err: "Unexpected Error please try again later" });

    // @TODO: Notify users via twilio after a successfully deposit a successful transactions
    new ResponseHandlers(updateAccRes, this.res).updateResponse();
  }

  async getDeposits() {
    const depositModel = new DepositsModel(this.accType, null);
    const { data: getDepositsRes, error: errGettingDeposits } =
      await TryCatchHelper(() => depositModel.getDeposits());
    if (errGettingDeposits)
      return this.res
        .status(500)
        .json({ err: "Error while fetching deposit details" });

    new ResponseHandler(getDepositsRes, this.res).getResponse();
  }

  async getDeposit() {
    const depositModel = new DepositsModel(this.accType, null);
    const { data: getDepositRes, error: errGettingDeposit } =
      await TryCatchHelper(() => depositModel.getDepositById(this.depositId));

    if(errGettingDeposit) return this.res.status(500).json({err: "Error while fetching deposit details"});
    new ResponseHandler(getDepositRes,this.res).getResponse();
  }

  async deleteDeposit() {
    const depositModel = new DepositsModel(this.accType, null);
    const { data: delDepositRes, error: errDelDeposit } = await TryCatchHelper(
      () => depositModel.deleteDepositById(this.depositId)
    );
    if (errDelDeposit)
      return this.res
        .status(500)
        .json({ err: "Error while deleting deposit details" });

    new ResponseHandlers(delDepositRes, this.res);
  }
}

module.exports = DepositController;
