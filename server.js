const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Kết nối MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/productdb';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Định nghĩa Schema và Model cho Product (pid, pname, price, quantity)
const productSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  pname: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

// --- RESTful API CRUD ---

// 1. CREATE: Thêm sản phẩm mới
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. READ: Lấy danh sách toàn bộ sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. READ: Lấy chi tiết một sản phẩm theo pid
app.get('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE: Cập nhật thông tin sản phẩm theo pid
app.put('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. DELETE: Xóa sản phẩm theo pid
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
