
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env.local manually since we are running with node directly
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GOOGLE_GEMINI_API_KEY="([^"]+)"/);

if (!apiKeyMatch) {
    console.error("Could not find GOOGLE_GEMINI_API_KEY in .env.local");
    process.exit(1);
}

const apiKey = apiKeyMatch[1];
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Fetch the list of models directly from the API using fetch
        // The SDK doesn't make this easy in the current version without a model manager
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error listing models:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
