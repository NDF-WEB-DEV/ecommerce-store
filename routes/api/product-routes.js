const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint
// GET REQUEST - ALL PRODUCTS
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{model: Category},{model: Tag}],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET 1 PRODUCT BY ID
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      // include: [{model: ProductTag}],
      include: [{model: Category},{model: Tag, through: ProductTag}],
    });
    if(!productData) {
      res.status(404).json({message: 'Product not found with this ID'});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST ROUTE - CREATE PRODUCT OBJECT
router.post('/', async (req, res) => {
  await Product.create({ 
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds
  }).then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);  //method to allow creating multiple records at once, with only one query
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE PRODUCT
// update product data
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // getpda list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE BY ID
// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if(!productData) {
      res.status(404).json({Message: 'product not found with this ID'});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
