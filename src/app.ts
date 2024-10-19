import express, { Application, NextFunction, Request, Response } from 'express';
const { requiresAuth } = require('express-openid-connect');

import dotenv from 'dotenv';
import ticketRoutes from './routes/ticketRoutes';
import axios from 'axios';
import path from 'path';
const { auth } = require('express-openid-connect');

dotenv.config();

const app : Application = express();

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
  };

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

app.use(auth(config));

app.use(express.json());

app.get('/', (req : any, res : Response, next : NextFunction) => {
    // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    if (req.oidc.isAuthenticated() || req.path === '/login') {
        next();
    } else {
        res.redirect('/login');
    }
  });

app.get('/', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${API_URL}/tickets-count`);
        const totalTickets = response.data.count;

        res.render('home', { totalTickets });
    } catch (error) {
        res.status(500).send(`Error fetching ticket count: ${(error as Error).message}`);
    }
});

app.get('/profile', requiresAuth(), (req : any, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

app.use('/ticket', ticketRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;