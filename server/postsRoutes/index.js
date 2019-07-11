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

postRoutes.get('/', async (req, res) => {
  try {
    const posts = await Posts.find();
    return res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The posts information could not be retrieved.' });
  }
});

postRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);
    if (!post[0]) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The post information could not be retrieved.' });
  }
});

postRoutes.get('/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const postComments = await Posts.findPostComments(id);
    if (!postComments[0]) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    res.status(200).json(postComments);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The comments information could not be retrieved.' });
  }
});

postRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);
    if (!post[0]) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
    await Posts.remove(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'The post could not be removed' });
  }
});

postRoutes.put('/:id', async (req, res) => {
  const { title, contents } = req.body;
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }

    const newPost = { title: title.trim(), contents: contents.trim() };
    if (newPost.title && newPost.contents) {
      await Posts.update(id, newPost);
      const updated = await Posts.findById(id);
      return res.status(200).json(updated);
    }
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'The post information could not be modified.' });
  }
});

module.exports = postRoutes;
