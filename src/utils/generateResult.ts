
import { ContentType, PrayerSize } from "@/types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const createPrompt = (context: string, contentType: ContentType, languageCode: string, prayerSize?: PrayerSize): string => {
  // Define word counts for different prayer sizes
  const prayerSizes = {
    small: { min: 50, max: 100 },
    medium: { min: 100, max: 200 },
    large: { min: 200, max: 300 }
  };

  // Base prompts for different content types
  const prompts = {
    prayer: {
      pt: (size?: PrayerSize) => {
        const wordCount = size ? `entre ${prayerSizes[size].min}-${prayerSizes[size].max} palavras` : '100-150 palavras';
        return `Crie uma oração cristã sincera, acolhedora e empática sobre "${context}". A oração deve ser em primeira pessoa, como se a pessoa estivesse orando, e deve ter ${wordCount}. Use linguagem respeitosa e bíblica.`;
      },
      es: (size?: PrayerSize) => {
        const wordCount = size ? `entre ${prayerSizes[size].min}-${prayerSizes[size].max} palabras` : '100-150 palabras';
        return `Crea una oración cristiana sincera, acogedora y empática sobre "${context}". La oración debe estar en primera persona, como si la persona estuviera orando, y debe tener ${wordCount}. Usa un lenguaje respetuoso y bíblico.`;
      },
      en: (size?: PrayerSize) => {
        const wordCount = size ? `between ${prayerSizes[size].min}-${prayerSizes[size].max} words` : '100-150 words';
        return `Create a sincere, welcoming, and empathetic Christian prayer about "${context}". The prayer should be in first person, as if the person is praying, and should be ${wordCount}. Use respectful and biblical language.`;
      }
    },
    verses: {
      pt: `Selecione 3 versículos bíblicos relevantes e consoladores relacionados a "${context}". Forneça o texto completo e a referência de cada versículo.`,
      es: `Selecciona 3 versículos bíblicos relevantes y reconfortantes relacionados con "${context}". Proporciona el texto completo y la referencia de cada versículo.`,
      en: `Select 3 relevant and comforting Bible verses related to "${context}". Provide the full text and reference for each verse.`
    }
  };

  // Default to English if language not supported
  const lang = (languageCode in prompts.prayer) ? languageCode : 'en';
  
  if (contentType === 'prayer') {
    return prompts.prayer[lang](prayerSize);
  } else if (contentType === 'verses') {
    return prompts[contentType][lang];
  } else if (contentType === 'both') {
    return `${prompts.prayer[lang](prayerSize)} ${prompts.verses[lang]}`;
  }
  
  return prompts.prayer[lang](prayerSize); // Default to prayer if invalid type
};

const parseGeminiResponse = async (response: any, contentType: ContentType): Promise<{ prayer?: string; verses?: { text: string; reference: string }[] }> => {
  const text = response.candidates[0]?.content?.parts?.[0]?.text || '';
  const result: { prayer?: string; verses?: { text: string; reference: string }[] } = {};

  if (contentType === 'prayer' || contentType === 'both') {
    // Extract prayer (everything before the verses if contentType is 'both')
    const prayerText = contentType === 'both' ? 
      text.split(/Versículos:|Verses:|Versículos:/)[0].trim() :
      text.trim();
    result.prayer = prayerText;
  }

  if (contentType === 'verses' || contentType === 'both') {
    // Extract verses with references
    const versesSection = contentType === 'both' ? 
      text.split(/Versículos:|Verses:|Versículos:/)[1] || text :
      text;
    
    const verses = versesSection.match(/[""]([^""]+)[""] - ([^"\n]+)/g) || [];
    result.verses = verses.map(verse => {
      const [, text, reference] = verse.match(/[""]([^""]+)[""] - ([^"\n]+)/) || [];
      return { text: text.trim(), reference: reference.trim() };
    });
  }

  return result;
}

export const generateContent = async (
  context: string,
  contentType: ContentType,
  languageCode: string,
  prayerSize?: PrayerSize
): Promise<{ prayer?: string; verses?: { text: string; reference: string }[] }> => {
  console.log(`Generating content for context: ${context}, type: ${contentType}, language: ${languageCode}, prayer size: ${prayerSize}`);

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
    }

    const prompt = createPrompt(context, contentType, languageCode, prayerSize);
    
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return await parseGeminiResponse(data, contentType);

  } catch (error) {
    console.error('Error generating content:', error);
    
    // Return fallback content in case of error
    if (languageCode === 'pt') {
      return contentType === 'verses' ? 
        { verses: [{ text: "O Senhor é o meu pastor; nada me faltará.", reference: "Salmos 23:1" }] } :
        { prayer: `Senhor, pedimos sua orientação neste momento de ${context}. Por favor, nos ajude e nos fortaleça. Amém.` };
    } else if (languageCode === 'es') {
      return contentType === 'verses' ?
        { verses: [{ text: "El Señor es mi pastor; nada me faltará.", reference: "Salmos 23:1" }] } :
        { prayer: `Señor, pedimos tu guía en este momento de ${context}. Por favor, ayúdanos y fortalécenos. Amén.` };
    } else {
      return contentType === 'verses' ?
        { verses: [{ text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" }] } :
        { prayer: `Lord, we ask for your guidance in this moment of ${context}. Please help us and strengthen us. Amen.` };
    }
  }
};
