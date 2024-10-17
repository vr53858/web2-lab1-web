import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import ticketRoutes from './routes/ticketRoutes';
import axios from 'axios';
import path from 'path';

dotenv.config();

const app : Application = express();

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${API_URL}/tickets-count`);
        const totalTickets = response.data.count;

        res.render('home', { totalTickets });
    } catch (error) {
        res.status(500).send(`Error fetching ticket count: ${(error as Error).message}`);
    }
});

app.use('/ticket', ticketRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;