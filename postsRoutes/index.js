const express = require('express');

const Posts = require('../data/db');

const postRoutes = express.Router();

postRoutes.post('/', async (req, res) => {
  const { title, contents } = req.body;
  
  try {
    const newPost = { title: title.trim(), contents: contents.trim() };

    if (newPost.title && newPost.contents) {
      const postId = await Posts.insert(newPost);
      const post = await Posts.findById(postId.id);
      res.status(201).json({ ...post[0] });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'There was an error while saving the post to the database',
    });
  }
});

// postRoutes.post()

// postRoutes.get()

// postRoutes.get()

// postRoutes.get()

// postRoutes.get()

// postRoutes.put()

module.exports = postRoutes;
