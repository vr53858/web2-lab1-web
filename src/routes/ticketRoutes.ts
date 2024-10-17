import { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Ticket } from '../types/Ticket';

dotenv.config();
const router = Router();
const API_URL = process.env.API_URL;

// Define the route with a URL parameter `id`
router.get('/:id', async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    try {
        // Fetch ticket info from the external API
        const apiResponse = await axios.get(`${API_URL}/${ticketId}`);

        if (apiResponse.status === 200) {
            const ticketInfo : Ticket = apiResponse.data;

            console.log(ticketInfo);
            
            res.render('ticket', { ticket: ticketInfo});
        } else {
            res.status(404).send(`Ticket with ID ${ticketId} not found`);
        }
    } catch (error) {
        res.status(500).send(`Error fetching ticket: ${(error as Error).message}`);
    }
});

export default router;