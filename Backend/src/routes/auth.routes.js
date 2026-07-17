const {Router} = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middleware/auth.middlware')

const router = Router();

router.post("/register",authController.userRegister);
router.post("/login",authController.userLogin);
router.post("/logout",authController.userLogout);
router.post("/email",authController.verifyEmail);
router.get("/me", authMiddleware.authUser, authController.getMe);


module.exports = router;