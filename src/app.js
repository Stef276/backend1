import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { __dirname } from './utils/utils.js';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', viewsRouter);

// Productos por JSON
const productsPath = path.join(__dirname, 'data', 'products.json');
const getProducts = async () => {
  try {
    const data = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveProducts = async (products) => {
  await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
};

io.on('connection', async (socket) => {
  const products = await getProducts();
  socket.emit('productList', products);

  socket.on('addProduct', async (product) => {
    const products = await getProducts();
    products.push(product);
    await saveProducts(products);
    io.emit('productList', products);
  });

  socket.on('deleteProduct', async (id) => {
    let products = await getProducts();
    products = products.filter((p) => p.id !== id);
    await saveProducts(products);
    io.emit('productList', products);
  });
});

httpServer.listen(8080, () => console.log("Servidor corriendo en puerto 8080"));