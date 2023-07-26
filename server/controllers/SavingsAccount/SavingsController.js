const filterAccountCred = require("../../helpers/filterAccountCred");
const SavingsAccount = require("../../models/SavingAccount");
const UsersModel = require("../../models/Users");
const CreationRules = require("../../rules/CreationRules");
const ResponseHandlers = require("../../helpers/modelResponseHandlers");
const TryCatchHelper = require("../../helpers/TryCatch");

class SavingsAccountController {
  constructor(req, res) {
    (this.res = res),
      (this.req = req),
      (this.userId = req.userId),
      (this.role = req.role);
  }

  async createAccount() {
    const {
      body: { amount },
    } = this.req;
    console.log(this.userId);
    const isReqValid = new CreationRules(amount).savingsAccount();
    if (!isReqValid)
      return this.res.status(400).json({ msg: "Deposit is not enough" });

    const userModel = new UsersModel();
    const { data, error } = await TryCatchHelper(() =>
      userModel.getUserById(this.userId)
    );
    if (error)
      return this.res.status(500).json({ err: "Error while fetching user" });
    const { userName } = data;

    const savingsModel = new SavingsAccount(amount, userName, this.userId);
    const { data: postSavingsRes, error: errPostingSavings } =
      await TryCatchHelper(() => savingsModel.createAccount());
    if(errPostingSavings) return this.res.status(500).json({err: "Error while creating savings account"});

    const accountInfo = filterAccountCred(postSavingsRes, this.role);
    new ResponseHandlers(accountInfo, this.res).postResponse();
  }
  async getAccountsInfo() {
    const savingsModel = new SavingsAccount();
    const { data, error } = await TryCatchHelper(() =>
      savingsModel.getAccounts()
    );
    if (error)
      return this.res
        .status(500)
        .json({ err: "Error while fetching accounts" });
    const accountsInfo = filterAccountCred(data, this.role);

    new ResponseHandlers(accountsInfo, this.res).getResponse();
  }

  async getAccountInfo() {
    const { accountId } = this.req.params;
    const savingsModel = new SavingsAccount();
    const { data, error } = await TryCatchHelper(() =>
      savingsModel.getAccountInfoById(accountId)
    );
    if (error)
      return this.res
        .status(500)
        .json({ err: "Error while getting account info" });

    if (!data)
      return this.res.status(400).json({ err: "Account does not exist" });

    new ResponseHandlers(data, this.res).getResponse();
  }

  // Methods used by the Rules Controller
  async getAccounts() {
    const savingsModel = new SavingsAccount();
    const { data, error } = await TryCatchHelper(() =>
      savingsModel.getAccounts()
    );
    if (error) return false;
    return data;
  }
}

module.exports = SavingsAccountController;
