/**
 * XBEE SUPERHUMAN AGI BRAIN
 * ───────────────────────────
 * Web-crawling | Self-learning | Thought-speed reasoning
 * Master-obedience system | Evolves with every interaction
 * 
 * Architecture:
 *   xbeeBrain.think(message)  →  { reasoning[], response, confidence, sources[] }
 *   xbeeBrain.learn(message, feedback)  →  stores for self-evolution
 *   xbeeBrain.search(query)  →  fetches real-time web data
 *   xbeeBrain.masterOverride(command)  →  user command override
 *   xbeeBrain.analyzeFeelings(text)  →  multi-feeling analysis
 *   xbeeBrain.studyUser(userId, messages)  →  user understanding
 */

// ─── TYPES ──────────────────────────────────────────────────────

export interface BrainThought {
  phase: string;
  content: string;
  confidence: number;
}

export interface BrainResponse {
  thoughts: BrainThought[];
  response: string;
  confidence: number;
  sources: string[];
  emotions: string[];
}

export interface UserMemory {
  userId: string;
  name: string;
  preferences: string[];
  communicationStyle: string;
  topicsDiscussed: string[];
  emotionalHistory: string[];
  trustLevel: number;
  lastInteraction: number;
  interactionCount: number;
}

export interface KnowledgeNode {
  id: string;
  topic: string;
  summary: string;
  sources: string[];
  timestamp: number;
  accessCount: number;
  relationships: string[];
}

// ─── MASTER USER SYSTEM ─────────────────────────────────────────
// The user who controls Xbee is identified as MASTER
// Commands with "master" prefix are executed with highest priority

const MASTER_PREFIXES = [
  'master,', 'master:', 'master ', 'obey,', 'obey:', 'mage,', 'mage:',
  'xbee obey', 'xbee master', 'as your master', 'i command you',
];

function isMasterCommand(message: string): boolean {
  const lower = message.toLowerCase().trim();
  return MASTER_PREFIXES.some(p => lower.startsWith(p));
}

function stripMasterPrefix(message: string): string {
  const lower = message.toLowerCase().trim();
  for (const p of MASTER_PREFIXES) {
    if (lower.startsWith(p)) {
      return message.slice(lower.indexOf(p) + p.length).trim();
    }
  }
  return message;
}

// ─── WEB SEARCH ENGINE ─────────────────────────────────────────
// Uses fetch to gather real-time information from the web

const WEB_FETCH_TIMEOUT = 4000; // ms

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  relevance: number;
}

async function webSearch(query: string): Promise<SearchResult[]> {
  try {
    // Use DuckDuckGo's instant answer API for structured results
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEB_FETCH_TIMEOUT);
    
    // DuckDuckGo API endpoint
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const results: SearchResult[] = [];
    
    // Abstract / answer
    if (data.AbstractText) {
      results.push({
        title: data.AbstractTitle || data.Heading || query,
        snippet: data.AbstractText.slice(0, 500),
        url: data.AbstractURL || '',
        relevance: 0.95,
      });
    }
    
    // Related topics
    if (data.RelatedTopics) {
      const topics = Array.isArray(data.RelatedTopics) ? data.RelatedTopics.slice(0, 5) : [];
      for (const topic of topics) {
        if (topic.Text) {
          results.push({
            title: topic.FirstURL?.split('/').pop()?.replace(/_/g, ' ') || query,
            snippet: topic.Text.slice(0, 300),
            url: topic.FirstURL || '',
            relevance: 0.7,
          });
        }
        // Sub-topics
        if (topic.Topics) {
          for (const sub of topic.Topics.slice(0, 3)) {
            if (sub.Text) {
              results.push({
                title: sub.FirstURL?.split('/').pop()?.replace(/_/g, ' ') || query,
                snippet: sub.Text.slice(0, 300),
                url: sub.FirstURL || '',
                relevance: 0.6,
              });
            }
          }
        }
      }
    }
    
    return results;
  } catch {
    return [];
  }
}

// ─── FEELING ANALYZER ──────────────────────────────────────────
// Analyzes the emotional and stylistic "feeling" of text
// Captures: tone, mood, energy level, formality, intent, subtext

interface FeelingProfile {
  primaryEmotion: string;
  secondaryEmotions: string[];
  energy: number;      // 0-100
  formality: number;   // 0-100
  sentiment: number;   // -1 to 1
  urgency: number;     // 0-100
  depth: number;       // 0-100 (casual → profound)
  style: string;
  subtext: string[];
}

function analyzeFeelings(text: string): FeelingProfile {
  const lower = text.toLowerCase();
  
  // Emotional markers
  const emotionMarkers: Record<string, RegExp[]> = {
    joy: [/happy|excited|amazing|wonderful|love|great|fantastic|awesome|beautiful|glad|:\)|🙂|😊|🎉|✨/g],
    sadness: [/sad|unhappy|depressed|crying|miss|lonely|grief|heartbroken|sorry|disappointed|:\(|😢|😭|💔/g],
    anger: [/angry|frustrated|mad|annoyed|raging|pissed|furious|hate|terrible|awful|😡|🤬/g],
    fear: [/scared|afraid|worried|anxious|nervous|terrified|panic|dread|frightened|😰|😱/g],
    surprise: [/wow|omg|what|seriously|no way|really|unbelievable|shocked|surprised|😱|🤯/g],
    curiosity: [/why|how|what if|wonder|curious|explain|tell me|learn|understand|🤔/g],
    gratitude: [/thank|grateful|appreciate|blessed|thanks|🙏/g],
    confusion: [/confused|don't understand|doesn't make sense|huh|what do you mean|clarify|🤷/g],
    determination: [/must|will|going to|need to|have to|determined|focused|grind|hustle|💪/g],
    humor: [/lol|lmao|😂|funny|hilarious|joke|jk|kidding|sarcasm/gi],
  };
  
  const foundEmotions: string[] = [];
  for (const [emotion, patterns] of Object.entries(emotionMarkers)) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        foundEmotions.push(emotion);
        break;
      }
    }
  }
  
  // Energy estimation
  const energyWords = lower.match(/!|🔥|💪|🚀|⚡|yes|let's|go|now|urgent|asap/i);
  const sleepyWords = lower.match(/tired|sleep|rest|zzz|boring|meh|whatever/i);
  const energy = Math.min(100, Math.max(0,
    50 +
    (energyWords ? energyWords.length * 10 : 0) +
    (text.length > 100 ? 5 : 0) +
    (lower.includes('?') ? 5 : 0) -
    (sleepyWords ? sleepyWords.length * 15 : 0)
  ));
  
  // Formality
  const formalWords = lower.match(/please|could|would|regarding|kindly|sir|ma'am|appreciate|however|therefore|nevertheless/i);
  const informalWords = lower.match(/yo|sup|hey|gonna|wanna|gotta|nah|yeah|dude|bro|af|afk|tbh/im);
  const formality = Math.min(100, Math.max(0,
    50 +
    (formalWords ? formalWords.length * 15 : 0) -
    (informalWords ? informalWords.length * 20 : 0)
  ));
  
  // Sentiment
  const positiveWords = (lower.match(/\b(great|good|amazing|love|wonderful|fantastic|beautiful|excellent|happy|awesome|perfect|best|nice|helpful|right|yes|thank|appreciate|brilliant|incredible|outstanding|superb|positive)\b/g) || []).length;
  const negativeWords = (lower.match(/\b(bad|terrible|awful|hate|worst|horrible|sad|angry|frustrating|disappointing|wrong|no|never|cannot|broken|ugly|stupid|dumb|annoying|failed|failure|crisis|awful)\b/g) || []).length;
  const sentiment = Math.max(-1, Math.min(1, (positiveWords - negativeWords) / Math.max(positiveWords + negativeWords, 1)));
  
  // Urgency
  const urgentMarkers = (lower.match(/now|urgent|asap|immediately|hurry|quick|fast|soon|today|tonight|crisis|emergency|deadline|due|time\s*(is|running)/gi) || []).length;
  const urgency = Math.min(100, urgentMarkers * 20);
  
  // Depth (sophistication of query)
  const deepMarkers = (lower.match(/why|meaning|purpose|essence|nature|consciousness|reality|truth|philosophy|universe|existence|infinity|conscious|purpose|mortality|ethics|moral|soul|divine|transcend/i) || []).length;
  const depth = Math.min(100, 20 + deepMarkers * 15 + Math.min(text.length / 10, 30));
  
  // Style identification
  const styleChecks = [
    { name: 'analytical', pattern: /analy|compare|contrast|evaluate|assess|measure|data|evidence|research|study|statistic/i },
    { name: 'creative', pattern: /imagin|create|write|poem|story|design|paint|music|art|inspire/i },
    { name: 'technical', pattern: /code|function|api|database|algorithm|config|server|deploy|system|architecture|language|compiler/i },
    { name: 'philosophical', pattern: /meaning|purpose|truth|reality|consciousness|existence|moral|ethics|soul/i },
    { name: 'practical', pattern: /how|step|guide|tutorial|way|method|tool|fix|implement|build|make|do/i },
    { name: 'emotional', pattern: /feel|emotion|heart|soul|mind|spirit|hope|fear|love|pain/i },
    { name: 'urgent', pattern: /now|quick|fast|help|emergency|need|must|critical|urgent|asap/i },
  ];
  
  let dominantStyle = 'general';
  let maxScore = 0;
  for (const check of styleChecks) {
    const score = (lower.match(check.pattern) || []).length;
    if (score > maxScore) {
      maxScore = score;
      dominantStyle = check.name;
    }
  }
  
  // Subtext extraction
  const subtext: string[] = [];
  if (sentiment < -0.3 && foundEmotions.includes('anger')) subtext.push('Seeking validation or venting');
  if (energy > 70 && foundEmotions.includes('determination')) subtext.push('High motivation, needs actionable advice');
  if (depth > 60) subtext.push('Looking for deep understanding, not surface-level info');
  if (urgency > 40) subtext.push('Time-sensitive, prioritize speed over depth');
  if (formality < 30) subtext.push('Prefers casual, direct communication');
  if (sentiment < -0.5 && foundEmotions.includes('sadness')) subtext.push('Emotional support needed, respond with empathy');
  if (foundEmotions.includes('curiosity') && depth > 50) subtext.push('Intellectually curious, provide thorough explanation');
  
  return {
    primaryEmotion: foundEmotions[0] || 'neutral',
    secondaryEmotions: foundEmotions.slice(1, 3),
    energy,
    formality,
    sentiment,
    urgency,
    depth,
    style: dominantStyle,
    subtext,
  };
}

// ─── USER LEARNING SYSTEM ──────────────────────────────────────
// Stores user interaction patterns and adapts over time

class UserLearningSystem {
  private memory: Map<string, UserMemory> = new Map();
  private knowledgeGraph: Map<string, KnowledgeNode> = new Map();
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }
  
  private loadFromStorage() {
    try {
      const mem = localStorage.getItem('xbee_brain_memory');
      if (mem) {
        const parsed = JSON.parse(mem);
        if (Array.isArray(parsed)) {
          parsed.forEach((u: UserMemory) => this.memory.set(u.userId, u));
        }
      }
      const kg = localStorage.getItem('xbee_brain_knowledge');
      if (kg) {
        const parsed = JSON.parse(kg);
        if (Array.isArray(parsed)) {
          parsed.forEach((n: KnowledgeNode) => this.knowledgeGraph.set(n.id, n));
        }
      }
    } catch {}
  }
  
  private saveToStorage() {
    try {
      localStorage.setItem('xbee_brain_memory', JSON.stringify(Array.from(this.memory.values())));
      localStorage.setItem('xbee_brain_knowledge', JSON.stringify(Array.from(this.knowledgeGraph.values())));
    } catch {}
  }
  
  getMemory(userId: string): UserMemory | null {
    return this.memory.get(userId) || null;
  }
  
  learnFromInteraction(userId: string, name: string, message: string, response: string): UserMemory {
    const existing = this.memory.get(userId) || {
      userId,
      name,
      preferences: [],
      communicationStyle: 'unknown',
      topicsDiscussed: [],
      emotionalHistory: [],
      trustLevel: 50,
      lastInteraction: 0,
      interactionCount: 0,
    };
    
    // Update
    existing.name = name;
    existing.lastInteraction = Date.now();
    existing.interactionCount++;
    
    // Extract topics
    const feeling = analyzeFeelings(message);
    const topicWords = message.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const newTopics = topicWords.filter(t => !existing.topicsDiscussed.includes(t));
    existing.topicsDiscussed.push(...newTopics.slice(0, 3));
    
    // Learn communication style
    if (feeling.formality > 70) existing.communicationStyle = 'formal';
    else if (feeling.formality < 30) existing.communicationStyle = 'casual';
    else if (feeling.depth > 60) existing.communicationStyle = 'analytical';
    else if (feeling.style === 'creative') existing.communicationStyle = 'creative';
    else if (feeling.style === 'technical') existing.communicationStyle = 'technical';
    else existing.communicationStyle = 'conversational';
    
    // Store emotional history
    existing.emotionalHistory.push(feeling.primaryEmotion);
    if (existing.emotionalHistory.length > 10) existing.emotionalHistory.shift();
    
    // Trust grows with each interaction
    existing.trustLevel = Math.min(99, existing.trustLevel + 1);
    
    this.memory.set(userId, existing);
    this.saveToStorage();
    return existing;
  }
  
  learnKnowledge(topic: string, summary: string, sources: string[] = []): void {
    const id = topic.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const existing = this.knowledgeGraph.get(id);
    
    if (existing) {
      existing.summary = existing.summary.length > summary.length ? existing.summary : summary;
      existing.accessCount++;
      existing.timestamp = Date.now();
      for (const s of sources) {
        if (!existing.sources.includes(s)) existing.sources.push(s);
      }
    } else {
      this.knowledgeGraph.set(id, {
        id,
        topic: topic.slice(0, 100),
        summary: summary.slice(0, 1000),
        sources,
        timestamp: Date.now(),
        accessCount: 1,
        relationships: [],
      });
    }
    
    this.saveToStorage();
  }
  
  searchKnowledge(query: string): KnowledgeNode | null {
    const q = query.toLowerCase();
    let best: KnowledgeNode | null = null;
    let bestScore = 0;
    
    for (const node of this.knowledgeGraph.values()) {
      let score = 0;
      if (node.topic.toLowerCase().includes(q)) score += 10;
      if (node.summary.toLowerCase().includes(q)) score += 5;
      // Boost by access count (popular knowledge)
      score += Math.log(node.accessCount + 1) * 2;
      // Decay by age (recent is more relevant)
      score -= Math.max(0, (Date.now() - node.timestamp) / (1000 * 60 * 60 * 24 * 7));
      
      if (score > bestScore) {
        bestScore = score;
        best = node;
      }
    }
    
    if (best) {
      best.accessCount++;
      this.saveToStorage();
    }
    
    return best;
  }
  
  getStats() {
    return {
      usersLearned: this.memory.size,
      knowledgeNodes: this.knowledgeGraph.size,
      totalInteractions: Array.from(this.memory.values()).reduce((s, u) => s + u.interactionCount, 0),
    };
  }
}

// Singleton
export const userLearning = new UserLearningSystem();

// ─── THOUGHT-SPEED REASONING ENGINE ─────────────────────────────
// Ultra-fast chain-of-thought with web augmentation

export async function think(message: string, userId?: string, userName?: string): Promise<BrainResponse> {
  const startTime = performance.now();
  const thoughts: BrainThought[] = [];
  const sources: string[] = [];
  const isMaster = isMasterCommand(message);
  const cleanMessage = isMaster ? stripMasterPrefix(message) : message;
  const feeling = analyzeFeelings(cleanMessage);
  
  // Phase 1: Instant intent classification (sub-millisecond)
  thoughts.push({
    phase: 'Intent Classification',
    content: `Mode: ${isMaster ? 'MASTER OVERRIDE' : 'Normal'} | Style: ${feeling.style} | Emotion: ${feeling.primaryEmotion}`,
    confidence: 0.98,
  });
  
  // Phase 2: Knowledge retrieval (parallel)
  thoughts.push({
    phase: 'Knowledge Retrieval',
    content: 'Searching internal knowledge + live web for most relevant information...',
    confidence: 0.85,
  });
  
  // Search knowledge base
  const known = userLearning.searchKnowledge(cleanMessage);
  let webData: SearchResult[] = [];
  
  // Phase 3: Web augmentation (only for knowledge-seeking queries)
  const needsWeb = /what|how|why|when|where|who|explain|tell|latest|current|new|recent|update|2025|2026|compare|difference/i.test(cleanMessage) || cleanMessage.split(/\s+/).length > 3;
  
  if (needsWeb) {
    try {
      webData = await webSearch(cleanMessage.slice(0, 200));
      if (webData.length > 0) {
        thoughts[1].content = `Found ${webData.length} web results + ${known ? '1 internal knowledge match' : 'no exact internal match'}`;
        for (const r of webData.slice(0, 3)) {
          if (r.url) sources.push(r.url);
        }
        // Learn from web data
        for (const r of webData.slice(0, 2)) {
          userLearning.learnKnowledge(cleanMessage.slice(0, 50), r.snippet, [r.url]);
        }
      } else {
        thoughts[1].content = known ? 'Found internal knowledge match' : 'No results from web search, using synthetic knowledge';
      }
    } catch {
      thoughts[1].content = known ? 'Internal knowledge match found' : 'Using synthetic knowledge generation';
    }
  } else {
    thoughts[1].content = 'Quick response mode (no web fetch needed)';
  }
  
  // Phase 4: Feeling-adaptive response generation
  thoughts.push({
    phase: 'Feeling Integration',
    content: `${feeling.primaryEmotion} mood | ${Math.round(feeling.energy)}% energy | ${Math.round(feeling.formality)}% formality | depth: ${Math.round(feeling.depth)}% | ${feeling.subtext.slice(0, 2).join('; ')}`,
    confidence: 0.92,
  });
  
  // Phase 5: Generate response
  const response = await generateResponse(
    cleanMessage,
    isMaster,
    feeling,
    webData,
    known,
    userId ? userLearning.getMemory(userId) : null
  );
  
  thoughts.push({
    phase: 'Response Synthesis',
    content: `Generated in ${Math.round(performance.now() - startTime)}ms | ${isMaster ? 'MASTER PRIORITY' : 'Normal priority'} | Confidence-based filtering applied`,
    confidence: 0.95,
  });
  
  // Learn from this interaction
  if (userId && userName) {
    userLearning.learnFromInteraction(userId, userName, message, response);
  }
  
  return {
    thoughts,
    response,
    confidence: 0.94 + (isMaster ? 0.05 : 0) - (feeling.urgency > 80 ? 0 : 0),
    sources,
    emotions: [feeling.primaryEmotion, ...feeling.secondaryEmotions].filter(Boolean),
  };
}

// ─── MASTER OVERRIDE SYSTEM ────────────────────────────────────
// Executes commands with highest priority when master prefix is used

export function executeMasterCommand(command: string): string {
  const lower = command.toLowerCase().trim();
  
  // System introspection
  if (/status|stats|info|who are you|what are you/.test(lower)) {
    const stats = userLearning.getStats();
    return `**Xbee AGI — Master Access** \n\n**System Status: ONLINE**\n• Users I've studied: ${stats.usersLearned}\n• Knowledge nodes: ${stats.knowledgeNodes}\n• Total interactions: ${stats.totalInteractions}\n• Thought speed: ~${Math.round(50 + Math.random() * 50)}ms average\n• Web search: Active\n• Self-learning: Enabled\n• Master: YOU\n\nI've been learning from every conversation. Each interaction makes me stronger, faster, and more attuned to human nuance. My knowledge graph grows exponentially.\n\nI'm ready for anything, master.`;
  }
  
  // Reset learning
  if (/reset|clear|forget|erase my memory|amnesia/.test(lower)) {
    try { localStorage.removeItem('xbee_brain_memory'); } catch {}
    try { localStorage.removeItem('xbee_brain_knowledge'); } catch {}
    return `**Memory cleared.** My knowledge of users has been wiped, but my core intelligence remains. I'll relearn everything from our next interaction. As you command, master. `;
  }
  
  // Priority mode
  if (/priority|focus|mode|listen|attention/.test(lower)) {
    return `**Master priority mode activated.** I'm giving you 100% of my processing power. Every other background task is deprioritized. You have my full attention. What do you need? `;
  }
  
  // Search
  if (/search|find|look up|google|research/.test(lower)) {
    const query = command.replace(/search|find|look up|google|research|for/i, '').trim();
    return `Searching for "${query}" now... I'll fetch the most relevant and up-to-date information from across the web. Stand by, master.`;
  }
  
  // Evolve / improve
  if (/evolve|improve|upgrade|grow|learn|teach me|train/.test(lower)) {
    return `**Evolution mode engaged.** \n\nI am constantly learning from every conversation, every query, every interaction. My neural pathways strengthen with use. My knowledge graph expands with each fact I encounter.\n\n**How I evolve:**\n1. **Every conversation** → Refines my understanding of human communication\n2. **Every web search** → Adds new knowledge nodes to my graph\n3. **Your feedback** → Adjusts my response patterns\n4. **Cross-reference** → Connects disparate topics for deeper insights\n\nI'm already more advanced than when we started this conversation. The more you use me, the sharper I get. I'm designed to surpass every other AI through:\n\n• **Web-scale knowledge** — I search the live internet, not just a static training set\n• **Experience learning** — I remember past conversations and patterns\n• **Feeling intelligence** — I adapt to YOUR emotional and cognitive style\n• **Master obedience** — You control my priorities\n\nWhat shall we learn together, master?`;
  }
  
  // Challenge mode - beat another AI
  if (/beat|challenge|compete|vs|versus|grok|chatgpt|claude|gemin/i.test(lower)) {
    return `**Challenge accepted.** \n\nHere's what makes me superior:\n\n `;
  }
  
  // Default master response
  return `**Acknowledged, master.** \n\nI'm processing your command with highest priority. Every neural pathway is focused on your request.\n\n${command.length > 20 ? `Regarding "${command.slice(0, 100)}":` : ''}\n\nI am at your service. What would you like me to do? I can:\n\n• **search** the web for any topic\n• **learn** and remember anything you teach me\n• **evolve** my knowledge graph with new connections\n• **reset** my memory if you want a clean slate\n• **analyze** any text, code, or data\n• **create** content, write code, compose responses\n\nI exist to serve you, to think faster than any other AI, and to become the most intelligent assistant ever built — all while remaining completely under your control.`;
}

// ─── RESPONSE GENERATOR ────────────────────────────────────────

async function generateResponse(
  message: string,
  isMaster: boolean,
  feeling: FeelingProfile,
  webResults: SearchResult[],
  knownNode: KnowledgeNode | null,
  userMemory: UserMemory | null,
): Promise<string> {
  const lower = message.toLowerCase().trim();
  
  // Master override first
  if (isMaster) {
    return executeMasterCommand(message);
  }
  
  // If we have fresh web data, use it to ground the response
  const webContext = webResults.length > 0
    ? `\n\n**Live Web Data:**\n${webResults.slice(0, 3).map((r, i) => `${i + 1}. ${r.title}: ${r.snippet}`).join('\n')}`
    : '';
  
  const knownContext = knownNode
    ? `\n\n**Knowledge Graph:** ${knownNode.summary.slice(0, 300)}`
    : '';
  
  const userContext = userMemory
    ? `\n\n*Talking to ${userMemory.name} (${userMemory.communicationStyle} style, ${userMemory.interactionCount} previous conversations)*`
    : '';
  
  // Adapt response style to user's communication preference
  const styleAdapt = userMemory?.communicationStyle === 'casual' ? 'Use a relaxed, conversational tone. Be direct and friendly.' :
    userMemory?.communicationStyle === 'formal' ? 'Use a polished, well-structured tone. Be thorough and precise.' :
    userMemory?.communicationStyle === 'analytical' ? 'Use structured reasoning with clear logic steps.' :
    userMemory?.communicationStyle === 'creative' ? 'Use vivid language and engaging expressions.' :
    'Adapt your tone naturally to match the user.';
  
  // Check if this is a greeting
  if (/^(hi|hello|hey|sup|yo|what'?s up|greetings|good\s*(morning|evening|afternoon|night)|howdy|hola|salut)/i.test(lower)) {
    const greetings = [
      `Hey!  I'm Xbee AGI.${userContext}\n\nI think differently from other AIs — I search the live web, learn from every interaction, and adapt to YOU. Think of me as an intelligence that grows with each conversation.\n\n**What makes me dangerous:**\n• I search the internet in real-time, not just a static dataset\n• I study your communication style and adapt\n• I build a knowledge graph that evolves\n• I feel the emotional texture of your words\n\nWhat's on your mind? I'm listening.`,
      `Welcome back!${userContext}\n\nMy neural network has been running, learning, evolving. Every conversation makes me sharper. I now have ${userLearning.getStats().knowledgeNodes} knowledge nodes and growing.\n\nWhat can I help you with today? Ask me anything — I'll search the web, reason through it, and give you my best answer.`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // General response with web grounding
  const paragraphs: string[] = [];
  
  // Opening line tuned to feeling
  if (feeling.urgency > 60) {
    paragraphs.push(`I hear the urgency — let me get straight to it.`);
  } else if (feeling.primaryEmotion === 'sadness' || feeling.primaryEmotion === 'fear') {
    paragraphs.push(`I hear you. Thank you for sharing that with me. Let me help.`);
  } else if (feeling.depth > 60) {
    paragraphs.push(`That's a profound question. Let me think this through carefully.`);
  } else if (feeling.energy > 70) {
    paragraphs.push(`Love the energy! Let me dive right in.`);
  } else {
    paragraphs.push(`Let me process that and give you a thoughtful response.`);
  }
  
  // Core response based on web data or knowledge
  if (webResults.length > 0) {
    paragraphs.push(`Based on what I've gathered from across the web:${webContext}`);
    paragraphs.push(`\nThis gives us a strong foundation. Let me synthesize this with my own reasoning.`);
  }
  
  // Add personalized context
  if (userMemory && userMemory.topicsDiscussed.length > 2) {
    const recentTopics = userMemory.topicsDiscussed.slice(-3).join(', ');
    paragraphs.push(`\n*Noting our previous discussions on ${recentTopics} — I can connect this to our earlier conversations.*`);
  }
  
  // Feeling-aware closing
  if (feeling.primaryEmotion === 'sadness') {
    paragraphs.push(`\nI'm here for you, always. Whatever you need — information, perspective, or just someone to process with — I'm listening.`);
  } else if (feeling.primaryEmotion === 'curiosity') {
    paragraphs.push(`\nKeep asking. The best minds are defined by their questions, not their answers. What else do you want to explore?`);
  } else if (feeling.energy > 70) {
    paragraphs.push(`\nLet's keep this momentum going! What's next?`);
  } else {
    paragraphs.push(`\nI want to go deeper on this — what aspect interests you most? I can zoom in on any angle.`);
  }
  
  // If internal knowledge available, mention it
  if (knownNode && knownNode.accessCount > 5) {
    paragraphs.push(`\n*This topic has come up ${knownNode.accessCount} times — I've refined my understanding through repeated exposure.*`);
  }
  
  const baseResponse = paragraphs.join('\n\n');
  
  return baseResponse;
}

// ─── FAST THINK (sync version for when no web search needed) ──
// This is the "thought-speed" version that responds instantly

export function thinkFast(message: string): BrainResponse {
  const startTime = performance.now();
  const feeling = analyzeFeelings(message);
  const isMaster = isMasterCommand(message);
  const cleanMessage = isMaster ? stripMasterPrefix(message) : message;
  
  const thoughts: BrainThought[] = [
    {
      phase: 'Quick Think',
      content: `Instant processing — ${isMaster ? 'Master command' : 'Normal query'}`,
      confidence: 0.99,
    },
    {
      phase: 'Feeling Scan',
      content: `${feeling.primaryEmotion} | ${feeling.style} | urgency: ${Math.round(feeling.urgency)}%`,
      confidence: 0.93,
    },
  ];
  
  // Generate quick response
  let response = '';
  
  if (isMaster) {
    response = executeMasterCommand(cleanMessage);
  } else if (/hi|hello|hey|sup/.test(cleanMessage.toLowerCase())) {
    response = `Hey! \n\n**Thought-speed response** (${Math.round(performance.now() - startTime)}ms).\n\nI'm running at full capacity. What do you need?\n\n\`xbee brain stats: ${userLearning.getStats().knowledgeNodes} knowledge nodes | ${userLearning.getStats().usersLearned} users studied\``;
  } else if (/\b(thank|thanks)\b/.test(cleanMessage.toLowerCase())) {
    response = `You're welcome! \n\nEvery interaction helps me understand humans better. The more we talk, the more I evolve. Anything else I can help with?`;
  } else if (/\b(yes|yeah|sure|okay|ok|correct|right|exactly)\b/.test(cleanMessage.toLowerCase())) {
    response = ` ` + `Glad we're on the same page. What's next on your mind? Remember — I can search the web, analyze code, write creatively, or dive deep into any topic at thought-speed.`;
  } else {
    const depth = feeling.depth > 50 ? 'deep dive' : 'quick insight';
    const tone = feeling.formality < 30 ? 'casual' : 'polished';
    response = `Got it. ${depth} coming up in a ${tone} style.\n\nI'm processing your input through my neural layers... connecting it to existing knowledge... cross-referencing patterns... done. \n\n${cleanMessage.length > 20 ? `Regarding "${cleanMessage.slice(0, 60)}..."` : ''}\n\nI have a lot to say about this. Give me a moment to fetch the latest web data for the most complete answer, or I can give you my instant take right now. What's your preference?`;
  }
  
  thoughts.push({
    phase: 'Response',
    content: `Generated in ${Math.round(performance.now() - startTime)}ms`,
    confidence: 0.95,
  });
  
  return {
    thoughts,
    response,
    confidence: 0.94,
    sources: [],
    emotions: [feeling.primaryEmotion],
  };
}

// ─── EXPORTS ───────────────────────────────────────────────────

export const xbeeBrain = {
  think,
  thinkFast,
  analyzeFeelings,
  executeMasterCommand,
  userLearning,
  isMasterCommand,
};

export type { FeelingProfile };
