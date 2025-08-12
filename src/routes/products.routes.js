import express from 'express';
import * as ctrl from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', ctrl.getProducts);
router.get('/:pid', ctrl.getProductById);
router.post('/', ctrl.createProduct);
router.put('/:pid', ctrl.updateProduct);
router.delete('/:pid', ctrl.deleteProduct);

export default router;
