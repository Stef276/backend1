import express from 'express';
import * as ctrl from '../controllers/carts.controller.js';

const router = express.Router();

router.post('/', ctrl.createCart);
router.get('/:cid', ctrl.getCartById);
router.post('/:cid/products/:pid', ctrl.addProductToCart);
router.delete('/:cid/products/:pid', ctrl.deleteProductFromCart);
router.put('/:cid', ctrl.replaceCartProducts);
router.put('/:cid/products/:pid', ctrl.updateProductQuantity);
router.delete('/:cid', ctrl.clearCart);

export default router;
