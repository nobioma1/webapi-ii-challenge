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
      return res.status(201).json({ ...post[0] });
    }
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  } catch (error) {
    res.status(500).json({
      error: 'There was an error while saving the post to the database',
    });
  }
});

postRoutes.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const post = await Posts.findById(id);
    if (!post[0]) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }

    if (!text.trim()) {
      return res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
    }

    const commentId = await Posts.insertComment({ text, post_id: id });
    if (commentId) {
      return res.status(201).json({ ...commentId, text });
    }
  } catch (error) {
    res.status(500).json({
      error: 'There was an error while saving the comment to the database',
    });
  }
});

// postRoutes.get()

// postRoutes.get()

// postRoutes.get()

// postRoutes.get()

// postRoutes.put()

module.exports = postRoutes;
