import { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Ticket } from '../types/Ticket';
import { getAccessToken } from '../services/getAuth0AccessToken';

dotenv.config();
const router = Router();

router.get('/:id', async (req: any, res: Response) => {
    const ticketId = req.params.id;
    const userInfo = req.oidc.user;

    try {
        const accessToken = await getAccessToken();

        // Fetch ticket info from the external API with the access token
        const apiResponse = await axios.get(`${process.env.API_URL}/${ticketId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (apiResponse.status === 200) {
            const ticketInfo : Ticket = apiResponse.data;

            console.log(ticketInfo);
            
            res.render('ticket', { ticket: ticketInfo, user: userInfo});
        } else {
            res.status(404).send(`Ticket with ID ${ticketId} not found`);
        }
    } catch (error) {
        res.status(500).send(`Error fetching ticket: ${(error as Error).message}`);
    }
});

export default router;