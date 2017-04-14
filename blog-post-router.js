const express = require('express'); 
const router = express.Router(); //look into router module
const bodyParser = require('body-parser'); //parse not store
const jsonParser = bodyParser.json(); //Parses the text as JSON and exposes the resulting object on req.body
const {BlogPosts} = require('./models'); //IMPORT the modeljs module


BlogPosts.create('Hello World', 'This is a blog', 'Jun Lei', '4/3/2017');
BlogPosts.create('Creating a Blog', 'This is how to create a blog', 'Jack B', '4/3/2017');

router.get('/', (req, res) => { 
  res.json(BlogPosts.get());
});


router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});


router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate','id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating Blog post list item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).json(updatedItem);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blogpost item \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;
