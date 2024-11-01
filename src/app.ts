import express, { Application, NextFunction, Request, Response } from "express";
const { requiresAuth } = require("express-openid-connect");

import dotenv from "dotenv";
import ticketRoutes from "./routes/ticketRoutes";
import axios from "axios";
import path from "path";
import { getAccessToken } from "./services/getAuth0AccessToken";
import fs from "fs";
import https from "https";
const { auth } = require("express-openid-connect");

dotenv.config();

const app: Application = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port =
  externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: externalUrl || `https://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

app.use(auth(config));

app.use(express.json());

// app.get('/', (req : any, res : Response, next : NextFunction) => {
//     if (req.oidc.isAuthenticated() || req.path === '/login') {
//         next();
//     } else {
//         res.redirect('/login');
//     }
//   });

app.get("/", async (req: any, res: Response) => {
  try {
    const accessToken = await getAccessToken();

    // Fetch ticket info from the external API with the access token
    const response = await axios.get(`${process.env.API_URL}/tickets-count`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const totalTicketsCnt = response.data.count;
    const isAuthenticated = req.oidc.isAuthenticated();

    res.render("home", {
      totalTickets: totalTicketsCnt,
      isLoggedIn: isAuthenticated,
    });
  } catch (error) {
    res
      .status(500)
      .send(`Error fetching ticket count: ${(error as Error).message}`);
  }
});

app.get("/profile", requiresAuth(), (req: any, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.use("/ticket", requiresAuth(), ticketRoutes);

if (externalUrl) {
  const hostname = "0.0.0.0";
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
    outside on ${externalUrl}`);
  });
} else {
  https
    .createServer(
      {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
      },
      app
    )
    .listen(port, function () {
      console.log(`Server running at https://localhost:${port}/`);
    });
}

export default app;
