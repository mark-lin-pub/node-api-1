import express from 'express';
import * as fs from 'fs';

const app = express();
const port = process.env.PORT || undefined;
const env = process.env.NODE_ENV || 'none';
const sample = process.env.SAMPLE || 'none';
const secret = process.env.DB_PASSWORD || 'none';



app.get('/', (req, res) => {
  res.send(`Hello ${env} - ${sample}!`);
});

app.listen(port, () => {
  const words = fs.readFileSync(secret, 'utf-8');
  return console.log(`Express is listening at http://localhost:${port} env: ${env} sample: ${sample} secret: ${words}`);
});




