// API Configuration
export const API_CONFIG = {
  OPENAI: {
    API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
    BASE_URL: 'https://api.openai.com/v1',
    ENDPOINTS: {
      CHAT: '/chat/completions',
      COMPLETIONS: '/completions'
    },
    MODELS: {
      GPT4: 'gpt-4',
      GPT35: 'gpt-3.5-turbo'
    }
  }
};

// Validate API key
const validateApiKey = () => {
  const apiKey = API_CONFIG.OPENAI.API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }
  if (!apiKey.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format. API key should start with "sk-".');
  }
  return apiKey;
};

// API Helper Functions
export const generateDocumentContent = async (prompt: string, type: 'rfp' | 'proposal' | 'rfq' | 'quotation') => {
  try {
    const apiKey = validateApiKey();
    
    const response = await fetch(`${API_CONFIG.OPENAI.BASE_URL}${API_CONFIG.OPENAI.ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.OPENAI.MODELS.GPT4,
        messages: [
          {
            role: 'system',
            content: `You are an expert in creating ${type.toUpperCase()} documents. Generate professional and detailed content. Focus on clarity, completeness, and industry best practices.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating document content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while generating content');
  }
}; 