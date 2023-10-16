const Product = require('../models/Product');





module.exports.addProduct = (req, res) => {

  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  });

  newProduct.save()
    .then((product) => {
      return res.status(201).json({ message: "Product creation successful", product });
    })
    .catch((error) => {
      return res.status(500).json({ message: "Product creation failed", error });
    });
};

/*-----------------------------------------------------------------*/


module.exports.getAllProducts = (req,res) => {
	return Product.find({}).then(result => {
		return res.send(result)
	});
};

/*-----------------------------------------------------------------*/

module.exports.getAllActive = (req, res) =>{
	return Product.find({isActive : true}).then(result => {
		return res.send(result)
	});
};

/*-----------------------------------------------------------------*/


module.exports.getSingleProduct = (req, res) => {
    return Product.findById(req.params.productId).then(result => {
        return res.send(result);
    })
    .catch(err => res.send(err))
};
/*-----------------------------------------------------------------*/

module.exports.updateProduct = (req, res) => {
	let updateProduct = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
        image: req.body.image,
	};

	return Product.findByIdAndUpdate(req.params.productId, updateProduct)
	.then((product) => {
    	return res.send({ message: "Product Update Successful"})
    })
    .catch((error) => {
      return res.send({ message: "Product Update Failed", error });
    });

}

/*-----------------------------------------------------------------*/


module.exports.archiveProduct = (req, res) => {

        let updateActiveField = {
            isActive: false
        }

        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then((product, error) => {

            if(error){
                return res.send(false)

            } else {
                return res.send(true)
            }
        })
        .catch(err => res.send(err))

    };
/*-----------------------------------------------------------------*/


module.exports.activateProduct = (req, res) => {

        let updateActiveField = {
            isActive: true
        }

        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
            .then((course, error) => {

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
/*-----------------------------------------------------------------*/


module.exports.searchProductByName = async (req, res) => {
    try {
      const { productName } = req.body;
  
      // Use a regular expression to perform a case-insensitive search
      const products = await Product.find({
        name: { $regex: productName, $options: 'i' }
      });
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

/*-----------------------------------------------------------------*/