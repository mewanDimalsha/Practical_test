const { get } = require('mongoose');
const product = require('../models/productModel');
const User = require('../models/userModel');

// Example controller function to get all products
const getAllProducts = async (req, res) => {
    try {
        // Ensure the request has a decoded user set by auth middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: no user information found' });
        }

        // Verify the user exists in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If you want to return only products owned by the user, add an owner field to product model
        // For now, return all products
        const products = await product.find();
        return res.status(200).json({ message: 'Products retrieved', products });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProductById = async (req, res) => {
    // Implementation for getting a product by ID
    try {
        const { id } = req.params;

        // Find the product by ID
        const productById = await product.findById(id);
        if (!productById) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product retrieved', product: productById });

    } catch (error) {
        console.error('Error during getting product by ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const createProduct = async (req, res) => {
    // Implementation for creating a product
    try {
        const { name, price, description, stock_quantity } = req.body;

        // Validate required fields
        if (!name || price == null || stock_quantity == null) {
            return res.status(400).json({ message: 'Name, price, and stock quantity are required' });
        }

        // Create a new product
        const newProduct = new product({
            name,
            price,
            description,
            stock_quantity
        });

        await newProduct.save();

        res.status(201).json({ message: `Product ${name} created successfully`, product: newProduct });

    } catch (error) {
        console.error('Error during product creation:', error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Product with this name already exists' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const updateProduct = async (req, res) => {
    // Implementation for updating a product
    try {
        const { id } = req.params;
        const { name, price, description, stock_quantity } = req.body;

        // Find the product by ID
        const existingProduct = await product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product fields
        if (name) existingProduct.name = name;
        if (price != null) existingProduct.price = price;
        if (description) existingProduct.description = description;
        if (stock_quantity != null) existingProduct.stock_quantity = stock_quantity;

        await existingProduct.save();

        res.status(200).json({ message: `Product ${id} updated successfully`, product: existingProduct });

    } catch (error) {
        console.error('Error during product update:', error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Product with this name already exists' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    // Implementation for deleting a product
    try {
        const { id } = req.params;

        // Find and delete the product by ID
        const deletedProduct = await product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: `Product ${id} deleted successfully` });

    } catch (error) {
        console.error('Error during product deletion:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};  