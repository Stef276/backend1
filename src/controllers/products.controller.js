import { Product } from '../models/product.model.js';
import url from 'url';

export async function getProducts(req, res) {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      lean: true
    };
    if (sort === 'asc') options.sort = { price: 1 };
    else if (sort === 'desc') options.sort = { price: -1 };

    const mongoQuery = {};
    if (query) {
      // allow category or status queries: e.g. 'category:Electronics' or 'status:true'
      if (query.includes(':')) {
        const [key, val] = query.split(':');
        if (key === 'status') mongoQuery.status = val === 'true' || val === '1';
        else mongoQuery[key] = val;
      } else {
        // try match category or title
        mongoQuery.$or = [
          { category: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } }
        ];
      }
    }

    const result = await Product.paginate(mongoQuery, options);

    // Build prevLink and nextLink using original URL
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const parsed = new URL(fullUrl);

    const makeLink = (p) => {
      if (!p) return null;
      parsed.searchParams.set('page', p);
      return parsed.toString();
    };

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: makeLink(result.prevPage),
      nextLink: makeLink(result.nextPage)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function createProduct(req, res) {
  try {
    const { title, price } = req.body;
    if (!title || price === undefined) return res.status(400).json({ error: 'Faltan datos obligatorios' });
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
}

export async function updateProduct(req, res) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid).lean();
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
}
