const prisma = require("../configs/prismaConfigs");
const recordIdGenerator = require("../generators/recordIdGen");
const TryCatchHelper = require("../helpers/TryCatch");
const accountNumberGen = require("../generators/accountNumber");
const prismaErrHandler = require("../errors/handlers/prismaErrHandler");

class GeneralAccount {
  constructor(deposit, username, userId, status) {
    (this.deposit = deposit),
      (this.username = username),
      (this.userId = userId),
      (this.status = status);
  }

  async createAccount() {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.create({
        data: {
          id: recordIdGenerator("GEN"),
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
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.findUnique({
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

  async getAccountByUserId(userId) {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.findUnique({
        where: {
          userId: userId,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async getAccounts() {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.findMany()
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async updateAccountById(accountId) {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.update({
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

  async updateAccountBalance(accountId, balance) {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.update({
        where: {
          id: accountId,
        },
        data: {
          balance: balance,
        },
      })
    );
    if(error) prismaErrHandler(error);
    return data
  }

  async addSuspension(date, accountId) {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.update({
        where: {
          id: accountId,
        },
        data: {
          suspensionDuration: date,
          status: "suspended",
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async removeSuspension(accountId) {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.update({
        where: {
          id: accountId,
        },
        data: {
          suspensionDuration: null,
          status: "active",
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async deleteAccountById(accountId) {
    const { data, error } = await TryCatchHelper(() =>
      prisma.generalAccount.delete({
        where: {
          id: accountId,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }
}

module.exports = GeneralAccount;
