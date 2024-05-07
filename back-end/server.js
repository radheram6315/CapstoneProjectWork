import express from "express";
import path from "path"
import bodyParser from "body-parser"

import newsRouter from './routes/news/news.js';
import usersRouter from './routes/users/users.js';
import queriesRouter from './routes/queries/queries.js'
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000; 

app.use(bodyParser.json());
app.use(express.json());

app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/queries', queriesRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
