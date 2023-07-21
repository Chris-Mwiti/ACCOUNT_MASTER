const RegisterController = require('../../controllers/RegisterController');

const router = require('express').Router();

router.route('/')
    .post(async (req,res) => {
        const registerController = new RegisterController(req,res);
        await registerController.createUser();
    })

module.exports = router