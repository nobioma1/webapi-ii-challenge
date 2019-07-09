const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const postsRoutes = require('./postsRoutes');

const server = express();
const PORT = process.env.PORT || 5000;

server.use(express.json());
server.use(cors());

server.use(routes.posts, postsRoutes);

server.get(routes.base, (req, res) => {
  res.status(200).send('Welcome to Posts');
});

server.listen(PORT, () => {
  console.log(`server live @ http://localhost:${PORT}`);
});
