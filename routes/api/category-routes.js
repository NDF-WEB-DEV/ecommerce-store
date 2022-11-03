const router = require('express').Router();
const { Category, Product } = require('../../models');

// FIND ALL CATEGORIES
// The `/api/categories` endpoint
// include: [{model: Product, through: ProductTag, as: 'product_tags'}]
// be sure to include its associated Products
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// FIND ONE GATEGORY BY ID#
  // find one category by its `id` value
  // be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product}],
      // include: [{model: Product, through: ProductTag, as: 'product_tags'}] 
    });
    if(!categoryData) {
      res.status(404).json({message: 'No category found with this ID'});
      return;
    }
    res.status(200).json(categoryData);

  } catch (err) {
    res.status(500).json(err)
  }
});

// CREATE A NEW CATEGORY
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(400).json(err);
  }
});

// UPDATE CATEGORY BY ID
router.put('/:id', (req, res) => {
 Category.update(
      {
        category_name: req.body.category_name,
      }
     ,
     {
      where: {
        id: req.params.id,
      }
     } 
    ).then((updateCategory) => {
      res.json(updateCategory);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
  });

// DELETE CATEGORY BY ID
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {id: req.params.id}
    });
    if(!categoryData) {
      res.status(404).json({message: 'Update failed'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
