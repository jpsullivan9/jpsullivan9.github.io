const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
require('dotenv').config();

const sessionId = uuid.v4();
const projectId = process.env.GOOGLE_PROJECT_ID; // Google Cloud project ID
const languageCode = 'en';

const sessionClient = new dialogflow.SessionsClient({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
});

async function sendMessageToDialogflow(text) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: languageCode,
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    return result.fulfillmentText;
}

module.exports = async (req, res) => {
    const userMessage = req.body.message;
    try {
        const responseMessage = await sendMessageToDialogflow(userMessage);
        res.json({ message: responseMessage });
    } catch (error) {
        console.error('Dialogflow API error:', error);
        res.status(500).json({ message: 'Error communicating with Dialogflow' });
    }
};