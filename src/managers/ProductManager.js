import fs from 'fs';

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.readData();
  }

  readData() {
    return fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path)) : [];
  }

  writeData() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(p => p.id == id);
  }

  addProduct(product) {
    const newProduct = {
      ...product,
      id: this.products.length ? (parseInt(this.products.at(-1).id) + 1).toString() : '1'
    };
    this.products.push(newProduct);
    this.writeData();
    return newProduct;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id == id);
    if (index === -1) return null;
    const product = this.products[index];
    this.products[index] = { ...product, ...updatedFields, id: product.id };
    this.writeData();
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id == id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    this.writeData();
    return true;
  }
}
