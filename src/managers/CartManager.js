import fs from 'fs';

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = this.readData();
  }

  readData() {
    return fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path)) : [];
  }

  writeData() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }

  createCart() {
    const newCart = {
      id: this.carts.length ? (parseInt(this.carts.at(-1).id) + 1).toString() : '1',
      products: []
    };
    this.carts.push(newCart);
    this.writeData();
    return newCart;
  }

  getCartById(id) {
    return this.carts.find(c => c.id == id);
  }

  addProductToCart(cid, pid) {
    const cart = this.getCartById(cid);
    if (!cart) return null;

    const prodIndex = cart.products.findIndex(p => p.product === pid);
    if (prodIndex !== -1) {
      cart.products[prodIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    this.writeData();
    return cart;
  }
}
