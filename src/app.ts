import express from 'express';
const app = express();
const port = process.env.PORT || undefined;
const env = process.env.NODE_ENV || 'none';

app.get('/', (req, res) => {
  res.send(`Hello ${env}!`);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port} env: ${env}`);
});