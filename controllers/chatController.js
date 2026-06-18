const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askPlantQuestion = async (req, res) => {
    try {

        const { plantName, question } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `You are a plant expert. 
                        Plant Name: ${plantName}
                        User Question: ${question}
                        Answer in a simple and beginner-friendly way.`;

        const result = await model.generateContent(prompt);

        const answer = result.response.text();

        res.json({ success: true, answer });

    } catch (error) {

        console.error(error);
    
        if (error.status === 503) {
            return res.status(503).json({
                success: false,
                message: "AI is busy right now. Please try again in a few seconds."
            });
        }
    
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    askPlantQuestion
};