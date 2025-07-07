import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager('src/data/carts.json');

router.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
  const cart = cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
  const updatedCart = cartManager.addProductToCart(req.params.cid, req.params.pid);
  updatedCart ? res.json(updatedCart) : res.status(404).json({ error: 'Error al agregar producto' });
});

export default router;
