/**
 * AI Service Abstraction
 * Provides unified interface for AI text generation using Google Gemini
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface AIServiceConfig {
  provider: 'gemini' | 'mock';
  apiKey?: string;
  model?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
}

export interface GenerateParams {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface GenerateResponse {
  content: string;
  model: string;
  tokensUsed?: number;
  provider: string;
}

export class AIService {
  private config: AIServiceConfig;
  private geminiClient?: GoogleGenerativeAI;
  private geminiModel?: GenerativeModel;
  private retryAttempts = 3;
  private retryDelay = 1000; // ms

  constructor(config: AIServiceConfig) {
    this.config = {
      defaultTemperature: 0.7,
      defaultMaxTokens: 4096,
      model: 'gemini-2.0-flash',
      ...config,
    };

    if (config.provider === 'gemini' && config.apiKey) {
      this.geminiClient = new GoogleGenerativeAI(config.apiKey);
      this.geminiModel = this.geminiClient.getGenerativeModel({
        model: this.config.model || 'gemini-2.0-flash',
      });
    }
  }

  async generate(params: GenerateParams): Promise<GenerateResponse> {
    const temperature = params.temperature ?? this.config.defaultTemperature ?? 0.7;
    const maxTokens = params.maxTokens ?? this.config.defaultMaxTokens ?? 4096;

    switch (this.config.provider) {
      case 'gemini':
        return this.generateWithGemini(params, temperature, maxTokens);
      case 'mock':
        return this.generateMock(params);
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  private async generateWithGemini(
    params: GenerateParams,
    temperature: number,
    maxTokens: number
  ): Promise<GenerateResponse> {
    if (!this.geminiClient || !this.geminiModel) {
      throw new Error('Gemini client not initialized. Please provide GOOGLE_GEMINI_API_KEY.');
    }

    const model = this.config.model || 'gemini-2.5-flash-preview-05-20';

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        // Build the prompt with system context
        const fullPrompt = params.systemPrompt
          ? `${params.systemPrompt}\n\n${params.prompt}`
          : params.prompt;

        // Configure generation settings
        const generationConfig: any = {
          temperature,
          maxOutputTokens: maxTokens,
        };

        // Enable JSON mode if requested
        if (params.jsonMode) {
          generationConfig.responseMimeType = 'application/json';
        }

        console.log('[Gemini] Sending prompt (first 200 chars):', fullPrompt.substring(0, 200));
        console.log('[Gemini] Generation config:', JSON.stringify(generationConfig));

        // Simple call like the test that worked
        const result = await this.geminiModel.generateContent(fullPrompt);

        const response = result.response;

        // Debug: Check for blocked responses
        console.log('[Gemini] Candidates:', JSON.stringify(response.candidates?.map(c => ({
          finishReason: c.finishReason,
          safetyRatings: c.safetyRatings
        }))));

        const content = response.text();
        console.log('[Gemini] Response length:', content.length);
        console.log('[Gemini] Response (first 300 chars):', content.substring(0, 300));

        return {
          content,
          model,
          tokensUsed: response.usageMetadata?.totalTokenCount,
          provider: 'gemini',
        };
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw new Error(`Gemini API error after ${attempt} attempts: ${error}`);
        }

        // Exponential backoff
        await this.sleep(this.retryDelay * Math.pow(2, attempt - 1));
      }
    }

    throw new Error('Failed to generate response from Gemini');
  }

  private async generateMock(params: GenerateParams): Promise<GenerateResponse> {
    // Mock responses for testing without API calls
    await this.sleep(100); // Simulate API delay

    let mockContent = '';
    const promptLower = params.prompt.toLowerCase();

    // Meta tags check FIRST
    if (promptLower.includes('meta tags') || promptLower.includes('meta title') || promptLower.includes('creează meta')) {
      mockContent = JSON.stringify({
        metaTitle: 'Site Web Cabinet Stomatologic + SEO Inclus | Webnova',
        metaDescription: 'Creăm site-uri pentru cabinete stomatologice cu SEO inclus. Programări online, Google Maps și viteza de încărcare sub 1s. Pacienți noi în 30 de zile.',
      });
    } else if (promptLower.includes('lsi')) {
      mockContent = JSON.stringify([
        'implant dentar',
        'albire profesională',
        'detartraj ultrasonic',
        'coroană dentară',
        'aparat dentar invizibil',
        'ortodonție',
        'chirurgie orală',
        'periodontologie',
        'endodonție',
        'protetică dentară',
      ]);
    } else if (promptLower.includes('hook angle') || promptLower.includes('hook')) {
      mockContent = JSON.stringify({
        statement: '90% din cabinetele stomatologice pierd minimum 15 pacienți pe lună din cauza unui site care nu răspunde la telefoane mobile.',
        emotion: 'fear',
        reasoning: 'Cifra specifică creează urgență și este verificabilă în experiența lor.',
      });
    } else if (promptLower.includes('obiecți') || promptLower.includes('skeptic')) {
      mockContent = JSON.stringify([
        { id: 1, text: 'Deja am site și pagină de Facebook', category: 'urgency', rebuttalStrategy: '73% din pacienții noi caută online înainte să sune.' },
        { id: 2, text: 'Nu am timp să mă ocup de un site nou', category: 'time', rebuttalStrategy: 'Site-ul modern lucrează pentru tine 24/7.' },
        { id: 3, text: 'Am încercat deja marketing online și nu a funcționat', category: 'trust', rebuttalStrategy: 'Majoritatea agențiilor nu înțeleg specificul medical.' },
        { id: 4, text: 'Este prea scump', category: 'money', rebuttalStrategy: 'ROI demonstrabil în 3-6 luni.' },
        { id: 5, text: 'Nu știu cum funcționează tehnologia', category: 'knowledge', rebuttalStrategy: 'Nu trebuie să fii expert. Noi gestionăm tot.' },
      ]);
    } else if (promptLower.includes('outline')) {
      mockContent = JSON.stringify([
        { title: 'De ce majoritatea cabinetelor pierd pacienți', purpose: 'Hook și agitarea problemei', keyPoints: ['Statistici', 'Cazuri reale'], lsiKeywords: ['cabinet stomatologic modern'], tone: 'urgent' },
        { title: 'Cum s-a schimbat comportamentul pacienților', purpose: 'Educație și context', keyPoints: ['Trendul online', 'Recenzii'], lsiKeywords: ['implant dentar'], tone: 'educational' },
      ]);
    } else if (promptLower.includes('hero') || promptLower.includes('secțiunea hero')) {
      mockContent = JSON.stringify({
        h1: 'Site Web Profesional pentru Cabinetul Tău Stomatologic',
        subheadline: 'Atragi pacienți noi din Google Maps și căutări locale în primele 30 de zile.',
      });
    } else if (promptLower.includes('aio') || promptLower.includes('definiție')) {
      mockContent = 'Un cabinet stomatologic modern atrage pacienți prin prezența digitală profesională. Site-ul optimizat aduce în medie 15-20 de programări noi lunar.';
    } else if (promptLower.includes('pain') || promptLower.includes('durere') || promptLower.includes('agitate')) {
      mockContent = 'Fiecare zi fără prezență digitală înseamnă pacienți care aleg concurența. 73% din pacienți caută online înainte să sune.';
    } else if (promptLower.includes('comparație') || promptLower.includes('tabel')) {
      mockContent = JSON.stringify({
        headers: ['Fără Site Modern', 'Cu Site Optimizat'],
        rows: [
          ['Invizibil pe Google Maps', 'Prima pagină în căutări locale'],
          ['Pacienți doar din recomandări', 'Flux constant de pacienți noi'],
          ['Programări doar telefonic', 'Rezervări online 24/7'],
        ],
      });
    } else if (promptLower.includes('technical') || promptLower.includes('soluție')) {
      mockContent = 'Site-ul optimizat include: programare online, sincronizare Google Business Profile, viteză sub 2 secunde, SEO complet.';
    } else if (promptLower.includes('faq') || promptLower.includes('întrebări')) {
      mockContent = JSON.stringify([
        { question: 'Cât durează realizarea site-ului?', answer: 'Site-ul complet este gata în 7-14 zile.' },
        { question: 'Trebuie să știu programare?', answer: 'Nu. Noi gestionăm tot.' },
        { question: 'Cum mă ajută să atrag pacienți?', answer: 'Prin SEO local și Google Maps.' },
      ]);
    } else if (promptLower.includes('cta') || promptLower.includes('call to action')) {
      mockContent = JSON.stringify({
        headline: 'Primește Oferta Personalizată în 24 de Ore',
        body: 'Completează formularul și primești oferta completă. Fără obligații.',
        buttonText: 'Vreau Oferta Gratuită',
      });
    } else if (promptLower.includes('call-to-action')) {
      mockContent = 'Primește un audit gratuit al prezenței tale digitale.';
    } else {
      mockContent = 'Mock response for: ' + params.prompt.substring(0, 100);
    }

    return {
      content: mockContent,
      model: 'mock-model',
      tokensUsed: 1000,
      provider: 'mock',
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Test connection to AI service
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generate({
        prompt: 'Test connection. Respond with: OK',
        maxTokens: 10,
      });
      return response.content.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Parse JSON response from AI, with error handling
   */
  parseJSON<T>(content: string): T {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      return JSON.parse(jsonString.trim());
    } catch (error) {
      throw new Error(`Failed to parse AI response as JSON: ${error}\n\nContent: ${content}`);
    }
  }
}
