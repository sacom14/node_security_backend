import 'dotenv/config';
import express from 'express';
import playerRouter from './routes/playerRouter.js';
import { sequelize } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

sequelize.sync().then(() => {
    app.use('/players', playerRouter);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
