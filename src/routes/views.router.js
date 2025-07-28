import { Router } from 'express';
import path from 'path';
import { __dirname } from '../utils/utils.js';
import fs from 'fs/promises';

const router = Router();
const productsPath = path.join(__dirname, 'data', 'products.json');

router.get('/home', async (req, res) => {
  const data = await fs.readFile(productsPath, 'utf-8');
  const products = JSON.parse(data || '[]');
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;