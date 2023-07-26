const router = require('express').Router();
const DepositController = require('../../../controllers/GeneralAccount/DepostController');
const checkCookies = require('../../../middlewares/checkCookies');
const verifyJwt = require('../../../middlewares/verifyJwt');
const {verifyAdminRole} = require('../../../middlewares/verifyRoles');


const ACC_TYPE = "savings"

router.use(checkCookies);
router.use(verifyJwt);
router.use(verifyAdminRole);

router.route('/')
    .get(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.getDeposits();
    })

router.route('/:depositId')
    .put(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.updateDeposit();
    })
    .get(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.getDeposit();
    })
    .delete(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.deleteDeposit();
    })

module.exports = router