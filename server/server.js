import { stripeApi } from './api/stripeApi.js';
import { api } from './api/api.js';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import { port } from './api/variables.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonParser = bodyParser.json();
const app = express();

//launch server
app.listen(port, () => {
  console.log(`Winter Instruments launched on ${port}`);
});
//serve static assets 
app.use(express.static(resolve(__dirname, '../client/build')));

//get products
app.get("/get-products", (req, res) => {
  stripeApi.getProducts(res);
});

//get shipping rate
app.post('/get-shipping-rate', jsonParser, (req, res) => {
  api.getShippingAndCheckoutURL(res, req.body);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, '../client/build', 'index.html'));
});