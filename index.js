
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")

const port = 4019;


const app =express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true}));
app.use(cors());
app.use("/b19/users", userRoutes)
app.use("/b19/products", productRoutes)



// [Section] Database Connection
mongoose.connect("mongodb+srv://lyledolleton:admin123@course-booking.zprcqvi.mongodb.net/E-commerce_API?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.once('open', () => console.log('Now Connected to MongoDB Atlas'));

if(require.main === module){
	app.listen(process.env.PORT || port, () =>{
		console.log(`API is now online on port ${process.env.PORT || port}`)
	})
}

module.exports = app;