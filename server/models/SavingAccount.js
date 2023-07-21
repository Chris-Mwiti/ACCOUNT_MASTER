const prisma = require("../configs/prismaConfigs");
const prismaErrHandler = require("../errors/handlers/prismaErrHandler");
const accountNumberGen = require("../generators/accountNumber");
const recordIdGenerator = require("../generators/recordIdGen");
const TryCatchHelper = require("../helpers/TryCatch");

class SavingsAccount {
  constructor(deposit, username, userId, status) {
    (this.deposit = deposit),
      (this.username = username),
      (this.userId = userId),
      (this.status = status);
  }

  async createAccount() {
    const [data, error] = await TryCatchHelper(() =>
      prisma.savingsAccount.create({
        data: {
          id: recordIdGenerator("SAV"),
          balance: this.deposit,
          accountNumber: accountNumberGen(),
          userId: this.userId,
          userName: this.username,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async getAccountInfoById(accountId) {
    const [data, error] = await TryCatchHelper(() =>
      prisma.savingsAccount.findUnique({
        where: {
          id: accountId,
        },
        include: {
          deposits: true,
          withdraws: true,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async getAccounts() {
    const [data, error] = await TryCatchHelper(() =>
      prisma.generalAccount.findMany()
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async updateAccountById(accountId) {
    const [data, error] = await TryCatchHelper(() =>
      prisma.savingsAccount.update({
        where: {
          id: accountId,
        },
        data: {
          balance: this.deposit,
          status: this.status,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async deleteAccountById(accountId) {
    const [data, error] = await TryCatchHelper(() =>
      prisma.savingsAccount.delete({
        where: {
          id: accountId,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }
}

module.exports =SavingsAccount