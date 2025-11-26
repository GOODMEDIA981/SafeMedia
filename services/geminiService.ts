import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MediaAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The official title of the media." },
    mediaType: { type: Type.STRING, description: "Type of media (Movie, Book, Show, Song, etc)." },
    ratings: {
      type: Type.OBJECT,
      properties: {
        originCountry: { type: Type.STRING, description: "The primary country of origin." },
        originRating: { type: Type.STRING, description: "The rating in the country of origin (e.g., BBFC 15, TV-MA)." },
        usMpaRating: { type: Type.STRING, description: "The equivalent US MPA or TV Parental Guidelines rating." },
        suggestedAge: { 
            type: Type.STRING, 
            description: "Suggested minimum age (e.g., '13+', '18+', 'All Ages'). If the content is suitable for 16 or 17 year olds, you MUST round up and output '18+'." 
        },
        explanation: { type: Type.STRING, description: "Brief explanation of why it received this rating." }
      },
      required: ["originCountry", "originRating", "usMpaRating", "suggestedAge", "explanation"]
    },
    contentWarnings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Category (e.g., Violence, Sexual Content, Language)." },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Extreme"] },
          details: { type: Type.STRING, description: "Specific details about the content." },
          specificScenes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Descriptions of specific scenes that triggered this warning."
          }
        },
        required: ["category", "severity", "details", "specificScenes"]
      }
    },
    controversies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of controversies, bans, or public backlashes the media has faced."
    },
    overallAssessment: {
      type: Type.STRING,
      description: "A comprehensive parental guidance summary and overall assessment."
    }
  },
  required: ["title", "mediaType", "ratings", "contentWarnings", "controversies", "overallAssessment"]
};

export const analyzeMedia = async (query: string): Promise<MediaAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following media: "${query}". 
      Provide a strict safety screening. 
      Familiarize yourself with the media's country of origin, cultural context, and specific content.
      Be explicit about content warnings and cite specific scenes.
      If the media is obscure or from a specific country, ensure the 'originRating' reflects that country's standard.
      IMPORTANT: For the suggestedAge, if you assess it as 16+ or 17+, you MUST round up to '18+'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are SAFEMEDIA, a world-class AI media screener. Your goal is to provide protective, detailed, and accurate information to parents and users about potential triggers, ratings, and controversies in media. Be objective but thorough."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as MediaAnalysis;
  } catch (error) {
    console.error("Error analyzing media:", error);
    throw error;
  }
};