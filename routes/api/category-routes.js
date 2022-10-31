const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// FIND ALL CATEGORIES
// be sure to include its associated Products
router.get('/', async (req, res) => {
  try {
    const categorydata = await Category.findAll(); // Find all categories
      // include: [{model: Product, through: ProductTag, as 'product_tags'}]
    res.status(200).json(categorydata);
  } catch (err) {
    res.status(500).json(err);
  }
});

// FIND ONE GATEGORY BY ID#
  // find one category by its `id` value
  // be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categorydata = await Category.findByPk(req.params.id, {
      include: [{model: Product, through: ProductTag, as: 'product_tags'}] 
    });
    if(!categorydata) {
      res.status(404).json({message: 'No category found with this ID'});
    }
    res.status(200).json(categorydata);

  } catch (err) {
    res.status(500).json(err)
  }
});

// CREATE A NEW CATEGORY
router.post('/', async (req, res) => {
  try {
    const categorydata = await Category.create(req.body);
    res.status(200).json(categorydata);
  } catch(err) {
    res.status(400).json(err);
  }
});

// UPDATE CATEGORY BY ID
router.put('/:id', async (req, res) => {
  try {
    const categorydata = await Category.update({
      where: {
        id: req.paramns.id
      }
    });
    if(!categorydata) {
      res.status(404).json({message: 'Update failed'});
      return;
    }
    res.status(200).json(categorydata);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE CATEGORY BY ID
router.delete('/:id', async (req, res) => {
  try {
    const categorydata = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if(!categorydata) {
      res.status(404).json({message: 'Update failed'});
      return;
    }
    res.status(200).json(categorydata);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
