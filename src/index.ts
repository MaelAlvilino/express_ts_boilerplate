import express, { Express, Request, Response } from 'express';

const PORT = 8000;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('olá mundo');
});

app.listen(PORT, () => {
  console.log('listen to port 8k');
});
