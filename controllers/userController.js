const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require('bcrypt');
const auth = require("../auth");

/*------------------------------------------------------------------------------------------*/
module.exports.registerUser = (reqBody) => {
	
	let newUser = new User({
		email : reqBody.email,
		password : bcrypt.hashSync(reqBody.password, 10)
	})

	return newUser.save().then((user, error) => {
		
		if(error){
			return false
		
		}else{
			return true
		}
	}).catch(err => err)
}

/*--------------------------------------------------------------------------------------------*/


module.exports.loginUser = (req, res) => {
	return User.findOne({email : req.body.email}).then(result => {

		if(result == null){
			return false;
		}else{

			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password)
			
			if(isPasswordCorrect){
				
				return res.send({access : auth.createAccessToken(result)})
			
			}else {
				return res.send({message: "Incorret Username / Password"});
			}
		}
	}).catch(err => res.send(err))
}

/*-----------------------------------------------------------------------------------------------*/

module.exports.CheckOut = async (req, res) => {
	console.log(req.user.id)
	console.log(req.body.productId)
	
	if(req.user.isAdmin){
		return res.send("Action Forbidden")
	}

	const user = await User.findById(req.user.id);
	const product = await Product.findById(req.body.productId);

	if (!product) {
            return res.send({ message: "Product not found" });
        }
	
    const productPrice = product.price;
    const productName = product.name;
    const totalAmount = req.body.quantity * productPrice


	let isOrderUpdated = await User.findById(req.user.id).then(user => {


		let newOrder = {
			productId: req.body.productId,
			productName: productName,
			quantity: req.body.quantity,
			
		}

		user.orderedProducts.push({
	     products: [newOrder],
	     totalAmount:totalAmount
	    });

		return user.save().then(user => true).catch(err => err.message)
	})
	if(isOrderUpdated !== true){
		return res.send({message : isOrderUpdated})
	}

	let isProductUpdated = await Product.findById(req.body.productId).then(product => {
		let customer = {
			userId : req.user.id,
		}

		product.userOrders.push(customer)

		return product.save().then(product => true).catch(err => err.message)
	})

	if(isProductUpdated !== true){
		return res.send({message : isProductUpdated})
	}

	if(isOrderUpdated && isProductUpdated){
		return res.send({message: "Order Successfully"})
	}
}
//---------------------------------------------------------------------------------------//

module.exports.getProfile = (req, res) => {

  return User.findById(req.user.id).then(result => {
		return res.send(result)
	});
};


//---------------------------------------------------------------------------------------//

module.exports.resetPassword = async (req, res) => {
	try {

	  const { newPassword } = req.body;
	  const { id } = req.user; 
  
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
	  await User.findByIdAndUpdate(id, { password: hashedPassword });
  
	  res.status(200).send({ message: 'Password reset successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Internal server error' });
	}
};

//---------------------------------------------------------------------------------------//


module.exports.resetAdminPassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const newPassword = req.body.password;


    const hashedPassword = await bcrypt.hash(newPassword, 5);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

   res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send(false);
  }
}

//---------------------------------------------------------------------------------------//


module.exports.updateAdmin = (req, res) => {

        let updateActiveField = {
            isAdmin: true
        }

        return User.findByIdAndUpdate(req.params.userId, updateActiveField)
            .then((user, error) => {

            //course archived successfully
            if(error){
                return res.send(false)

            // failed
            } else {
                return res.send(true)
                }
        })
        .catch(err => res.send(err))

    };
    
  //---------------------------------------------------------------------------------------//



module.exports.updateNotAdmin = (req, res) => {

        let updateActiveField = {
            isAdmin: false
        }

        return User.findByIdAndUpdate(req.params.userId, updateActiveField)
        .then((user, error) => {

            if(error){
                return res.send(false)

            } else {
                return res.send(true)
            }
        })
        .catch(err => res.send(err))

    };


  //-------------------------------------------------------------------------------------------------//


   module.exports.addToCart = async (req, res) => {
    try {

      const { userId, productId, quantity } = req.body;

      const user = await User.findById(req.user.id);
			const product = await Product.findById(req.body.productId);

      if (!user || !product) {
        return res.send({ message: 'User or product not found' });
      }

      const subtotal = product.price * quantity;

      user.orderedProducts.push({
        products: [{
          productId: product._id,
          productName: product.name,
          quantity: quantity,
        }],
        totalAmount: subtotal,
      });

      await user.save();

      return res.send({ message: 'Product added to cart' });
    } catch (error) {
      console.error(error);
      return res.send({ message: 'Internal server error' });
    }
  };



  //----------------------------------------------------------------------------------------//
  module.exports.getCart = async (req, res) => {
  try {

    const { userId } = req.query;

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.send({ message: 'User not found' });
    }

    return res.send({Orders: user.orderedProducts });
  } catch (error) {
    console.error(error);
    return res.send({ message: 'Internal server error' });
  }
};

//----------------------------------------------------------------------------------------//

module.exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.send({ message: 'User not found' });
    }

    const productIndex = user.orderedProducts.findIndex((op) =>
      op.products.some((p) => p.productId.toString() === productId)
    );

    if (productIndex === -1) {
      return res.send({ message: 'Product not found in cart' });
    }

    user.orderedProducts[productIndex].products = user.orderedProducts[productIndex].products.filter(
      (p) => p.productId.toString() !== productId
    );

    if (user.orderedProducts[productIndex].products.length === 0) {
      user.orderedProducts.splice(productIndex, 1);
    }

    await user.save();

    return res.send({ message: 'Product removed from cart' });
  } catch (error) {
    console.error(error);
    return res.send({ message: 'Internal server error' });
  }
};

//----------------------------------------------------------------------------------------//
module.exports.removeAllFromCart = async (req, res) => {

  const userId = req.params.userId;
  try {
   
    const user = await User.findById(userId);

    if (!user) {
      return res.send({ message: 'User not found' });
    }
    
    user.orderedProducts = [];

    await user.save();

    return res.send({ message: 'All products removed from the cart' });
  } catch (error) {
    console.error('Error removing products from the cart', error);
    return res.send({ message: 'Internal server error' });
  }
}

//----------------------------------------------------------------------------------------//

module.exports.getAllUsers = (req,res) => {
  return User.find({}).then(result => {
    return res.send(result)
  });
};

//----------------------------------------------------------------------------------------//


module.exports.getSingleUser = (req, res) => {
    return User.findById(req.params.userId).then(result => {
        return res.send(result);
    })
    .catch(err => res.send(err))
};
//----------------------------------------------------------------------------------------//
