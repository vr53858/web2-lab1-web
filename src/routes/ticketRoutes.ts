import { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Ticket } from '../types/Ticket';

dotenv.config();
const router = Router();
const API_URL = process.env.API_URL;

// Function to get an access token using Auth0 M2M Client Credentials
async function getAccessToken() {
    try {
        const response = await axios.post(process.env.AUTH0_TENANT_URL as string, {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.SECRET,
            audience: API_URL,
            grant_type: 'client_credentials'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.access_token;
    } catch (error) {
        throw new Error(`Error getting access token: ${(error as Error).message}`);
    }
}

// Define the route with a URL parameter `id`
router.get('/:id', async (req: Request, res: Response) => {
    const ticketId = req.params.id;

    try {
        const accessToken = await getAccessToken();

        // Fetch ticket info from the external API with the access token
        const apiResponse = await axios.get(`${API_URL}/${ticketId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

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