import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

import { connectDB } from './db.js';
import { router } from './index.js';

config({
  path: `.env`,
});

const app = express();
const PORT = process.env.PORT || 7887;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api', router);


const bootstrap = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is runningon port ${PORT}`);
  });
};

bootstrap();
