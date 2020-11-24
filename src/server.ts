/* eslint-disable no-console */

import http from 'http';
import express from 'express';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';

import webpack_config from '../webpack.config.js';

// set up the express server
const app = express();
app.use(express.static('.'));

// wire up webpack hot module replacement
const compiler = webpack(webpack_config as webpack.Configuration);
app.use(WebpackDevMiddleware(compiler));

// create the server
const server = http.createServer(app);

// listen to incoming requests
server.listen(8080, () => {
  console.log('listening on http://localhost:8080/');
});