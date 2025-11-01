import OpenAI from 'openai';

// Lazy initialization - only create client when first used
let openaiClient: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
};

export const getChatResponse = async (
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<string> => {
  try {
    const openai = getOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'No response';
  } catch (error) {
    console.error('ChatGPT API Error:', error);
    throw error;
  }
};

export const generateRoadmap = async (
  type: 'exam' | 'placement',
  subject?: string
): Promise<any> => {
  try {
    const openai = getOpenAIClient();
    
    const prompt = `Generate a detailed study roadmap for ${type} preparation${
      subject ? ` in ${subject}` : ''
    }. 
    Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
    {
      "topics": [
        {
          "name": "Topic Name",
          "subTopics": [
            {"name": "Subtopic 1", "completed": false},
            {"name": "Subtopic 2", "completed": false}
          ],
          "completed": false
        }
      ]
    }
    Include 5-7 main topics with 3-5 subtopics each.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '{"topics":[]}';
    
    // Remove markdown code blocks if present
    let cleanContent = content.trim();
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error('Generate Roadmap Error:', error);
    throw error;
  }
};