import 'dotenv/config';
import express from 'express';
import { sequelize } from './config/db.js';
import playerRouter from './routes/playerRouter.js';
import authRouter from './routes/authRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const connectWithRetry = async () => {
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            await sequelize.authenticate();
            console.log('Database connection established successfully.');
            break;
        } catch (error) {
            retries++;
            console.log(`Database connection attempt ${retries} failed. Retrying in 5 seconds...`);
            if (retries === maxRetries) {
                console.error('Could not connect to database after multiple attempts.');
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};


const startApp = async () => {
    try {
        await connectWithRetry();
        await sequelize.sync();

        app.use('/players', playerRouter);
        app.use('/auth', authRouter);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
};

startApp();