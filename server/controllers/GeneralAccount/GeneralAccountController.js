const TryCatchHelper = require("../../helpers/TryCatch");
const filterAccountCred = require("../../helpers/filterAccountCred");
const ResponseHandlers = require("../../helpers/modelResponseHandlers");
const GeneralAccount = require("../../models/GeneralAccount");
const UsersModel = require("../../models/Users");
const CreationRules = require("../../rules/CreationRules");

class GeneralAccountController {
  constructor(req, res) {
    (this.req = req),
      (this.res = res),
      (this.userId = req.userId),
      (this.role = req.role);
  }

  async createAccount() {
    const {
      body: { amount },
    } = this.req;
    console.log(this.userId);
    const isReqValid = new CreationRules(amount).generalAccount();
    if (!isReqValid)
      return this.res.status(400).json({ msg: "Deposit is not enough" });

    const userModel = new UsersModel();
    const {data, error} = await TryCatchHelper(() =>
      userModel.getUserById(this.userId)
    );
    if (error)
      return this.res.status(500).json({ err: "Error while fetching user" });
    const { userName } = data;

    const generalModel = new GeneralAccount(amount, userName, this.userId);
    const creationInfo = await generalModel
      .createAccount()
      .catch((err) =>
        this.res.status(500).json({ err: "Error while creating account" })
      );

    const accountInfo = filterAccountCred(creationInfo, this.role);
    new ResponseHandlers(accountInfo, this.res).postResponse();
  }

  async getAccountsInfo() {
    const generalModel = new GeneralAccount();
    const {data, error} = await TryCatchHelper(() =>
      generalModel.getAccounts()
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
    const generalModel = new GeneralAccount();
    const {data, error} = await TryCatchHelper(() =>
      generalModel.getAccountInfoById(accountId)
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
    const generalModel = new GeneralAccount();
    const {data, error} = await TryCatchHelper(() =>
      generalModel.getAccounts()
    );
    if (error) return false;
    return data;
  }
}

module.exports = GeneralAccountController;
