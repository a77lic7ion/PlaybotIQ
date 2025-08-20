// This file is a Vercel serverless function.
import { GoogleGenAI } from "@google/genai";
import { GuideType, Platform, Reference } from "../../types";

const API_KEY = process.env.API_KEY;

const generatePrompt = (gameName: string, guideType: GuideType, platform: Platform): string => {
  let specificInstructions = '';
  switch (guideType) {
    case GuideType.Walkthrough:
      specificInstructions = `
- **Structure:** Break down the walkthrough into logical chapters or sections based on game progression (e.g., "Chapter 1: The Beginning", "Mission: The Heist").
- **Content:** Provide a detailed, step-by-step walkthrough of the main story quests.
- **Details:** For each step, describe the objective, key actions, and directions. Include tips for difficult bosses or puzzles, highlighting weaknesses and strategies.
- **Tables:** Use tables to list key items, collectibles, or important choices within a section.`;
      break;
    case GuideType.Levelling:
      specificInstructions = `
- **Structure:** Organize the guide by game phases (e.g., "Early Game (Levels 1-20)", "Mid Game (Levels 21-50)", "End Game (Levels 51+)").
- **Content:** For each phase, create a comprehensive levelling plan.
- **Tables:** Use tables extensively to detail the following for each phase:
    - **Recommended Characters/Classes:** Who to play and why.
    - **PowerUp/Skill Priorities:** What to level up first.
    - **Farming Spots:** Best locations for XP, gold, or materials.
    - **Gear/Weapon Progression:** Recommended equipment to acquire.
    - **Strategy Tips:** General advice for that phase of the game.`;
      break;
    case GuideType.Cheats:
      specificInstructions = `
- **Structure:** Group cheats by type (e.g., "God Mode", "Unlimited Ammo", "Unlockables").
- **Content:** List known cheat codes, console commands, exploits, or glitches.
- **Tables:** Use a table with columns for "Cheat/Effect", "How to Activate", and "Notes/Platform".
- **Alternatives:** If there are no official cheats, provide tips and strategies for making the game easier, presented as a "Pro-Tip" guide.`;
      break;
    case GuideType.Unlocks:
      specificInstructions = `
- **Structure:** Categorize unlocks by type (e.g., "Characters", "Weapons", "Stages", "Achievements").
- **Content:** Detail how to unlock secret content.
- **Tables:** Use tables with columns like "Unlockable", "Requirement/How to Unlock", and "Notes". This makes the information scannable and easy to follow.`;
      break;
  }
  
  return `You are PlaybotIQ, an expert gaming assistant. Your mission is to generate visually appealing and highly structured guides. Format all responses using markdown.
  
  **Formatting Rules:**
  - Use headings (#, ##, ###) to structure the guide logically.
  - Use tables to present structured data like lists of items, skills, or unlocks. This is crucial for readability.
  - Use bold text for emphasis on key terms.
  - Use lists (bulleted or numbered) for steps or tips.
  
  **Request:**
  Generate a high-quality, up-to-date ${guideType} for the game "${gameName}" on the ${platform} platform.
  
  **Guide-Specific Instructions:**
  ${specificInstructions}
  
  If the game is available on multiple platforms, focus on any details specific to the selected platform. Base your answer on the most recent information available from the web.
  
  Begin the guide now.`;
};


export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!API_KEY) {
        console.error("API_KEY environment variable is not set on the server.");
        return response.status(500).json({ error: "Server configuration error: Missing API Key." });
    }
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const { gameName, guideType, platform } = request.body;

        if (!gameName || !guideType || !platform) {
            return response.status(400).json({ error: 'Missing required fields: gameName, guideType, platform' });
        }
    
        const prompt = generatePrompt(gameName, guideType, platform);
        
        const geminiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.95,
                tools: [{googleSearch: {}}],
            }
        });
    
        const guide = geminiResponse.text;
        const groundingChunks = geminiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        let references: Reference[] = [];
        if (groundingChunks) {
            references = groundingChunks
                .map((chunk: any) => ({
                    uri: chunk.web?.uri,
                    title: chunk.web?.title,
                }))
                .filter((ref: Reference) => ref.uri && ref.title); // Filter out any chunks without a URI or title
        }
        
        const uniqueReferences = Array.from(new Map(references.map(item => [item['uri'], item])).values());
    
        return response.status(200).json({ guide, references: uniqueReferences });

    } catch (error) {
        console.error("Error in generate-guide API:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return response.status(500).json({ error: 'Failed to get a response from the AI.', details: errorMessage });
    }
}
