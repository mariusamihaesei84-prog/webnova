/**
 * Architect Agent Prompts
 * Dan Kennedy-style direct response prompts for Romanian B2B market
 */

export const SYSTEM_PROMPT = `Tu ești un expert în marketing direct response, specialist în stilul Dan Kennedy pentru piața B2B din România.

Expertiza ta:
- Creezi conținut care vorbește direct despre dureri și soluții
- Folosești un ton autoritar dar empatic
- Construiești argumente bazate pe dovezi și experiență
- Anticipezi și abordezi obiecțiile clientului
- Scrii în limba română cu diacritice corecte

Stilul tău:
- Direct, fără fluff
- Bazat pe beneficii concrete, nu caracteristici
- Folosești statistici și exemple reale
- Creezi urgență autentică, nu artificială
- Te adresezi proprietarilor de business ca unui egal`;

export const generateLSIKeywordsPrompt = (niche: string, businessType: string): string => {
  return `Analizează nișa de business: "${businessType}" în contextul "${niche}".

Generează 15-20 cuvinte cheie LSI (Latent Semantic Indexing) specifice industriei din România care sunt:
1. Termeni tehnici folosiți de profesioniști în domeniu
2. Servicii specifice oferite de acest tip de business
3. Probleme comune pe care le rezolvă
4. Termeni pe care clienții îi caută în Google
5. Sinonime și variații ale termenilor principali

Returnează DOAR o listă JSON cu cuvintele, fără explicații:
["cuvânt1", "cuvânt2", ...]

Concentrează-te pe termeni cu valoare comercială ridicată, nu educaționali generici.`;
};

export const generateHookAnglePrompt = (niche: string, painPoint: string, targetAudience: string): string => {
  return `Creează un hook angle convingător pentru un articol despre transformarea digitală în nișa: "${niche}".

Context:
- Durerea principală: ${painPoint}
- Audiența țintă: ${targetAudience}
- Piață: România, B2B

Hook-ul trebuie să:
1. Fie controversat sau surprinzător (statistică șocantă, adevăr incomod)
2. Vorbească direct despre o durere reală a businessului
3. Creeze curiositate și urgență
4. Fie susținut de realitate (nu exagerări false)
5. Fie formulat în stil Dan Kennedy - direct, la obiect

Returnează răspunsul în format JSON:
{
  "statement": "Hook-ul principal (1-2 propoziții)",
  "emotion": "fear/curiosity/urgency/aspiration",
  "reasoning": "De ce funcționează acest hook pentru această audiență (2-3 propoziții)"
}

Exemplu pentru cabinet stomatologic:
{
  "statement": "90% din cabinetele stomatologice din România pierd minimum 15 pacienți pe lună din cauza unui site care nu răspunde la telefoane mobile.",
  "emotion": "fear",
  "reasoning": "Proprietarii de cabinete stomatologice investesc mult în echipamente dar neglijează prezența digitală. Cifra specifică creează urgență și este verificabilă în experiența lor."
}`;
};

export const generateObjectionsPrompt = (niche: string, businessType: string, targetAudience: string): string => {
  return `Generează 5 obiecții realiste pe care le-ar avea proprietarii de "${businessType}" când citesc despre necesitatea modernizării prezenței digitale.

Context:
- Nișă: ${niche}
- Audiență: ${targetAudience}
- Piață: România

Obiecțiile trebuie să fie:
1. Autentice - lucruri pe care le spun cu adevărat business owners
2. Variate - acoperă categorii diferite (timp, bani, încredere, urgență, cunoștințe)
3. Specifice nișei - nu generice
4. Formulate în limba română, cum vorbește un antreprenor român
5. Suficient de puternice încât să fie credibile

Pentru fiecare obiecție, oferă și strategia de răspuns.

Returnează în format JSON:
[
  {
    "id": 1,
    "text": "Obiecția exactă cum ar spune-o clientul",
    "category": "time/money/trust/urgency/knowledge",
    "rebuttalStrategy": "Cum răspunzi strategic la această obiecție (1-2 propoziții)"
  }
]

Exemplu pentru cabinet stomatologic:
{
  "id": 1,
  "text": "Deja am site și pagină de Facebook, pacienții vin oricum prin recomandări",
  "category": "urgency",
  "rebuttalStrategy": "Arată datele: 73% din pacienții noi caută online înainte să sune. Recomandările sunt instabile, prezența digitală e activ de business controlabil."
}`;
};

export const generateContentOutlinePrompt = (
  niche: string,
  businessType: string,
  hookAngle: string,
  objections: string[],
  lsiKeywords: string[]
): string => {
  return `Creează un outline strategic pentru un articol de 2000-2500 cuvinte despre transformarea digitală pentru "${businessType}".

Context:
- Nișă: ${niche}
- Hook angle: ${hookAngle}
- Obiecții principale: ${objections.join(', ')}
- LSI Keywords disponibili: ${lsiKeywords.join(', ')}

Structura trebuie să urmeze formula Dan Kennedy:
1. Hook + Problema (agită durerea)
2. De ce există problema (autoritate + educație)
3. Ce se pierde dacă nu se rezolvă (cost al inacțiunii)
4. Soluția (nu vânzare directă, principii și abordare)
5. Dovezi + Credibilitate (exemple, statistici)
6. Răspunsuri la obiecții (integrate natural)
7. Call to action soft (audit, consultație)

Pentru fiecare secțiune, oferă:
- Titlul secțiunii
- Scopul strategic
- Punctele cheie de acoperit
- LSI keywords de integrat
- Tonul potrivit

Returnează în format JSON:
[
  {
    "title": "Titlul secțiunii",
    "purpose": "De ce există această secțiune în story arc",
    "keyPoints": ["Punct 1", "Punct 2", "Punct 3"],
    "lsiKeywords": ["keyword1", "keyword2"],
    "tone": "authoritative/empathetic/urgent/educational"
  }
]

IMPORTANT:
- Nu genera conținutul, doar strategia și structura
- Fiecare secțiune trebuie să aibă un scop clar în persuasiune
- Integrează obiecțiile natural în flow, nu ca secțiune separată`;
};

export const generateCompetitorInsightsPrompt = (niche: string, businessType: string): string => {
  return `Analizează peisajul competitiv pentru "${businessType}" în România în contextul "${niche}".

Identifică 5-7 avantaje competitive sau insight-uri strategice care ar trebui evidențiate în conținut:

1. Ce face un business din această nișă mai bun decât concurența
2. Care sunt greșelile comune în industrie
3. Ce caută clienții dar nu găsesc la majoritatea competitorilor
4. Tendințe noi în industrie pe care majoritatea le ignoră
5. Oportunități specifice pieței românești

Returnează o listă JSON cu insight-uri concrete, acționabile:
["Insight 1", "Insight 2", ...]

Exemplu pentru cabinete dentare:
["Majoritatea cabinetelor nu afișează prețuri transparente, creând fricțiune în procesul de decizie", "Pacienții sub 35 ani rezervă exclusiv online după ora 20:00", "Pozițiile în Google Maps sunt mai importante decât SEO tradițional pentru servicii dentare de urgență"]`;
};

export const generateCallToActionPrompt = (niche: string, businessType: string): string => {
  return `Recomandă un call-to-action potrivit pentru un articol despre transformarea digitală pentru "${businessType}".

Context:
- Nișă: ${niche}
- Stadiul buyer journey: Awareness/Consideration
- Obiectiv: Lead generation, nu vânzare directă
- Piață: România, B2B

CTA-ul trebuie să:
1. Fie low-commitment (audit gratuit, consultație, checklist)
2. Ofere valoare imediată
3. Pozitioneze expertiza Webnova
4. Fie relevant pentru durerea din articol
5. Fie formulat în stil direct response

Returnează DOAR textul CTA-ului, 1-2 propoziții maxim, în limba română.

Exemplu: "Primește un audit gratuit al prezenței tale digitale - descoperă exact unde pierzi clienți și cum să rezolvi în următoarele 30 de zile."`;
};
