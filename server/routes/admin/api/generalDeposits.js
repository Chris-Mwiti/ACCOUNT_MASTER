const router = require('express').Router();
const DepositController = require('../../../controllers/GeneralAccount/DepostController');
const checkCookies = require('../../../middlewares/checkCookies')
const verifyJwt = require('../../../middlewares/verifyJwt');
const {verifyAdminRole} = require('../../../middlewares/verifyRoles');

router.use(checkCookies)
router.use(verifyJwt)
router.use(verifyAdminRole)
const ACC_TYPE = "general"
router.route('/')
    .get(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.getDeposits();
    })

// PARAMS ROUTES
router.route('/:depositId')
    .put(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.updateDeposit();
    })
    .delete(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.deleteDeposit();
    })
    .get(async(req,res) => {
        const depositController = new DepositController(req,res,ACC_TYPE);
        await depositController.getDeposit();
    })

    



module.exports = router