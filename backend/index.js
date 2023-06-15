const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('1035980481337-oesabu7d8c5tbidalch23jnculhkmisd.apps.googleusercontent.com');

app.use(cors());
app.use(bodyParser.json());

app.post('/api/google-login', async (req, res) => {
    const ticket = await client.verifyIdToken({
                idToken: req.body.token
    });
    res.status(200).json(ticket.getPayload());
})

app.listen(4001, () => {
    console.log(`Server is ready at http://localhost:4001`);
})