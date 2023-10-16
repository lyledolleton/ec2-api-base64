
const express = require("express");
const productController = require("../controllers/productController");
const auth = require("../auth")
const router = express.Router();
const {verify, verifyAdmin} = auth;


	router.post("/addproduct", verify, verifyAdmin, productController.addProduct);

	router.get("/allproducts", productController.getAllProducts);

	router.get("/activeproducts", productController.getAllActive);

	router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

	router.put("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

	router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

	router.post('/searchByName', productController.searchProductByName);

	router.get("/:productId", productController.getSingleProduct);	


module.exports = router;
