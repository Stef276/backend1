# Backend API - Entrega N°1

Servidor backend con Node.js y Express que permite gestionar productos y carritos de compra, persistiendo datos en archivos JSON.

## Scripts
```bash
npm install
npm start
```

## Endpoints disponibles

### Productos (`/api/products`)
- `GET /` - Lista todos los productos.
- `GET /:pid` - Muestra producto por ID.
- `POST /` - Agrega un producto (sin ID en body).
- `PUT /:pid` - Actualiza un producto.
- `DELETE /:pid` - Elimina un producto.

### Carritos (`/api/carts`)
- `POST /` - Crea un carrito nuevo.
- `GET /:cid` - Muestra productos del carrito.
- `POST /:cid/product/:pid` - Agrega un producto al carrito.

## Datos persistentes

Se utilizan:
- `products.json`
- `carts.json`
