import express, { Request, Response } from 'express';
import routes from './routes';

const app = express();

app.use(express.json());

app.use('/',routes)

app.listen(5000, () => console.log(`Server listening on port 5000`));