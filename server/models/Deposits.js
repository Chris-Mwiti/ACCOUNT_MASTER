const prisma = require("../configs/prismaConfigs");
const prismaErrHandler = require("../errors/handlers/prismaErrHandler");
const recordIdGenerator = require("../generators/recordIdGen");
const TryCatchHelper = require("../helpers/TryCatch");

class DepositsModel{
  constructor(accType, depAmount) {
    (this.depModel =
      accType == "general" ? prisma.generalDeposits : prisma.savingsDeposits),
      (this.depAmount = depAmount);
  }

  async makeDeposit(accountId){
    const {data, error} = await TryCatchHelper(() =>
      this.depModel.create({
        data: {
          id: recordIdGenerator("DEP"),
          amount: this.depAmount,
          account:{
            connect:{
              id: accountId
            }
          }
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async getDeposits() {
    const {data, error} = await TryCatchHelper(() => this.depModel.findMany());
    if (error) prismaErrHandler(error);
    return data;
  }

  async getDepositById(depositId) {
    const {data, error} = await TryCatchHelper(() =>
      this.depModel.findUnique({
        where: {
          id: depositId,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async updataDepositStatus(depositId, status) {
    const {data, error} = await TryCatchHelper(() =>
      this.depModel.update({
        where: {
          id: depositId,
        },
        data: {
          status: status,
        },
      })
    );
    if (error) prismaErrHandler(error);
    return data;
  }

  async deleteDepositById(depositId) {
    const {data, error} = await TryCatchHelper(() =>
      this.depModel.delete({
        where: {
          id: depositId,
        },
      })
    );
    if(error) prismaErrHandler(error)
    return data
  }
}

module.exports = DepositsModel
