import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.router.js';
import { __dirname } from './utils/utils.js';
import fs from 'fs/promises';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/backend';
await mongoose.connect(MONGO_URI);
console.log('Mongo connected');


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// APIs
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// simple health check
app.get('/health', (req,res)=>res.send({status:'ok'}));

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  // keep original minimal socket handlers if needed
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
