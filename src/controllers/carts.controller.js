import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

export async function createCart(req, res) {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error creando carrito' });
  }
}

export async function getCartById(req, res) {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function deleteProductFromCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando producto' });
  }
}

export async function replaceCartProducts(req, res) {
  try {
    const { cid } = req.params;
    const products = req.body; // expect array of { product: id, quantity }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    cart.products = products.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando carrito' });
  }
}

export async function updateProductQuantity(req, res) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'Falta quantity en body' });
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    const prod = cart.products.find(p => p.product.toString() === pid);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado en carrito' });
    prod.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando cantidad' });
  }
}

export async function clearCart(req, res) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    cart.products = [];
    await cart.save();
    res.json({ mensaje: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ error: 'Error vaciando carrito' });
  }
}

export async function addProductToCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) existing.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error agregando producto' });
  }
}
