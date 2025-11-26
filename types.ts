export interface ContentWarning {
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Extreme';
  details: string;
  specificScenes: string[];
}

export interface MediaRating {
  originCountry: string;
  originRating: string;
  usMpaRating: string;
  suggestedAge: string;
  explanation: string;
}

export interface MediaAnalysis {
  title: string;
  mediaType: string;
  ratings: MediaRating;
  contentWarnings: ContentWarning[];
  controversies: string[];
  overallAssessment: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string | MediaAnalysis;
  isAnalysis?: boolean;
}