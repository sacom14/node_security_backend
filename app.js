import 'dotenv/config';
import express from 'express';
import { sequelize } from './config/db.js';
import playerRouter from './routes/playerRouter.js';
import authRouter from './routes/authRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

sequelize.sync().then(() => {
    app.use('/players', playerRouter);
    app.use('/auth', authRouter);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
