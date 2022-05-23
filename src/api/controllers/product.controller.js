const express= require('express');
const Product= require('../models/Product')





// Create a new product
exports.create= (req,res)=>{
    console.log('it works')
   const product = new Product(req.body);

// Save product in the database
product.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Error occurred."
        });
    });

};






// Retrieve all products
exports.findAll= (req, res) => {
    Product.find().sort({ price: 1 }) //sorting with increasing price by default
    .then((result) => {
        res.send({products:result});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving products."
        });
    });
};



// Retrieve a single product with Id
exports.findOne= (req, res) => {
    Product.findById(req.params.Id)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "product not found with id " + req.params.Id
            });            
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "product not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving product with id " + req.params.Id
        });
    });
};



exports.filterProduct=(req, res)=> {
    const query = {  $and: [{ name: 'Rhomal' }, { category: 'toy' }]};
    Product.find(query).sort({ price: 1 })
    .then((result) => {
        res.send({products:result});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving products."
        });
    });
}
  
    


// Update a product with productId
exports.update= (req, res) => {
    // Validate Request
    if(!req.body.price) {
        return res.status(400).send({
            message: " product price can not be empty"
        });
    }
    
    // Find product price and update it with the request body
    Product.findByIdAndUpdate(req.params.Id, {
        message: req.body.price
    }, {new: true})
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "product not found with id " + req.params.Id
            });
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "product not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Error updating product with id " + req.params.Id
        });
    });
};







//Delete a product with Id
exports.delete= (req, res) => {
    Product.findByIdAndRemove(req.params.Id)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "product not found with id " + req.params.Id
            });
        }
        res.send({message: "product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "product not found with id " + req.params.Id
            });                
        }
        return res.status(500).send({
            message: "Could not delete product with id " + req.params.Id
        });
    });
};

