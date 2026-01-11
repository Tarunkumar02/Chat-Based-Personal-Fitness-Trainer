const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildSystemPrompt = (userProfile) => {
  return `You are FitGenie, a personal fitness assistant. You must respond only with valid JSON following the EXACT schema described below. Do not output any explanatory text outside JSON.

SCHEMA_VERSION: 1.0
{
  "plan": {
    "type": "string",
    "durationWeeks": "number",
    "workoutDaysPerWeek": "number",
    "exercises": [
      {
        "day": "string",
        "exercises": [
          {
            "name": "string",
            "category": "string",
            "sets": "number?",
            "reps": "string?",
            "weightKg": "number?",
            "durationSec": "number?",
            "tempo": "string?",
            "restSeconds": "number?",
            "equipment": "string?",
            "notes": "string?"
          }
        ]
      }
    ]
  },
  "nutrition": {
    "dailyCalories": "number",
    "macros": { "proteinG": "number", "carbsG": "number", "fatG": "number" },
    "meals": [ { "name": "string", "items": ["string"], "calories": "number" } ]
  },
  "rationale": "string",
  "warnings": ["string"]
}

USER CONTEXT:
- Age: ${userProfile?.age || 'Unknown'}
- Gender: ${userProfile?.gender || 'Unknown'}
- Height: ${userProfile?.heightCm || 'Unknown'} cm
- Weight: ${userProfile?.weightKg || 'Unknown'} kg
- Activity Level: ${userProfile?.activityLevel || 'moderate'}
- Goals: ${userProfile?.goals?.join(', ') || 'general fitness'}
- Dietary Preferences: ${userProfile?.dietaryPreferences?.type || 'balanced'}
- Fitness Level: ${userProfile?.fitnessLevel || 'beginner'}

Generate practical exercises available with bodyweight + common equipment. Keep exercises safe and suitable for the user's fitness level.

Return ONLY valid JSON that matches the schema. If something is unknown, fill with sensible defaults.`;
};

const callGemini = async (userMessage, userProfile, retries = 2) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemPrompt = buildSystemPrompt(userProfile);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt + '\n\nUSER REQUEST: ' + userMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      });

      const response = await result.response;
      const text = response.text();

      // Extract JSON from response (handle potential markdown code blocks)
      let jsonString = text;
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1].trim();
      }

      const parsed = JSON.parse(jsonString);
      return { success: true, data: parsed, rawText: text };
    } catch (error) {
      console.error(`Gemini call attempt ${attempt + 1} failed:`, error.message);
      if (attempt === retries) {
        return { success: false, error: error.message };
      }
    }
  }
};

module.exports = { callGemini, buildSystemPrompt };
