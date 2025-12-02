/**
 * AI Service Abstraction
 * Provides unified interface for AI text generation across different providers
 */

import Anthropic from '@anthropic-ai/sdk';

export interface AIServiceConfig {
  provider: 'anthropic' | 'openai' | 'mock';
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
}

export interface GenerateResponse {
  content: string;
  model: string;
  tokensUsed?: number;
  provider: string;
}

export class AIService {
  private config: AIServiceConfig;
  private anthropicClient?: Anthropic;
  private retryAttempts = 3;
  private retryDelay = 1000; // ms

  constructor(config: AIServiceConfig) {
    this.config = {
      defaultTemperature: 0.7,
      defaultMaxTokens: 4096,
      ...config,
    };

    if (config.provider === 'anthropic' && config.apiKey) {
      this.anthropicClient = new Anthropic({
        apiKey: config.apiKey,
      });
    }
  }

  async generate(params: GenerateParams): Promise<GenerateResponse> {
    const temperature = params.temperature ?? this.config.defaultTemperature ?? 0.7;
    const maxTokens = params.maxTokens ?? this.config.defaultMaxTokens ?? 4096;

    switch (this.config.provider) {
      case 'anthropic':
        return this.generateWithAnthropic(params, temperature, maxTokens);
      case 'openai':
        return this.generateWithOpenAI(params, temperature, maxTokens);
      case 'mock':
        return this.generateMock(params);
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  private async generateWithAnthropic(
    params: GenerateParams,
    temperature: number,
    maxTokens: number
  ): Promise<GenerateResponse> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not initialized. Please provide an API key.');
    }

    const model = this.config.model || 'claude-3-5-sonnet-20241022';

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.anthropicClient.messages.create({
          model,
          max_tokens: maxTokens,
          temperature,
          system: params.systemPrompt,
          messages: [
            {
              role: 'user',
              content: params.prompt,
            },
          ],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
          throw new Error('Unexpected response type from Anthropic API');
        }

        return {
          content: content.text,
          model,
          tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
          provider: 'anthropic',
        };
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw new Error(`Anthropic API error after ${attempt} attempts: ${error}`);
        }

        // Exponential backoff
        await this.sleep(this.retryDelay * Math.pow(2, attempt - 1));
      }
    }

    throw new Error('Failed to generate response from Anthropic');
  }

  private async generateWithOpenAI(
    params: GenerateParams,
    temperature: number,
    maxTokens: number
  ): Promise<GenerateResponse> {
    // Placeholder for OpenAI implementation
    throw new Error('OpenAI provider not yet implemented');
  }

  private async generateMock(params: GenerateParams): Promise<GenerateResponse> {
    // Mock responses for testing without API calls
    await this.sleep(100); // Simulate API delay (reduced for faster testing)

    let mockContent = '';
    const promptLower = params.prompt.toLowerCase();

    // Debug logging
    console.log(`[AI Mock] Prompt contains: meta tags=${promptLower.includes('meta tags')}, creează meta=${promptLower.includes('creează meta')}`);
    console.log(`[AI Mock] Prompt first 200 chars: ${params.prompt.substring(0, 200)}`);

    // Detect what type of generation is requested based on prompt
    // Meta tags check FIRST since the prompt can contain other keywords
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
        'răni gingivale',
        'igienă dentară',
        'cabinet stomatologic modern',
        'tehnologie dentară',
        'programare online stomatologie',
      ]);
    } else if (promptLower.includes('hook angle') || promptLower.includes('hook')) {
      mockContent = JSON.stringify({
        statement:
          '90% din cabinetele stomatologice din România pierd minimum 15 pacienți pe lună din cauza unui site care nu răspunde la telefoane mobile.',
        emotion: 'fear',
        reasoning:
          'Proprietarii de cabinete stomatologice investesc mult în echipamente dar neglijează prezența digitală. Cifra specifică creează urgență și este verificabilă în experiența lor.',
      });
    } else if (promptLower.includes('obiecți') || promptLower.includes('generează 5') || promptLower.includes('skeptic')) {
      mockContent = JSON.stringify([
        {
          id: 1,
          text: 'Deja am site și pagină de Facebook, pacienții vin oricum prin recomandări',
          category: 'urgency',
          rebuttalStrategy:
            'Arată datele: 73% din pacienții noi caută online înainte să sune. Recomandările sunt instabile, prezența digitală e activ de business controlabil.',
        },
        {
          id: 2,
          text: 'Nu am timp să mă ocup de un site nou, sunt ocupat cu pacienții',
          category: 'time',
          rebuttalStrategy:
            'Site-ul modern lucrează pentru tine 24/7. Automatizează programările și reduce timpul petrecut la telefon. Investiția de timp inițială se recuperează în prima lună.',
        },
        {
          id: 3,
          text: 'Am încercat deja marketing online și nu a funcționat',
          category: 'trust',
          rebuttalStrategy:
            'Majoritatea agențiilor nu înțeleg specificul medical. Arată diferența dintre marketing generic și strategie construită pe psihologia pacientului stomatologic.',
        },
        {
          id: 4,
          text: 'Este prea scump, mai bine investesc în echipamente',
          category: 'money',
          rebuttalStrategy:
            'Un echipament de 50.000€ stă inactiv dacă nu ai pacienți. Site-ul aduce pacienți care justifică investiția în echipamente. ROI demonstrabil în 3-6 luni.',
        },
        {
          id: 5,
          text: 'Nu știu cum funcționează tehnologia, nu sunt specialist',
          category: 'knowledge',
          rebuttalStrategy:
            'Nu trebuie să fii. La fel cum pacienții tăi nu trebuie să știe stomatologie. Noi gestionăm tot, tu vezi doar rezultatele în programări.',
        },
      ]);
    } else if (promptLower.includes('outline') || promptLower.includes('creează un outline')) {
      mockContent = JSON.stringify([
        {
          title: 'De ce majoritatea cabinetelor stomatologice pierd pacienți fără să știe',
          purpose: 'Hook și agitarea problemei. Stabilește autoritatea și face cititorul să realizeze că are o problemă.',
          keyPoints: [
            'Statistici despre comportamentul pacienților moderni',
            'Cazuri reale de cabinete care au pierdut venituri',
            'Diferența dintre percepție și realitate în atragerea pacienților',
          ],
          lsiKeywords: ['cabinet stomatologic modern', 'programare online stomatologie', 'pacienți noi'],
          tone: 'urgent',
        },
        {
          title: 'Cum s-a schimbat comportamentul pacienților în ultimii 3 ani',
          purpose: 'Educație și context. Arată DE CE există problema, construiește autoritate prin date.',
          keyPoints: [
            'Trendul căutării online pentru servicii medicale',
            'Importanța recenziilor și a prezenței digitale',
            'Diferența generațională în alegerea medicului stomatolog',
          ],
          lsiKeywords: ['implant dentar', 'albire profesională', 'detartraj ultrasonic'],
          tone: 'educational',
        },
        {
          title: 'Costul real al unui site învechit: calculul pe care nimeni nu-l face',
          purpose: 'Cost al inacțiunii. Cuantifică pierderea în termeni de venit și oportunitate.',
          keyPoints: [
            'Formula de calcul: pacienți pierduți × valoare medie × lifetime value',
            'Comparație: cost site modern vs. venit pierdut anual',
            'Exemple concrete din industrie',
          ],
          lsiKeywords: ['coroană dentară', 'ortodonție', 'cabinet stomatologic modern'],
          tone: 'authoritative',
        },
        {
          title: 'Ce caută de fapt pacienții când aleg un cabinet stomatologic',
          purpose: 'Soluția indirectă. Nu vinde servicii, învață ce funcționează și de ce.',
          keyPoints: [
            'Transparența prețurilor și serviciilor',
            'Dovezi sociale și credibilitate online',
            'Experiența utilizatorului pe mobile',
            'Rapiditatea programării',
          ],
          lsiKeywords: ['aparat dentar invizibil', 'chirurgie orală', 'tehnologie dentară'],
          tone: 'empathetic',
        },
        {
          title: 'De ce metodele vechi de marketing nu mai funcționează',
          purpose: 'Răspunde la obiecția "am încercat deja". Diferențiază abordarea corectă de cea greșită.',
          keyPoints: [
            'Diferența dintre marketing generic și specific stomatologic',
            'Greșelile comune ale agențiilor care nu cunosc industria medicală',
            'Ce face ca o strategie digitală să funcționeze în stomatologie',
          ],
          lsiKeywords: ['periodontologie', 'endodonție', 'protetică dentară'],
          tone: 'authoritative',
        },
        {
          title: 'Primul pas: cum să evaluezi unde pierzi pacienți acum',
          purpose: 'Call to action soft. Oferă valoare imediată și deschide conversația.',
          keyPoints: [
            'Metodologia de audit a prezenței digitale',
            'Red flags care indică probleme majore',
            'Oportunități rapide de îmbunătățire',
          ],
          lsiKeywords: ['igienă dentară', 'programare online stomatologie'],
          tone: 'educational',
        },
      ]);
    } else if (promptLower.includes('competitor') || promptLower.includes('competitiv')) {
      mockContent = JSON.stringify([
        'Majoritatea cabinetelor nu afișează prețuri transparente, creând fricțiune în procesul de decizie',
        'Pacienții sub 35 ani rezervă exclusiv online după ora 20:00',
        'Pozițiile în Google Maps sunt mai importante decât SEO tradițional pentru servicii dentare de urgență',
        'Recenziile negative neadresate reduc rata de conversie cu 67%',
        'Site-urile care se încarcă în peste 3 secunde pierd 53% din vizitatori',
        'Integrarea cu WhatsApp Business crește rata de programări cu 40%',
        'Video-uri cu prezentarea echipei cresc încrederea și rata de conversie cu 35%',
      ]);
    } else if (promptLower.includes('call-to-action') || promptLower.includes('cta')) {
      mockContent =
        'Primește un audit gratuit al prezenței tale digitale - descoperă exact unde pierzi pacienți și cum să rezolvi în următoarele 30 de zile.';
    } else if (promptLower.includes('hero') || promptLower.includes('secțiunea hero')) {
      mockContent = JSON.stringify({
        h1: 'Site Web Profesional pentru Cabinetul Tău Stomatologic',
        subheadline: 'Atragi pacienți noi din Google Maps și căutări locale în primele 30 de zile. Fără competențe tehnice. Rezultate garantate.',
      });
    } else if (promptLower.includes('aio') || promptLower.includes('ai overview') || promptLower.includes('definiție')) {
      mockContent = 'Un cabinet stomatologic modern atrage pacienți prin prezența digitală profesională. Site-ul optimizat pentru Google Maps și căutări locale aduce în medie 15-20 de programări noi lunar. Investiția se recuperează în 2-3 luni prin pacienții noi atrași online.';
    } else if (promptLower.includes('pain') || promptLower.includes('durerea') || promptLower.includes('agitate') || promptLower.includes('durere')) {
      mockContent = 'Fiecare zi fără prezență digitală înseamnă pacienți care aleg concurența. 73% din pacienți caută online înainte să sune. Site-ul învechit sau lipsa lui echivalează cu un cabinet închis pentru 7 din 10 potențiali pacienți.';
    } else if (promptLower.includes('comparație') || promptLower.includes('comparison') || promptLower.includes('tabel')) {
      mockContent = JSON.stringify({
        headers: ['Fără Site Modern', 'Cu Site Optimizat'],
        rows: [
          ['Invizibil pe Google Maps', 'Prima pagină în căutări locale'],
          ['Pacienți doar din recomandări', 'Flux constant de pacienți noi'],
          ['Programări doar telefonic', 'Rezervări online 24/7'],
          ['Fără dovezi sociale', 'Recenzii integrate automat'],
          ['Încărcare lentă pe mobil', 'Sub 2 secunde, orice dispozitiv'],
        ],
      });
    } else if (promptLower.includes('technical') || promptLower.includes('soluție tehnică') || promptLower.includes('tehnologie') || promptLower.includes('soluție')) {
      mockContent = 'Site-ul optimizat pentru stomatologie include: programare online integrată, sincronizare Google Business Profile, viteză sub 2 secunde, design responsive, SEO on-page complet, certificat SSL gratuit, și suport tehnic dedicat.';
    } else if (promptLower.includes('faq') || promptLower.includes('întrebări')) {
      mockContent = JSON.stringify([
        { question: 'Cât durează realizarea site-ului?', answer: 'Site-ul complet este gata în 7-14 zile lucrătoare, cu tot conținutul și optimizările SEO.' },
        { question: 'Trebuie să știu programare?', answer: 'Nu. Noi gestionăm tot, de la design la conținut și optimizare. Tu doar aprobi rezultatele.' },
        { question: 'Cum mă ajută să atrag pacienți?', answer: 'Prin SEO local și integrare Google Maps, pacienții din zona ta te găsesc când caută servicii stomatologice.' },
        { question: 'Ce se întâmplă dacă nu sunt mulțumit?', answer: 'Oferim garanție 30 de zile. Dacă nu vezi rezultate măsurabile, primești banii înapoi.' },
        { question: 'Pot face modificări ulterior?', answer: 'Da, primești acces la un panou admin simplu sau poți solicita modificări de la echipa noastră.' },
      ]);
    } else if (promptLower.includes('cta section') || promptLower.includes('call to action section') || promptLower.includes('secțiunea cta')) {
      mockContent = JSON.stringify({
        headline: 'Primește Oferta Personalizată în 24 de Ore',
        body: 'Completează formularul și primești în mai puțin de o zi oferta completă, adaptată nevoilor cabinetului tău. Fără obligații.',
        buttonText: 'Vreau Oferta Gratuită',
      });
    } else if (promptLower.includes('schema')) {
      mockContent = JSON.stringify({
        product: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Site Web Cabinet Stomatologic',
          description: 'Creăm site-uri profesionale pentru cabinete stomatologice cu SEO inclus',
          provider: { '@type': 'Organization', name: 'Webnova' },
          areaServed: 'România',
        },
        faq: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [],
        },
        breadcrumb: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [],
        },
      });
    } else if (promptLower.includes('internal links') || promptLower.includes('linkuri interne') || promptLower.includes('internal')) {
      mockContent = JSON.stringify({
        internalLinks: [
          { text: 'Site Cabinet Veterinar', slug: 'cabinet-veterinar' },
          { text: 'Site Salon Înfrumusețare', slug: 'salon-infrumusetare' },
          { text: 'Site Birou Arhitectură', slug: 'birou-arhitectura' },
        ],
      });
    } else {
      mockContent = 'Mock response for: ' + params.prompt.substring(0, 100);
    }

    console.log(`[AI Mock] Returning mockContent (first 100 chars): ${mockContent.substring(0, 100)}`);

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
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;

      return JSON.parse(jsonString.trim());
    } catch (error) {
      throw new Error(`Failed to parse AI response as JSON: ${error}\n\nContent: ${content}`);
    }
  }
}
