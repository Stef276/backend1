import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('src/data/products.json');

router.get('/', (req, res) => {
  res.json(productManager.getProducts());
});

router.get('/:pid', (req, res) => {
  const product = productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', (req, res) => {
  const producto = req.body;
  const newProduct = productManager.addProduct(producto);
  res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
  const updated = productManager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
});

router.delete('/:pid', (req, res) => {
  const deleted = productManager.deleteProduct(req.params.pid);
  deleted ? res.json({ mensaje: 'Producto eliminado' }) : res.status(404).json({ error: 'No encontrado' });
});

export default router;
