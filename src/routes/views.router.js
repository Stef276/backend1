import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { __dirname } from '../utils/utils.js';
import fs from 'fs/promises';

const router = express.Router();

router.get('/products', async (req, res) => {
  // forward query params to API
  const query = [];
  if (req.query.limit) query.push(`limit=${req.query.limit}`);
  if (req.query.page) query.push(`page=${req.query.page}`);
  if (req.query.sort) query.push(`sort=${req.query.sort}`);
  if (req.query.query) query.push(`query=${encodeURIComponent(req.query.query)}`);
  const qstr = query.length ? '?' + query.join('&') : '';
  const host = req.get('host');
  const protocol = req.protocol;
  // call internal API
  const apiRes = await fetch(`${protocol}://${host}/api/products${qstr}`);
  const data = await apiRes.json();
  res.render('home', { data });
});

router.get('/products/:pid', async (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const apiRes = await fetch(`${protocol}://${host}/api/products/${req.params.pid}`);
  const product = await apiRes.json();
  res.render('productDetail', { product });
});

router.get('/carts/:cid', async (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const apiRes = await fetch(`${protocol}://${host}/api/carts/${req.params.cid}`);
  const cart = await apiRes.json();
  res.render('cartView', { cart });
});

export default router;
