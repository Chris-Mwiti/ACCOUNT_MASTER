const prisma = require("../configs/prismaConfigs");
const prismaErrHandler = require("../errors/handlers/prismaErrHandler");
const recordIdGenerator = require("../generators/recordIdGen");
const TryCatchHelper = require("../helpers/TryCatch");

class WithdrawsModel {
  constructor(amount, accType) {
    (this.amount = amount),
      (this.accModel =
        accType == "general"
          ? prisma.generalWithdrawals
          : prisma.savingsWithdrawals);
  }

  async makeWithdrawal(accountId) {
    const { data: postWithdrwal, error: errWithdrawal } = await TryCatchHelper(
      () =>
        this.accModel.create({
          data: {
            id: recordIdGenerator("WIT"),
            amount: this.amount,
            account: {
              connect: {
                id: accountId,
              },
            },
          },
        })
    );

    if (errWithdrawal) prismaErrHandler(errWithdrawal);
    return postWithdrwal;
  }

  async getWithdrawals() {
    const { data: getWithdrawalsRes, error: errGetWithdrawals } =
      await TryCatchHelper(() => this.accModel.findMany());

    if (errGetWithdrawals) prismaErrHandler(errGetWithdrawals);
    return getWithdrawalsRes;
  }

  async getWithdralById(withdrawId) {
    const { data: getWithdrawalRes, error: errGetWithdrawal } =
      await TryCatchHelper(() =>
        this.accModel.findUnique({
          where: {
            id: withdrawId,
          },
          include:{
            account:{
                include:{
                    user: true
                }
            }
          }
        })
      );
    if (errGetWithdrawal) prismaErrHandler(errGetWithdrawal);
    return getWithdrawalRes;
  }


  async updateWithdrawStatus(withdrawId, status) {
    const { data: updtWithdrawRes, error: errUpdtWithdraw } =
      await TryCatchHelper(() =>
        this.accModel.update({
          where: {
            id: withdrawId,
          },
          data: {
            status: status,
          },
        })
      );
    if (errUpdtWithdraw) prismaErrHandler(errUpdtWithdraw);
    return updtWithdrawRes;
  }

  async deleteWithdrawById(withdrawId) {
    const { data: delWithdrawRes, error: errDelWithdraw } =
      await TryCatchHelper(() =>
        this.accModel.delete({
          where: {
            id: withdrawId,
          },
        })
      );

    if (errDelWithdraw) prismaErrHandler(errDelWithdraw);

    return delWithdrawRes;
  }

  // Used by the Rules Controller
  async countWithdrawalsByDate(date, accountId) {
    const { data: countRes, error: errCountRes } = await TryCatchHelper(() =>
      prisma.savingsWithdrawals.count({
        where: {
          accountId: accountId,
          modifiedAt: {
            lte: new Date(date),
          },
        },
      })
    );

    if (errCountRes) prismaErrHandler(errCountRes);
    console.log(countRes);
    return countRes;
  }
}

module.exports = WithdrawsModel;
