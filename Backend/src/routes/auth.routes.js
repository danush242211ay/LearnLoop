const {Router} = require("express");
const authController = require("../controllers/auth.controller");


const router = Router();

router.post("/register",authController.userRegister);
router.post("/login",authController.userLogin);
router.post("/logout",authController.userLogout);
router.post("/email",authController.verifyEmail);
router.post("/instructor",authController.instructorRegister);


module.exports = router;