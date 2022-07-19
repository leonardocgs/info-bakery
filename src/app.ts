import express from 'express';
import cors from 'cors';
import bakerController from './api/controllers/bakerController';

export const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).send();
  }
  app.use(cors());
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/baker', bakerController);
