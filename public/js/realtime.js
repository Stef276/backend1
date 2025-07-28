const socket = io();
const productList = document.getElementById('product-list');

socket.on('productList', (products) => {
  productList.innerHTML = '';
  products.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = `${p.id} - ${p.name} - $${p.price}`;
    productList.appendChild(li);
  });
});

document.getElementById('add-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const product = {
    id: document.getElementById('id').value,
    name: document.getElementById('name').value,
    price: parseFloat(document.getElementById('price').value)
  };
  socket.emit('addProduct', product);
  e.target.reset();
});

document.getElementById('delete-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('delete-id').value;
  socket.emit('deleteProduct', id);
  e.target.reset();
});