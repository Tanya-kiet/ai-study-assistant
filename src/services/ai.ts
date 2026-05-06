const API_KEY = import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
const BASE_URL = import.meta.env.VITE_AI_BASE_URL || "https://api.openai.com/v1";

let dynamicModel: string | null = null;

export async function getValidModel(): Promise<string> {
  if (dynamicModel) return dynamicModel;
  try {
    const res = await fetch(`${BASE_URL}/models`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const data = await res.json();
    console.log("AVAILABLE MODELS:", data);
    
    // Use the first available model from the API response
    if (data?.data && data.data.length > 0) {
      // Prefer a grok model if available, otherwise just take the first one
      const grokModel = data.data.find((m: any) => m.id.includes("grok"));
      dynamicModel = grokModel ? grokModel.id : data.data[0].id;
      return dynamicModel as string;
    }
    return "grok-2-latest"; // Fallback
  } catch (err) {
    console.error("Failed to fetch models:", err);
    return "grok-2-latest";
  }
}

export async function askAI(message: string): Promise<string> {
  try {
    const modelToUse = await getValidModel();
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: "system", content: "You are a helpful AI study assistant." },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await res.json();
    console.log("AI RAW RESPONSE:", data);

    // Handle multiple formats
    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    if (data?.output) {
      return data.output;
    }

    if (data?.error) {
      return `API Error: ${data.error}`;
    }

    return "Unexpected AI response format.";
  } catch (err) {
    console.error("AI ERROR:", err);
    return "Failed to connect to AI.";
  }
}

export type QuizQuestion = {
  question: string
  options: string[]
  answer: string
}

export async function generateQuiz(topic: string, difficulty: string = "Medium", count: number = 5): Promise<QuizQuestion[]> {
  try {
    const prompt = `Generate ${count} MCQ questions on ${topic} with ${difficulty} difficulty.
Return ONLY JSON: [
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }
]`;

    const modelToUse = await getValidModel();
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    console.log("AI RAW RESPONSE:", data);

    const text =
      data?.choices?.[0]?.message?.content ||
      data?.output ||
      "[]";

    console.log("QUIZ RAW:", text);

    try {
      return JSON.parse(text) as QuizQuestion[];
    } catch {
      return [];
    }
  } catch (err) {
    console.error("AI ERROR:", err);
    return [];
  }
}

export async function getModels() {
  try {
    const res = await fetch(`${BASE_URL}/models`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const data = await res.json();
    console.log("AVAILABLE MODELS:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch models:", err);
  }
}

