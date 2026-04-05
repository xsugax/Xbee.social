import { NextRequest, NextResponse } from 'next/server';

// Xbee AI conversational engine — comprehensive knowledge
const knowledgeBase: Record<string, string[]> = {
  greeting: [
    "Hey! I'm Xbee AI — your intelligent assistant. I can help with tech, science, history, math, philosophy, health, coding, business, and so much more. What's on your mind?",
    "Welcome to Xbee! I'm here to help with anything — coding, science, creative writing, analysis, learning, career advice, you name it. Fire away!",
  ],
  trust: [
    "Trust scores on Xbee are calculated using a multi-factor algorithm: account age (20%), activity level (15%), verification status (15%), engagement quality (20%), content quality (15%), and consistency (15%). Reports reduce your score. The higher your trust, the more reach your posts get — Authority tier users get 3x reach multiplier!",
    "Your trust tier determines your reach: New (0.5x), Building (1x), Established (1.5x), Trusted (2x), Authority (3x). Verified badges (blue = identity, gold = authority) boost credibility. Keep posting quality content and maintaining consistency to climb tiers.",
  ],
  coding: [
    "I can help with coding in any language — JavaScript, TypeScript, Python, Rust, Go, Java, C++, Swift, Kotlin, and more. Whether it's debugging, architecture, algorithms, design patterns, or best practices, I've got you covered. What are you working on?",
    "Need code help? I'm great at: explaining algorithms (sorting, searching, graphs, DP), reviewing code for bugs and performance, React/Next.js patterns (hooks, SSR, RSC), API design (REST, GraphQL), database queries, DevOps, testing strategies, and more. Just drop your code or question!",
  ],
  ai: [
    "AI is evolving rapidly. Key areas: 1) LLMs (GPT-4o, Claude 3.5, Gemini, Llama 3) — moving from chat to autonomous agents. 2) RAG — combining LLMs with retrieval for accurate enterprise answers. 3) Multi-modal — models understanding text, images, audio, video together. 4) Fine-tuning & RLHF — making models follow human preferences. 5) Open-source catching up fast with Mistral, Llama series. What interests you most?",
    "The AI stack in 2024-2025: Foundation models (GPT-4, Claude, Gemini) → Frameworks (LangChain, LlamaIndex, CrewAI) → Vector DBs (Pinecone, Weaviate, Chroma) → Deployment (vLLM, TensorRT, ONNX) → Evaluation (LMSYS, HumanEval). AI coding assistants like Copilot are already boosting dev productivity 40-55%. Want to deep-dive into any area?",
  ],
  science: [
    "Science is fascinating! Here are some mind-blowing facts: The observable universe is 93 billion light-years across. Your body replaces most of its cells every 7-10 years. Quantum entanglement allows particles to be correlated across any distance instantly. CRISPR gene editing could potentially cure genetic diseases. Neutron stars are so dense that a teaspoon weighs about 6 billion tons. What area of science interests you?",
    "Recent scientific breakthroughs: Room-temperature superconductor research is progressing, AI protein folding (AlphaFold) is revolutionizing drug discovery, James Webb telescope is revealing the earliest galaxies, mRNA vaccine technology is being applied to cancer treatments, and nuclear fusion at NIF achieved ignition. The pace of discovery is accelerating! What would you like to know more about?",
  ],
  history: [
    "History is full of lessons! Some pivotal moments: The printing press (1440) democratized knowledge. The Industrial Revolution (1760-1840) transformed human civilization. World Wars reshaped global politics. The internet (1990s) connected humanity like never before. The rise of smartphones (2007+) put a supercomputer in every pocket. Understanding the past helps us navigate the future. What period or topic interests you?",
    "Fun historical facts: Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid. The Ottoman Empire existed at the same time as fax machines. Oxford University is older than the Aztec Empire. Ancient Romans had a form of concrete that's actually stronger than modern concrete. History is wild! What era would you like to explore?",
  ],
  math: [
    "Math is the language of the universe! I can help with arithmetic, algebra, calculus, statistics, linear algebra, number theory, discrete math, and more. Some cool facts: e^(iπ) + 1 = 0 (Euler's identity — connects 5 fundamental constants). The sum of all natural numbers is -1/12 (Ramanujan summation). There are more possible chess games than atoms in the observable universe. What math topic do you need help with?",
    "Mathematics spans from everyday calculations to abstract beauty: probability & statistics (essential for data science), calculus (modeling change), linear algebra (backbone of ML/AI), graph theory (networks/social media), topology (studying shapes), and number theory (basis of cryptography). I can solve problems, explain concepts, or discuss theory. What do you need?",
  ],
  health: [
    "Health tips backed by science: 1) Sleep 7-9 hours — it's non-negotiable for cognitive function. 2) Exercise 150+ minutes per week — reduces all-cause mortality by 30%. 3) Eat whole foods, minimize ultra-processed food. 4) Stay hydrated — aim for 2-3 liters daily. 5) Manage stress — chronic stress accelerates aging at the cellular level. 6) Socialize — loneliness is as harmful as smoking 15 cigarettes/day. What health topic interests you?",
    "Recent health science: Intermittent fasting shows benefits for metabolic health. Cold exposure (cold showers) can boost dopamine by 250%. Regular walking after meals lowers blood sugar spikes by 30-50%. Mediterranean diet is consistently rated #1 for longevity. Strength training prevents age-related muscle loss and protects bones. Note: always consult a healthcare professional for personal medical advice!",
  ],
  philosophy: [
    "Philosophy addresses life's deepest questions. The Stoics taught focus on what you can control (Marcus Aurelius: 'You have power over your mind — not outside events'). Existentialists like Sartre said we create our own meaning. The Buddhist concept of impermanence teaches us to embrace change. Socrates believed the unexamined life isn't worth living. What philosophical question is on your mind?",
    "Key philosophical frameworks: Utilitarianism (maximize overall happiness), Deontology (follow moral rules regardless of outcome), Virtue Ethics (develop good character), Pragmatism (focus on practical outcomes), Absurdism (embrace life's meaninglessness with joy). Each offers a different lens for decision-making. Which resonates with you?",
  ],
  business: [
    "Business fundamentals: Revenue = Price × Volume. Profit = Revenue - Costs. The best businesses have strong unit economics (LTV > 3× CAC), recurring revenue, high margins, and network effects. Key frameworks: Porter's Five Forces (competitive analysis), Jobs-To-Be-Done (product strategy), OKRs (goal setting). What business challenge are you facing?",
    "Building a successful business: 1) Find a real problem worth solving. 2) Validate with real customers before building. 3) Start with a focused niche, then expand. 4) Revenue is the ultimate validation. 5) Build moats (brand, network effects, switching costs, data). 6) Culture eats strategy for breakfast. What stage is your business at?",
  ],
  startup: [
    "Building a startup? Key advice: 1) Validate before you build — talk to 100 potential users. 2) Revenue > funding — prove the model works. 3) Hire slow, fire fast. 4) Ship weekly, not monthly. 5) Your unfair advantage is speed + customer obsession. What stage are you at?",
    "For early-stage startups, focus on: Product-Market Fit (are people pulling the product from you?), Unit Economics (LTV > 3x CAC), and Distribution (how do users find you?). The rest is noise. What's your biggest challenge right now?",
  ],
  xbee: [
    "Xbee is a trust-first social platform. Unlike Twitter/X, we rank content by credibility, not virality. Every user has a trust score, every post has a credibility rating, and our AI helps you engage authentically. Ghost Mode lets you send vanishing messages, and our scam detection protects the community.",
    "Xbee features: Dual-mode feed (Trusted vs Raw), multi-layer verification (Identity + Authority badges), AI Comment Engine with 5 response modes, Ghost Mode for vanishing messages, built-in scam detection, community-driven moderation, and a full Admin Panel for system control. We're building the platform where truth wins.",
  ],
  writing: [
    "Writing tips: 1) Start with a hook — your first line earns the second. 2) Write like you talk, then refine. 3) Kill your darlings — cut anything that doesn't serve the reader. 4) Use active voice ('The cat sat on the mat' not 'The mat was sat on by the cat'). 5) Read your work aloud. 6) The goal of each sentence is to make the reader want to read the next one. What are you writing?",
    "Content creation framework: Hook (grab attention), Problem (show you understand their pain), Agitate (make the pain feel urgent), Solution (present your insight), Proof (data/examples), Call-to-action (what should they do next). This works for posts, articles, presentations, and even emails. Want help crafting something?",
  ],
  career: [
    "Career advice: 1) Skills > degrees — companies hire for what you can do. 2) Build in public — share your work, it compounds. 3) Network is net worth — help others genuinely. 4) Negotiate always — you leave 10-40% salary on the table otherwise. 5) Invest in T-shaped skills: deep in one area, broad across many. What career challenge are you facing?",
    "The tech job market: Top skills in demand — AI/ML engineering, full-stack development, cloud architecture, cybersecurity, data engineering. Remote work is here to stay for tech roles. Build a portfolio that shows, don't just tell. Contribute to open source for visibility. What area are you interested in?",
  ],
  default: [
    "That's a really interesting question! Let me think about this: {context}. I'd say the key insight here is that understanding the underlying principles helps you make better decisions. Want me to go deeper on any specific angle?",
    "Great question! From what I know: {context}. This is a topic with many layers — there's the surface-level understanding and then the deeper nuances. Would you like me to break it down further?",
    "I appreciate you asking that! Here's my take: {context}. There's actually a lot more to unpack here. What aspect would you like to explore further?",
    "That's something worth thinking deeply about. {context}. The key takeaway: context matters, and the best approach depends on your specific situation. Tell me more about what you're trying to achieve and I'll give you a more targeted answer.",
  ],
};

function classifyIntent(message: string): string {
  const lower = message.toLowerCase();
  if (/^(hi|hello|hey|sup|yo|what'?s up|greetings|good morning|good evening)/i.test(lower)) return 'greeting';
  if (/trust|score|tier|verification|badge|credibility|reach/i.test(lower)) return 'trust';
  if (/code|bug|function|react|component|api|typescript|javascript|python|algorithm|debug|compile|syntax|variable|loop|error|deploy|node|npm|git/i.test(lower)) return 'coding';
  if (/\bai\b|artificial intelligence|machine learning|llm|gpt|model|neural|deep learning|chatgpt|claude|openai|gemini|transformer|embedding/i.test(lower)) return 'ai';
  if (/science|physics|chemistry|biology|evolution|quantum|atom|molecule|cell|universe|galaxy|planet|gravity|energy|dna|gene|experiment|space/i.test(lower)) return 'science';
  if (/history|ancient|war|empire|revolution|civilization|century|dynasty|historical|medieval|colonial/i.test(lower)) return 'history';
  if (/math|calcul|algebra|geometry|statistic|probability|equation|number|formula|integral|derivative|matrix|theorem/i.test(lower)) return 'math';
  if (/health|fitness|diet|exercise|sleep|mental|stress|nutrition|vitamin|weight|doctor|medical|symptom|disease/i.test(lower)) return 'health';
  if (/philosophy|meaning|ethics|moral|consciousness|existence|stoic|wisdom|truth|reality|purpose|virtue|soul/i.test(lower)) return 'philosophy';
  if (/business|revenue|profit|market|customer|growth|strategy|management|sales|product|company/i.test(lower)) return 'business';
  if (/startup|founder|invest|fundraise|series|pitch|mvp|product.market|venture|accelerator/i.test(lower)) return 'startup';
  if (/xbee|platform|feature|ghost mode|feed|post|trust score/i.test(lower)) return 'xbee';
  if (/writ|essay|blog|article|content|copy|story|headline|paragraph|grammar/i.test(lower)) return 'writing';
  if (/career|job|salary|resume|interview|hire|skill|promotion|remote|work/i.test(lower)) return 'career';
  return 'default';
}

function generateResponse(message: string): string {
  const intent = classifyIntent(message);
  const responses = knowledgeBase[intent];
  const response = responses[Math.floor(Math.random() * responses.length)];

  if (intent === 'default') {
    // Add context-awareness for default responses
    const words = message.split(' ').filter(w => w.length > 3);
    const context = words.length > 0
      ? `regarding "${words.slice(0, 5).join(' ')}", there are several perspectives to consider`
      : 'this touches on several important areas';
    return response.replace('{context}', context);
  }

  return response;
}

function generateSuggestions(message: string): string[] {
  const intent = classifyIntent(message);
  const suggestions: Record<string, string[]> = {
    greeting: ['How does the trust system work?', 'What can Xbee AI do?', 'Help me with code'],
    trust: ['How do I increase my trust score?', 'What are verification badges?', 'Explain reach multipliers'],
    coding: ['Help me debug a React component', 'Explain async/await patterns', 'Best practices for API design'],
    ai: ['What are AI agents?', 'Compare GPT-4 vs Claude', 'How does RAG work?'],
    science: ['Explain quantum entanglement', 'How does CRISPR work?', 'What is dark matter?'],
    history: ['What caused World War I?', 'Tell me about the Renaissance', 'Ancient civilizations'],
    math: ['Explain Euler\'s identity', 'How does calculus work?', 'Probability basics'],
    health: ['Tips for better sleep', 'Science of exercise', 'Nutrition fundamentals'],
    philosophy: ['What is Stoicism?', 'Meaning of life?', 'Ethics in tech'],
    business: ['How to grow revenue?', 'Best business models', 'Marketing strategies'],
    startup: ['How to find product-market fit?', 'When should I raise funding?', 'How to build an MVP fast?'],
    xbee: ['How does Ghost Mode work?', 'Explain the trust system', 'What is the Trusted Feed?'],
    writing: ['Help me write a post', 'Content creation tips', 'How to write hooks'],
    career: ['How to get promoted?', 'Resume tips', 'Remote work advice'],
    default: ['Tell me about Xbee', 'Help me with code', 'Explain something scientific'],
  };
  return suggestions[intent] || suggestions.default;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const response = generateResponse(message.trim());
  const suggestions = generateSuggestions(message.trim());

  return NextResponse.json({
    response,
    suggestions,
    timestamp: new Date().toISOString(),
  });
}
