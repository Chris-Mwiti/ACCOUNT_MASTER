const router = require('express').Router();

const WithdrawalsController = require('../../../controllers/WithdrawalsController');
const checkCookies = require('../../../middlewares/checkCookies');
const verifyJwt = require('../../../middlewares/verifyJwt');
const {verifyAdminRole} = require('../../../middlewares/verifyRoles');
const ACC_TYPE = "general"
router.use(checkCookies);
router.use(verifyJwt);
router.use(verifyAdminRole);

router.route('/')
    .get(async(req,res) => {
        const withdrawController = new WithdrawalsController(req,res,ACC_TYPE);
        await withdrawController.getDeposits()
    })


router.route('/:withdrawId')
    .put(async(req,res) => {
        const withdrawController = new WithdrawalsController(req,res,ACC_TYPE);
        await withdrawController.updateDeposit();
    })
    .get(async(req,res) => {
        const withdrawController = new WithdrawalsController(req,res,ACC_TYPE);
        await withdrawController.getDeposit();
    })
    .delete(async(req,res) => {
        const withdrawController = new WithdrawalsController(req,res,ACC_TYPE);
        await withdrawController.deleteDeposit();
    })

module.exports = router