const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET REQUEST ALL
// same as: SELECT * FROM tag;
// The `/api/tags` endpoint
// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product, through: ProductTag}],
    });
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(err);
  }
});

// GET REQUEST BY ID
// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product}],
        // {model: Product, through: ProductTag}],
    });
    if(!tagData) {
      res.status(404).json({message: 'No tag data found with this ID'});
    }
    res.status(200).json(tagData);

  } catch (err) {
    res.status(500).json(err);
  }

});

//POST REQUEST - create a new tag
// Same as: INSERT INTO tag(id,tag_name) VALUES(?,?);
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//PUT REQUEST - update a tag's name by its `id` value
//same as: SELECT id, tag_name, FROM tag WHERE id=?
router.put('/:id', (req, res) => {
  Tag.update(                     
  {
    id: req.params.id,
    tag_name: req.body.tag_name,    
  },
  {
    where: {
      id: req.params.id,
    },
  }
).then((updatedTag) => {
  res.json(updatedTag);  // send the updated tag as a JSON response
}).catch((err) => res.json(err));
});

//DELETE REQUEST - delete on tag by its `id` value
// Same as: DELETE FROM tag Where id = ?;
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: 
    {
      id: req.params.id,
    },
  }).then((deletedTag) => {
    res.json(deletedTag);  // send the updated tag as a JSON response
  }).catch((err)=> res.json(err));
});

module.exports = router;
