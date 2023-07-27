const router = require('express').Router()
const DepositController = require('../../../controllers/GeneralAccount/DepostController');
const SavingsAccountController = require('../../../controllers/SavingsAccount/SavingsController');
const WithdrawalsController = require('../../../controllers/WithdrawalsController');
const checkCookies = require('../../../middlewares/checkCookies')
const verifyJwt = require('../../../middlewares/verifyJwt');
const {verifyUserRole}= require('../../../middlewares/verifyRoles')
const ACC_TYPE = "savings";
router.use(checkCookies);
router.use(verifyJwt);
router.use(verifyUserRole);

router.route('/')
    .post(async(req,res) => {
        const savingsController = new SavingsAccountController(req,res);
        await savingsController.createAccount();
    })

router.route('/deposits')
    .post(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.makeDeposit();
    })

router.route('/withdraws')
  .post(async(req,res) => {
    const withdrawController = new WithdrawalsController(req,res,ACC_TYPE);
    await withdrawController.makeWithdrawal();
  })
module.exports = router