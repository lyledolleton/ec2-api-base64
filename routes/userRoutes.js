const express = require("express");
const userController = require("../controllers/userController");
const auth = require('../auth');
const {verify, verifyAdmin} = auth;




const router = express.Router();

	router.post("/register", (req, res) => {
		userController.registerUser(req.body).then(resultFromController => {
			res.send(resultFromController)
		})
	})

	router.post("/login", userController.loginUser);

	router.post('/checkout', verify, userController.CheckOut);

	router.get("/details", verify, userController.getProfile);

	router.post("/add-to-cart", verify, userController.addToCart);

	router.get('/get-cart/:userId', userController.getCart);

	router.delete('/removeproduct/:userId',verify, userController.removeFromCart);

	router.delete('/removeallproduct/:userId',verify,userController.removeAllFromCart);

	router.put('/reset-password', verify, userController.resetPassword);

	router.get("/allusers", userController.getAllUsers);

	router.put("/:userId/activate", verify, verifyAdmin, userController.updateAdmin);

	router.put("/:userId/disable", verify, verifyAdmin, userController.updateNotAdmin);

	router.put("/:userId/reset", verify, verifyAdmin, userController.resetAdminPassword);

	router.get("/:userId", userController.getSingleUser);

module.exports = router;