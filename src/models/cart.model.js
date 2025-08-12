import mongoose from 'mongoose';
const cartProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  products: [cartProductSchema]
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);
