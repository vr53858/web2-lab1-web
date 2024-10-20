import axios from "axios";

export async function getAccessToken(): Promise<string> {
    try {
        const response = await axios.post(process.env.AUTH0_TENANT_TOKEN_URL as string, {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.SECRET,
            audience: process.env.AUDIENCE,
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

