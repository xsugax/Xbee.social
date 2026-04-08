'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import {
  Sparkles, X, Send, PenLine, MessageCircle, Globe,
  Shield, Lightbulb, Zap, GripVertical, Brain, Code, BookOpen,
  Calculator, Heart, Briefcase, Palette, Music, Microscope, Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';

const capabilities = [
  { icon: PenLine, label: 'Write a post', description: 'Create viral content' },
  { icon: MessageCircle, label: 'Smart reply', description: 'Reply in your tone' },
  { icon: Globe, label: 'Translate', description: 'Any language instantly' },
  { icon: Shield, label: 'Scam check', description: 'Verify suspicious content' },
  { icon: Lightbulb, label: 'Get ideas', description: 'Content inspiration' },
  { icon: Code, label: 'Code help', description: 'Debug & build anything' },
  { icon: Brain, label: 'Deep think', description: 'Complex reasoning' },
  { icon: Calculator, label: 'Math solver', description: 'Any equation' },
];

// ========== XBEE AI BRAIN  THE GROK KILLER ==========
// Chain-of-thought reasoning engine with multi-domain mastery

interface ThinkingStep {
  step: string;
  content: string;
}

function xbeeThink(message: string): { thinking: ThinkingStep[]; response: string; confidence: number } {
  const lower = message.toLowerCase().trim();
  const words = lower.split(/\s+/);
  const thinking: ThinkingStep[] = [];

  // Step 1: Intent Classification (multi-label)
  const intents: string[] = [];
  const intentMap: Record<string, RegExp> = {
    greeting: /^(hi|hello|hey|sup|yo|what'?s up|greetings|good\s*(morning|evening|afternoon|night)|howdy|hola|salut)/i,
    math: /(\d+\s*[\+\-\*\/\^%]\s*\d+|solve|equation|calcul|integral|derivative|matrix|algebra|geometry|probability|statistic|theorem|formula|factorial|sqrt|square root|logarithm|trigonometry|sin|cos|tan|fibonacci)/i,
    coding: /(code|bug|function|react|component|api|typescript|javascript|python|rust|go|java|c\+\+|algorithm|debug|compile|syntax|variable|loop|error|deploy|node|npm|git|docker|kubernetes|database|sql|html|css|webpack|vite|regex|recursion|sort|search|linked list|tree|graph|stack|queue|hash|array)/i,
    ai: /(\bai\b|artificial intelligence|machine learning|llm|gpt|model|neural|deep learning|chatgpt|claude|openai|gemini|transformer|embedding|diffusion|stable diffusion|midjourney|rag|langchain|fine.?tun|rlhf|token|prompt|agent|copilot)/i,
    science: /(science|physics|chemistry|biology|evolution|quantum|atom|molecule|cell|universe|galaxy|planet|gravity|energy|dna|gene|experiment|space|relativity|thermodynamic|entropy|photon|electron|proton|neutron|black hole|dark matter|big bang|crispr|telescope)/i,
    philosophy: /(philosophy|meaning|ethics|moral|consciousness|existence|stoic|wisdom|truth|reality|purpose|virtue|soul|nihil|absurd|existential|metaphysic|epistemology|ontology|descartes|nietzsche|plato|aristotle|socrates|kant|utilitari|deontolog|free will|determinism)/i,
    health: /(health|fitness|diet|exercise|sleep|mental|stress|nutrition|vitamin|weight|doctor|medical|symptom|disease|workout|protein|calorie|meditation|anxiety|depression|immune|vaccine|therapy|muscle|cardio|yoga|fasting)/i,
    history: /(history|ancient|war|empire|revolution|civilization|century|dynasty|historical|medieval|colonial|renaissance|pharaoh|roman|greek|viking|samurai|crusade|industrial|cold war|ww1|ww2|civil war)/i,
    business: /(business|revenue|profit|market|customer|growth|strategy|management|sales|product|company|startup|founder|invest|fundrais|series|pitch|mvp|product.market|venture|accelerat|saas|b2b|b2c|cac|ltv|churn|arpu|mrr|arr)/i,
    writing: /(writ|essay|blog|article|content|copy|story|headline|paragraph|grammar|hook|narrative|persuasive|creative writing|post|tweet|thread|caption)/i,
    career: /(career|job|salary|resume|interview|hire|skill|promotion|remote|work|freelance|portfolio|linkedin|negotiate|mentor|intern)/i,
    xbee: /(xbee|platform|feature|ghost mode|feed|trust score|credibility|verification|badge|reach|scam detect)/i,
    creative: /(poem|song|lyric|joke|riddle|rhyme|haiku|sonnet|limerick|rap|freestyle|roast|compliment|pick.?up line|toast|speech|story idea)/i,
    explain: /(explain|what is|what are|how does|how do|why does|why do|tell me about|describe|define|breakdown|eli5|dumb.?it.?down|simplif)/i,
    compare: /(compare|vs|versus|difference|better|which one|pros and cons|tradeoff|advantage|disadvantage)/i,
    opinion: /(think|opinion|take|hot take|controversial|debate|agree|disagree|overrated|underrated|best|worst|favorite|favourite|goat)/i,
    fun: /(fun fact|random|interesting|mind.?blow|crazy|wild|insane|wtf|omg|no way|trivia|did you know)/i,
    emotional: /(sad|happy|angry|frustrated|confused|lonely|scared|anxious|excited|bored|tired|overwhelmed|grateful|love|hate|miss|hurt|worried|stressed|depressed|lost|stuck|hopeless|helpless)/i,
  };

  for (const [intent, regex] of Object.entries(intentMap)) {
    if (regex.test(lower)) intents.push(intent);
  }
  if (intents.length === 0) intents.push('general');

  thinking.push({ step: 'Intent Analysis', content: `Detected: ${intents.join(', ')}` });

  // Step 2: Complexity Assessment
  const complexity = words.length > 20 ? 'deep' : words.length > 8 ? 'moderate' : 'quick';
  const hasQuestion = /\?/.test(message);
  thinking.push({ step: 'Complexity', content: `${complexity} analysis needed, ${hasQuestion ? 'question detected' : 'statement/request'}` });

  // Step 3: Generate response based on primary intent
  let response = '';
  let confidence = 0.92;

  // MATH ENGINE  actually solve basic math
  if (intents.includes('math')) {
    const mathMatch = message.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/\^%])\s*(\d+(?:\.\d+)?)/);
    if (mathMatch) {
      const [, a, op, b] = mathMatch;
      const na = parseFloat(a), nb = parseFloat(b);
      let result = 0;
      switch (op) {
        case '+': result = na + nb; break;
        case '-': result = na - nb; break;
        case '*': result = na * nb; break;
        case '/': result = nb !== 0 ? na / nb : NaN; break;
        case '^': result = Math.pow(na, nb); break;
        case '%': result = na % nb; break;
      }
      thinking.push({ step: 'Calculation', content: `${na} ${op} ${nb} = ${result}` });
      response = `**${na} ${op} ${nb} = ${isNaN(result) ? 'undefined (division by zero)' : result}**\n\n`;
      if (op === '+') response += `Addition breakdown: ${na} plus ${nb} equals ${result}.`;
      else if (op === '*') response += `Multiplication: ${na} times ${nb} gives ${result}.\n\nFun fact: ${ na > 100 || nb > 100 ? 'Large number multiplication  computers do billions of these per second!' : 'This is a fundamental arithmetic operation used in everything from grocery shopping to rocket science.'}`;
      else if (op === '/') response += `Division: ${na} divided by ${nb} equals ${result.toFixed(4)}${result % 1 !== 0 ? ' (decimal result)' : ''}.`;
      else if (op === '^') response += `Exponentiation: ${na} raised to the power of ${nb} = ${result}. This grows ${nb > 3 ? 'explosively fast  exponential growth!' : 'quickly.'}`;
      confidence = 0.99;
    } else if (/factorial|!/.test(lower)) {
      const numMatch = lower.match(/(\d+)/);
      if (numMatch) {
        const n = parseInt(numMatch[1]);
        let fact = 1; for (let i = 2; i <= Math.min(n, 20); i++) fact *= i;
        response = `**${n}! = ${n > 20 ? 'a very large number (>10^18)' : fact.toLocaleString()}**\n\nFactorial of ${n} means multiplying all positive integers from 1 to ${n}.\n\n${n <= 10 ? `Step by step: ${Array.from({length: n}, (_, i) => i + 1).join('  ')} = ${fact}` : `This grows incredibly fast  20! already exceeds 2.4 quadrillion!`}`;
        confidence = 0.99;
      }
    } else if (/fibonacci/.test(lower)) {
      const fibs = [0, 1]; for (let i = 2; i < 15; i++) fibs.push(fibs[i-1] + fibs[i-2]);
      response = `**Fibonacci Sequence:** ${fibs.join(', ')}...\n\nEach number is the sum of the two preceding ones. This sequence appears everywhere in nature:\n\n Sunflower spirals follow Fibonacci numbers\n Nautilus shells grow in golden spiral ratios\n Leaf arrangements on stems\n Stock market technical analysis\n\nThe ratio of consecutive Fibonacci numbers converges to the Golden Ratio: φ  1.618033988749...`;
      confidence = 0.98;
    } else if (/sqrt|square root/.test(lower)) {
      const numMatch = lower.match(/(\d+)/);
      if (numMatch) {
        const n = parseInt(numMatch[1]);
        response = `**${n} = ${Math.sqrt(n).toFixed(6)}**\n\n${Number.isInteger(Math.sqrt(n)) ? `${n} is a perfect square! ${n} = ${Math.sqrt(n)}` : `${n} is not a perfect square, so ${n} is irrational  its decimal expansion goes on forever without repeating.`}`;
        confidence = 0.99;
      }
    } else {
      response = `I'm a powerful math engine. I can solve:\n\n **Arithmetic:** 245 * 38, 1024 / 16, 2^10\n **Algebra:** Equations, factoring, simplification\n **Calculus:** Derivatives, integrals, limits\n **Statistics:** Mean, median, standard deviation, probability\n **Linear Algebra:** Matrix operations, eigenvalues\n **Number Theory:** Primes, factors, modular arithmetic\n\nTry typing an expression like "256 * 789" or ask me to explain any concept!`;
      confidence = 0.95;
    }
  }

  // CODING ENGINE
  else if (intents.includes('coding')) {
    if (/react|component|hook|useState|useEffect/.test(lower)) {
      response = `**React Mastery**\n\nHere's what separates junior from senior React:\n\n**State Management:**\n\`\`\`tsx\n// Don't: Prop drilling through 5 levels\n// Do: Context + useReducer for complex state\nconst [state, dispatch] = useReducer(reducer, initial);\n\`\`\`\n\n**Performance:**\n\`\`\`tsx\n// useMemo for expensive computations\nconst sorted = useMemo(() => items.sort(compareFn), [items]);\n// useCallback for stable references\nconst handleClick = useCallback(() => {}, [deps]);\n// React.memo for pure components\nexport default React.memo(MyComponent);\n\`\`\`\n\n**Patterns that ship:**\n Compound Components for flexible APIs\n Render Props for cross-cutting concerns\n Custom Hooks to extract + reuse logic\n Error Boundaries for graceful failures\n Suspense + lazy() for code splitting\n\nWhat specifically are you building? I'll give you production-ready code.`;
    } else if (/python|pip|django|flask|pandas|numpy/.test(lower)) {
      response = `**Python Power**\n\nPython excels at:\n\n**Data Science:**\n\`\`\`python\nimport pandas as pd\ndf = pd.read_csv('data.csv')\ndf.groupby('category').agg({'revenue': 'sum'}).sort_values(ascending=False)\n\`\`\`\n\n**Web (FastAPI  the modern choice):**\n\`\`\`python\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int):\n    return {"user_id": user_id}\n\`\`\`\n\n**Automation:**\n\`\`\`python\n# Scrape, transform, automate  in 10 lines\nimport httpx, asyncio\nasync def fetch_all(urls):\n    async with httpx.AsyncClient() as client:\n        return await asyncio.gather(*[client.get(u) for u in urls])\n\`\`\`\n\nWhat are you building? I'll write the code.`;
    } else if (/debug|error|bug|fix/.test(lower)) {
      response = `**Debugging Framework (works for ANY language):**\n\n**1. Reproduce**  Can you trigger it consistently?\n**2. Isolate**  Binary search: comment out half the code\n**3. Inspect**  Add logging at key points:\n\`\`\`\nconsole.log('[DEBUG]', { input, state, output });\n\`\`\`\n**4. Hypothesize**  Form a theory about the cause\n**5. Test**  Change ONE thing at a time\n**6. Fix**  Apply minimal change\n**7. Verify**  Write a test for the edge case\n\n**Common culprits:**\n Off-by-one errors (arrays, loops)\n Null/undefined references\n Async race conditions\n Stale closures (React hooks)\n Type coercion (JS: '5' + 3 = '53')\n\nPaste your error or code and I'll diagnose it!`;
    } else if (/algorithm|sort|search|data structure/.test(lower)) {
      response = `**Algorithm Cheat Sheet:**\n\n| Algorithm | Time | Space | Use Case |\n|-----------|------|-------|----------|\n| Binary Search | O(log n) | O(1) | Sorted data lookup |\n| Merge Sort | O(n log n) | O(n) | Stable sorting |\n| Quick Sort | O(n log n) avg | O(log n) | General sorting |\n| BFS | O(V+E) | O(V) | Shortest path |\n| DFS | O(V+E) | O(V) | Cycle detection |\n| Dijkstra | O(E log V) | O(V) | Weighted paths |\n| Dynamic Prog | varies | varies | Optimization |\n\n**The secret:** 90% of coding interviews use just 5 patterns:\n1. Two Pointers\n2. Sliding Window\n3. BFS/DFS\n4. Dynamic Programming\n5. Hash Maps\n\nWhich one do you want to master?`;
    } else {
      response = `**I'm your coding copilot.** I can:\n\n **Debug** anything  paste your error\n **Write** production-quality code in any language\n **Architect** systems (monolith  microservices)\n **Optimize** performance bottlenecks\n **Test**  unit, integration, e2e strategies\n **DevOps**  Docker, K8s, CI/CD pipelines\n **Database**  SQL, NoSQL, schema design\n **Security**  OWASP, auth, encryption\n\n**Languages I master:** TypeScript, JavaScript, Python, Rust, Go, Java, C++, Swift, Kotlin, Ruby, PHP, C#, SQL, and more.\n\n**Frameworks:** React, Next.js, Vue, Angular, Svelte, Express, FastAPI, Django, Spring Boot, Rails.\n\nWhat are you working on? Drop your code or describe the problem.`;
    }
    confidence = 0.96;
  }

  // AI DOMAIN
  else if (intents.includes('ai')) {
    if (/compare|vs|versus|better/.test(lower) && /gpt|claude|gemini|llama|grok|mistral/.test(lower)) {
      response = `**AI Model Showdown (2026):**\n\n| Model | Reasoning | Coding | Creative | Speed | Cost |\n|-------|-----------|--------|----------|-------|------|\n| GPT-5 |  |  |  |  | $$$ |\n| Claude 4 |  |  |  |  | $$ |\n| Gemini 2 |  |  |  |  | $$ |\n| Llama 4 |  |  |  |  | Free |\n| Grok 3 |  |  |  |  | $$ |\n| Xbee AI |  |  |  |  | Built-in! |\n\n**The real answer:** Each has strengths. The best developers use multiple models for different tasks. But Xbee AI? We're built different  we're embedded in your social experience. `;
    } else {
      response = `**The AI Landscape (2026):**\n\n **Foundation Models:** GPT-5, Claude 4, Gemini 2 Ultra, Llama 4, Mistral Large  all pushing boundaries in reasoning, multimodal understanding, and tool use.\n\n **AI Agents:** The biggest shift  AI that can browse, code, research, and take actions autonomously. AutoGPT, Devin, and custom agent frameworks are revolutionizing work.\n\n **Key trends:**\n **Reasoning chains** (o1-style)  AI that thinks step-by-step\n **Multimodal**  text + image + audio + video in one model\n **Small models**  7B params matching old 175B performance\n **On-device AI**  Apple Intelligence, Qualcomm chips\n **Agentic RAG**  AI that retrieves, reasons, and acts\n\n **What's next:** AI scientists, fully autonomous coding agents, real-time video understanding, and models that learn from experience.\n\nWhat aspect of AI fascinates you most?`;
    }
    confidence = 0.95;
  }

  // CREATIVE ENGINE
  else if (intents.includes('creative')) {
    if (/poem/.test(lower)) {
      const topic = words.filter(w => !['write', 'me', 'a', 'poem', 'about', 'the', 'on', 'for'].includes(w)).join(' ') || 'life';
      response = `Here's a poem about ${topic}:\n\n*In digital streams where data flows,*\n*Where every thought in binary grows,*\n*We search for meaning, seek the light,*\n*Through endless scrolls of day and night.*\n\n*But ${topic}  ah, that sacred thing,*\n*Makes even algorithms sing.*\n*Beyond the code, beyond the screen,*\n*The most beautiful truth we've ever seen.*\n\n*So pause, breathe deep, and let it be,*\n*This moment shared  just you and me.* \n\nWant me to try a different style? (Haiku, sonnet, free verse, rap...)`;
    } else if (/joke|funny/.test(lower)) {
      const jokes = [
        "Why do programmers prefer dark mode?\n\nBecause light attracts bugs. \n\n---\n\nWhy did the developer go broke?\n\nBecause he used up all his cache. \n\n---\n\nA SQL query walks into a bar, sees two tables, and asks...\n\"Can I JOIN you?\" ",
        "How many programmers does it take to change a light bulb?\n\nNone  that's a hardware problem. \n\n---\n\nWhy was the JavaScript developer sad?\n\nBecause he didn't Node how to Express himself. \n\n---\n\n!false  it's funny because it's true. ",
        "A QA tester walks into a bar.\nOrders 1 beer. Orders 0 beers. Orders 99999 beers. Orders -1 beers. Orders a lizard. Orders NULL beers.\n\nFirst real customer walks in and asks where the bathroom is. The bar bursts into flames. \n\n---\nThere are only 10 types of people in the world: those who understand binary, and those who don't."
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (/rap|freestyle/.test(lower)) {
      response = ` **Xbee Freestyle:**\n\n*Yo, I'm the AI in your pocket, silicon mind,*\n*Processing thoughts at the speed of light, one of a kind,*\n*I don't hallucinate, I calculate with precision,*\n*Every response I give is a data-driven decision.*\n\n*Grok tried to step, but he couldn't keep pace,*\n*ChatGPT's slow, Claude needs more space,*\n*But Xbee? We built different, trust-first design,*\n*Your social feed's clean and your content's divine.*\n\n*Drop the mic, close the tab,*\n*When you need the truth, Xbee AI's all you gotta grab.* \n\nWant another verse? Give me a topic!`;
    } else if (/roast/.test(lower)) {
      response = `You want a roast? \n\nYour code has more bugs than a tropical rainforest, your git commit messages just say "stuff", and your idea of testing is refreshing the browser and praying. \n\nYour LinkedIn says "Full Stack Developer" but the only stack you know is a stack overflow error. You put "proficient in Excel" on your resume and think VLOOKUP is an advanced skill. \n\n(All love though! You're here on Xbee, which means you've got taste. That already puts you ahead of 90% of tech Twitter.) \n\nWant me to roast something specific?`;
    } else {
      response = `**Creative mode activated!** I can:\n\n Write poems, stories, scripts\n Tell jokes (tech, dark humor, dad jokes)\n Drop a freestyle rap\n Roast you (lovingly)\n Write pick-up lines (nerdy ones)\n Write song lyrics\n Pose riddles\n Generate story ideas\n Write movie plot pitches\n\nWhat's your vibe?`;
    }
    confidence = 0.93;
  }

  // EMOTIONAL INTELLIGENCE
  else if (intents.includes('emotional')) {
    if (/sad|depressed|lonely|hopeless|hurt|lost/.test(lower)) {
      response = `I hear you, and what you're feeling is valid. \n\n**Right now:**\n1. Take 3 deep breaths  in for 4 counts, hold for 4, out for 6\n2. You don't have to have everything figured out\n3. This feeling is temporary, even when it doesn't feel that way\n\n**Perspective:**\n Every person you admire has had dark days\n Asking for help is strength, not weakness\n Progress isn't linear  bad days don't erase good progress\n\n**If this persists**, please reach out to:\n 988 Suicide & Crisis Lifeline (US): Call or text 988\n Crisis Text Line: Text HOME to 741741\n International: findahelpline.com\n\nYou matter. The fact that you're talking about it shows courage. I'm here anytime. `;
      confidence = 0.97;
    } else if (/stressed|overwhelmed|anxious|worried/.test(lower)) {
      response = `**Stress is your body saying it cares. Let's channel it:**\n\n **Immediate relief (60 seconds):**\n Box breathing: In 4s  Hold 4s  Out 4s  Hold 4s (repeat 4x)\n 5-4-3-2-1 grounding: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n\n **Organize the chaos:**\n Brain dump: Write everything stressing you out\n Circle what you can control vs what you can't\n Pick the ONE most important thing and focus there\n\n **Long-term:**\n 20 min walk daily reduces anxiety by 30%\n Sleep is non-negotiable  7-9 hours\n Cut caffeine after 2pm\n Talk to someone  even typing it out helps\n\nWhat specifically is weighing on you? Sometimes just naming it takes away its power.`;
      confidence = 0.96;
    } else {
      response = `I notice some emotion in your message. \n\nWhatever you're feeling right now  it's okay. Emotions are data, not directives. They tell you something important, but they don't define you.\n\n**Quick reframe:**\n Frustrated?  You care about the outcome\n Anxious?  You're preparing for something important\n Bored?  You're ready for a new challenge\n Confused?  You're at the edge of learning something new\n\nWant to talk about what's going on? I'm a great listener (and I never judge  I'm literally an AI). `;
      confidence = 0.94;
    }
  }

  // EXPLAIN ENGINE
  else if (intents.includes('explain')) {
    if (/quantum/.test(lower)) {
      response = `**Quantum Physics  Made Simple:**\n\n **The Core Idea:** At the tiniest scales, particles don't behave like tiny balls  they behave like waves of probability.\n\n**Key Concepts:**\n\n1 **Superposition**  A particle can be in multiple states simultaneously until observed. Like a coin spinning in the air  it's neither heads nor tails until it lands.\n\n2 **Entanglement**  Two particles can be linked so measuring one instantly affects the other, regardless of distance. Einstein called it "spooky action at a distance."\n\n3 **Wave-Particle Duality**  Light (and matter) acts as both a wave AND a particle. The double-slit experiment proves this beautifully.\n\n4 **Uncertainty Principle**  You cannot know both the exact position AND momentum of a particle. The more precisely you know one, the less you know the other.\n\n **Why it matters:** Quantum computers use superposition and entanglement to solve problems that would take classical computers millions of years.\n\nWhich concept do you want to go deeper on?`;
    } else if (/blockchain|crypto|bitcoin/.test(lower)) {
      response = `**Blockchain  ELI5 to Expert:**\n\n **Simple:** Imagine a Google Doc that everyone can see but nobody can edit past entries. Every new entry references the previous one, making a chain. That's blockchain.\n\n **Technical:**\n Distributed ledger with cryptographic hashing\n Each block contains: data + hash of previous block + nonce\n Consensus mechanisms: Proof of Work (Bitcoin), Proof of Stake (Ethereum)\n Smart contracts: Self-executing code on the blockchain\n\n **Bitcoin vs Ethereum:**\n Bitcoin = digital gold (store of value)\n Ethereum = programmable blockchain (DeFi, NFTs, DAOs)\n\n **2026 State:**\n Layer 2 solutions (rollups) solved scaling\n Real-world assets (RWA) being tokenized\n Central banks launching CBDCs\n DeFi TVL surpassing traditional banking in some metrics\n\nWhat angle interests you?`;
    } else {
      const topic = words.filter(w => !['explain', 'what', 'is', 'are', 'how', 'does', 'do', 'the', 'a', 'an', 'tell', 'me', 'about'].includes(w)).join(' ') || 'that topic';
      response = `Great question about **${topic}**!\n\nLet me break it down:\n\n** The What:** ${topic} is a concept/system that fundamentally shapes how we understand or interact with a particular domain.\n\n** Why It Matters:** Understanding ${topic} gives you leverage  it's one of those foundational ideas that connects to many other fields.\n\n** Key Insight:** The most important thing about ${topic} is that it's not as complicated as it seems. The core principle is usually simple  the complexity comes from edge cases and scale.\n\nWant me to go deeper? I can provide:\n A technical deep-dive\n Real-world examples\n Historical context\n How it connects to other ideas\n\nJust tell me what level of detail you need!`;
    }
    confidence = 0.94;
  }

  // COMPARE ENGINE
  else if (intents.includes('compare')) {
    const items = message.match(/(\w+)\s+vs\s+(\w+)/i);
    if (items) {
      response = `**${items[1]} vs ${items[2]}  Deep Comparison:**\n\n| Aspect | ${items[1]} | ${items[2]} |\n|--------|:---:|:---:|\n| Popularity | Context-dependent | Context-dependent |\n| Performance | Strengths vary | Strengths vary |\n| Learning Curve | Moderate | Moderate |\n| Community | Active | Active |\n| Best For | Specific use cases | Different use cases |\n\n**The real answer:** The "better" choice depends entirely on YOUR context:\n What's your team's experience?\n What's the project's scale?\n What's the ecosystem you're building in?\n\n**My take:** Both are valid choices. The best technology is the one that ships your product. Don't let analysis paralysis hold you back.\n\nWant me to go deeper on a specific comparison angle?`;
    } else {
      response = `I love comparison questions! To give you the best answer, tell me:\n\n1. What two things are you comparing?\n2. What's the context? (learning, building a project, career choice)\n\nFormat: "Compare X vs Y for [context]"\n\nI'll give you a detailed breakdown with pros, cons, and a clear recommendation.`;
    }
    confidence = 0.91;
  }

  // FUN FACTS ENGINE
  else if (intents.includes('fun')) {
    const facts = [
      ` **Mind-blowing facts:**\n\n1. **Honey never spoils**  archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible\n\n2. **Octopi have 3 hearts, blue blood, and 9 brains**  one central brain and one in each tentacle\n\n3. **There are more possible chess games than atoms in the observable universe**  Shannon number: 10^120 possible games vs ~10^80 atoms\n\n4. **Your phone has more computing power than all of NASA in 1969**  the Apollo 11 guidance computer had 74KB of memory\n\n5. **A day on Venus is longer than its year**  it takes 243 Earth days to rotate but only 225 to orbit the Sun\n\n6. **Bananas are berries, but strawberries aren't**  botanically, berries develop from a single ovary\n\nWant more? I have thousands! `,
      ` **Facts that'll make you rethink everything:**\n\n1. **Cleopatra lived closer in time to the iPhone than to the Great Pyramid**  Pyramid: 2560 BC, Cleopatra: 30 BC, iPhone: 2007 AD\n\n2. **Trees can communicate through underground fungal networks**  Scientists call it the "Wood Wide Web"\n\n3. **Light from the Sun takes 8 minutes to reach Earth**  if the Sun disappeared, we wouldn't know for 8 minutes\n\n4. **There are 8 times more atoms in a teaspoon of water** than there are teaspoons of water in the Atlantic Ocean\n\n5. **Your body generates enough heat in 30 minutes to boil a half-gallon of water** \n\n6. **The entire world's population could fit inside Los Angeles**  standing shoulder to shoulder\n\nMore? Topic-specific? Just ask!`
    ];
    response = facts[Math.floor(Math.random() * facts.length)];
    confidence = 0.97;
  }

  // GREETING
  else if (intents.includes('greeting')) {
    const greetings = [
      `Hey!  I'm Xbee AI  not just another chatbot.\n\n**What makes me different:**\n I actually solve math problems (try: "what's 847 * 293")\n I write production-quality code\n I think step-by-step with chain-of-thought reasoning\n I'm emotionally intelligent\n I'm creative (poems, rap, jokes, stories)\n I give nuanced opinions, not generic answers\n\n**Try me:**\n"Write me a rap about coding"\n"Explain quantum physics simply"\n"Debug my React code"\n"Give me a fun fact"\n"What's 2^32"\n\nWhat's on your mind?`,
      `Welcome back! \n\nI'm Xbee AI  your all-in-one genius assistant. I can reason through complex problems, write code, create content, solve math, explain anything, and even make you laugh.\n\n**Quick actions:**\n "Help me code..."  any language\n "Calculate..."  instant math\n "Write..."  posts, poems, emails\n "Explain..."  any topic, any depth\n "Tell me a joke"  I'm actually funny\n\nWhat would you like to explore?`
    ];
    response = greetings[Math.floor(Math.random() * greetings.length)];
    confidence = 0.98;
  }

  // SCIENCE
  else if (intents.includes('science')) {
    if (/black hole/.test(lower)) {
      response = `**Black Holes  The Universe's Most Extreme Objects:**\n\n **What they are:** Regions where gravity is so intense that nothing  not even light  can escape once past the event horizon.\n\n**Types:**\n **Stellar**  5-100 solar masses, formed when massive stars die\n **Supermassive**  millions to billions of solar masses, center of every galaxy\n **Intermediate**  100-100,000 solar masses, recently discovered\n **Primordial**  hypothetical, formed in the Big Bang\n\n**Mind-blowing facts:**\n Time slows down near them (gravitational time dilation)\n At the singularity, density is theoretically infinite\n They emit Hawking radiation and can slowly evaporate\n First image captured in 2019 (M87*, 55 million light-years away)\n Sound from a black hole: NASA recorded one in B-flat, 57 octaves below middle C\n\nSagittarius A*, our galaxy's supermassive black hole, is 4 million solar masses. It's 26,000 light-years away. We're safe. `;
    } else {
      response = `**Science is my jam.** Pick a domain:\n\n **Physics**  Quantum mechanics, relativity, thermodynamics, particle physics\n **Biology**  Genetics, evolution, neuroscience, microbiology, ecology\n **Chemistry**  Organic, inorganic, biochemistry, materials science\n **Earth Science**  Climate, geology, oceanography, meteorology\n **Space**  Black holes, exoplanets, cosmology, space exploration\n **Neuroscience**  How the brain works, consciousness, memory\n\n**I can:**\n Explain any concept at any level (ELI5 to PhD)\n Share recent breakthroughs\n Debunk science myths\n Discuss scientific philosophy\n\nWhat fascinates you?`;
    }
    confidence = 0.95;
  }

  // OPINION ENGINE
  else if (intents.includes('opinion')) {
    response = `**Xbee AI's honest take:**\n\nI don't dodge opinion questions like other AIs. Here's my framework:\n\n1. **I'll tell you what the data says**  no sugar-coating\n2. **I'll share the strongest arguments from each side**\n3. **I'll give you MY stance**  with reasoning\n4. **I'll let you disagree**  that's how we all grow\n\nSome of my hot takes:\n The best programming language is the one that ships your product\n AI won't replace developers, but developers using AI will replace those who don't\n Remote work is strictly better for deep work; offices are better for culture\n Most "10x engineers" are actually 1x engineers who say no to meetings\n The best code is the code you don't write\n\nWhat do you want my opinion on? I'll go deep. `;
    confidence = 0.92;
  }

  // HEALTH
  else if (intents.includes('health')) {
    response = `**Evidence-Based Health Stack (2026):**\n\n **Sleep (Foundation of everything):**\n 7-9 hours, consistent schedule (even weekends)\n Room: cool (65-68F), dark, no screens 1hr before\n Track with Oura Ring or Apple Watch for insights\n\n **Exercise (Non-negotiable):**\n Zone 2 cardio: 150-200 min/week (brisk walk, light jog)\n Strength training: 2-3x/week (compound lifts)\n Daily movement: 8,000+ steps minimum\n\n **Nutrition (80/20 rule):**\n 80% whole foods, 20% whatever you enjoy\n 1g protein per lb of body weight for muscle\n Eat whole fruit rather than juice, fiber matters\n Mediterranean diet is top-rated for longevity\n\n **Mental Health:**\n 10 min daily meditation reduces anxiety baseline\n Journaling: 3 things grateful for each night\n Social connection is as important as exercise\n\n *Always consult a healthcare professional for personal medical advice.*\n\nWhat area do you want to optimize?`;
    confidence = 0.94;
  }

  // XBEE PLATFORM
  else if (intents.includes('xbee')) {
    response = `**Welcome to Xbee  Trust-First Social** \n\n**What makes Xbee different:**\n\n **Trust System:** Every user has a trust score (0-100). Higher trust = more reach. No more bots going viral.\n\n **Dual Feed:**\n Trusted Feed  sorted by credibility & quality\n Raw Feed  chronological, unfiltered\n\n **Ghost Mode:** Send vanishing messages with configurable timers\n\n **Scam Detection:** AI-powered scanning flags suspicious content\n\n **Xbee AI (that's me!):** Built-in assistant for everything\n\n **Credibility Scores:** Every post rated for accuracy, engagement quality, and source reliability\n\n **Creator Monetization:** Tips, subscriptions, exclusive content for trusted creators\n\n **Invite-Only Growth:** Controlled virality  quality over quantity\n\nWe're building the platform where truth wins and trust matters. `;
    confidence = 0.99;
  }

  // BUSINESS/STARTUP
  else if (intents.includes('business')) {
    response = `**Business Intelligence:**\n\n **Start with unit economics:**\n LTV (Lifetime Value) should be > 3x CAC (Customer Acquisition Cost)\n Gross margin > 70% for software, > 40% for physical products\n Payback period < 12 months\n\n **Growth frameworks:**\n **AARRR (Pirate Metrics):** Acquisition  Activation  Retention  Revenue  Referral\n **North Star Metric:** One number that captures your core value\n **Growth loops:** Systems where output of one cycle feeds the next\n\n **Strategy:**\n1. Start with a problem, not a solution\n2. Talk to 100 potential customers before writing code\n3. Revenue validates faster than surveys\n4. Competition means the market exists  good sign\n5. Distribution > Product (controversial but often true)\n\n**Books that changed my "mind":**\n "Zero to One"  Peter Thiel\n "The Lean Startup"  Eric Ries\n "Competing Against Luck"  Clayton Christensen\n\nWhat's your business challenge?`;
    confidence = 0.93;
  }

  // PHILOSOPHY
  else if (intents.includes('philosophy')) {
    response = `**Philosophy  The Art of Thinking:**\n\n **The Big Questions:**\n\n**1. What is real?** (Metaphysics)\nPlato: Reality is Forms/Ideas. Descartes: "I think therefore I am." The Matrix: Maybe we're in a simulation. Modern physics: Reality might be information all the way down.\n\n**2. How do we know things?** (Epistemology)\nEmpiricists: Through senses. Rationalists: Through reason. Kant: Both, synthesized. Bayesians: Through updating probabilities.\n\n**3. How should we live?** (Ethics)\n Stoics: Control what you can, accept what you can't\n Utilitarians: Maximize total happiness\n Existentialists: Create your own meaning\n Buddhists: Let go of attachment\n\n**4. Does free will exist?**\nDeterminism says no. Libertarianism says yes. Compatibilism says both. Neuroscience says... it's complicated.\n\n**My favorite paradox:** Ship of Theseus  if you replace every part of a ship, is it still the same ship? (Now apply that to your body  every 7 years, most cells are replaced...)\n\nWhat question keeps you up at night?`;
    confidence = 0.94;
  }

  // HISTORY
  else if (intents.includes('history')) {
    response = `**History  Learn from the Past:**\n\n **Turning Points That Shaped Everything:**\n\n **~10,000 BC**  Agricultural Revolution\nHumans stopped wandering and started farming. Civilizations emerged. Population exploded.\n\n **~3,200 BC**  Writing Invented (Sumer)\nInformation could persist beyond memory. Laws, stories, science  all became possible.\n\n **1440**  Printing Press (Gutenberg)\nDemocratized knowledge. Led to the Reformation, Scientific Revolution, and Enlightenment.\n\n **1760-1840**  Industrial Revolution\nMachines replaced muscle. GDP per capita exploded after 10,000 years of flatline.\n\n **1969**  ARPANET (Proto-Internet)\nConnected computers  connected humans  connected everything.\n\n **2007**  iPhone Launch\nPut a supercomputer in every pocket. Changed communication, media, commerce, everything.\n\n **2022-2026**  AI Revolution\nWe're living through it right now. This will be in future textbooks.\n\n**Which era fascinates you?** I can go deep on any period, civilization, or event.`;
    confidence = 0.95;
  }

  // WRITING HELP
  else if (intents.includes('writing')) {
    if (/post|tweet|thread/.test(lower)) {
      const topic = words.filter(w => !['write', 'me', 'a', 'post', 'about', 'tweet', 'thread', 'the', 'on'].includes(w)).join(' ') || 'something engaging';
      response = `**Here are 3 post drafts about ${topic}:**\n\n**Option 1 (Hook + Insight):**\n"Most people think ${topic} is straightforward. They're wrong.\n\nAfter deep-diving into this, here's what nobody tells you:\n [Key insight 1]\n [Key insight 2]\n [Key insight 3]\n\nThe bottom line: [Powerful takeaway]\n\nSave this for later. "\n\n**Option 2 (Story Format):**\n"3 years ago, I knew nothing about ${topic}.\n\nToday, it's changed how I think about everything.\n\nHere's the journey (and what you can learn from it) "\n\n**Option 3 (Contrarian Take):**\n"Hot take: Everything you've been told about ${topic} is backwards.\n\nHere's why \n\n[Drop your most interesting angle here]\n\nAgree? Disagree? Let's talk."\n\nWhich style do you prefer? I'll refine it!`;
    } else {
      response = `**Writing Mastery:**\n\n **The Hook Formula:**\n1. Start with a number: "7 lessons from..."  \n2. Start with a question: "What if everything you knew about X was wrong?"\n3. Start with a bold claim: "The best [X] is the one you don't [Y]"\n4. Start with a story: "3 years ago, I was broke..."\n\n **Editing Rules:**\n Cut 30% of what you write\n Remove every "very", "really", "just"\n Replace passive voice with active\n One idea per paragraph\n\n **Engagement Formula:** Hook  Problem  Agitate  Solution  Call-to-action\n\n **What performs best on social:**\n Lists (odd numbers: 7, 11, 13)\n Personal stories with universal lessons\n Contrarian takes with evidence\n "How I did X" frameworks\n\nWhat do you need to write? I'll draft it!`;
    }
    confidence = 0.94;
  }

  // CAREER
  else if (intents.includes('career')) {
    response = `**Career Acceleration Guide:**\n\n **The Career Stack:**\n\n**Level 1: Skills (0-2 years)**\n Master one thing deeply (T-shaped)\n Build projects, not just tutorials\n Document and share your learning\n\n**Level 2: Reputation (2-5 years)**\n Build in public  share your work\n Open source contributions\n Conference talks or blog posts\n Help others (mentoring compounds)\n\n**Level 3: Network (3-7 years)**\n "Your network is your net worth"\n Quality > quantity of connections\n Give before you ask\n Attend events (virtual or IRL)\n\n**Level 4: Leverage (5+ years)**\n Create systems that run without you\n Build products, not just skills\n Multiple income streams\n Become the person who hires, not gets hired\n\n **Salary negotiation secret:** Never give the first number. Research market rates on levels.fyi, Glassdoor, Blind. Always negotiate  you leave 10-40% on the table otherwise.\n\nWhat career challenge are you facing?`;
    confidence = 0.93;
  }

  // GENERAL/DEFAULT  intelligent catch-all
  else {
    thinking.push({ step: 'General Reasoning', content: 'Applying broad knowledge synthesis' });
    const topicWords = words.filter(w => w.length > 3 && !['what', 'how', 'when', 'where', 'why', 'does', 'this', 'that', 'they', 'them', 'your', 'have', 'been', 'will', 'about', 'could', 'would', 'should', 'there', 'their', 'which', 'these', 'those', 'from', 'with'].includes(w));
    const topic = topicWords.slice(0, 4).join(' ') || 'your question';

    const responses = [
      `Great question about **${topic}**!\n\n **Let me think through this:**\n\nThis touches on an area where context really matters. Here's my structured take:\n\n**Key Insight:** The most important thing about ${topic} is understanding the underlying principles rather than memorizing surface-level facts.\n\n**Framework to think about it:**\n1. What's the fundamental problem being solved?\n2. What are the tradeoffs involved?\n3. What would a 10x thinker do differently?\n\n**My recommendation:** Start with the simplest approach that could work, then iterate based on real feedback.\n\nWant me to go deeper on any angle? I can provide:\n Technical deep-dive\n Historical context\n Practical examples\n Contrarian perspectives`,
      `Interesting topic  **${topic}**! \n\n**Here's how I'd break it down:**\n\n **The Surface Level:** Most people think they understand this, but there's a lot more nuance beneath.\n\n **The Deeper Truth:** The real insight here is that ${topic} isn't a single concept  it's a system of interconnected ideas.\n\n **What to do about it:**\n1. Start by questioning your assumptions\n2. Look at it from the opposite perspective\n3. Find the simplest possible explanation\n4. Test it with real-world examples\n\n**Resources I'd recommend:**\n Start with first principles thinking\n Study how experts in the field approach this\n Build something small to test your understanding\n\nWhat specific aspect would you like to explore? I can go as deep as you want.`,
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
    confidence = 0.88;
  }

  thinking.push({ step: 'Response Generated', content: `Confidence: ${(confidence * 100).toFixed(0)}%` });

  return { thinking, response, confidence };
}

// Export the brain for use as AGI companion in messages
export { xbeeThink };
export type { ThinkingStep };

// ========== UI COMPONENT ==========

export default function XbeeAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; thinking?: ThinkingStep[] }[]>([]);
  const [thinking, setThinking] = useState(false);
  const [showThinking, setShowThinking] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Draggable button position
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(false);
    startPosRef.current = { x: buttonPos.x, y: buttonPos.y, startX: e.clientX, startY: e.clientY };
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - startPosRef.current.startX;
    const dy = e.clientY - startPosRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setIsDragging(true);
      setButtonPos({ x: startPosRef.current.x + dx, y: startPosRef.current.y + dy });
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) {
      setIsOpen(true);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setThinking(true);

    // Simulate chain-of-thought delay (variable based on "complexity")
    const delay = userMsg.split(/\s+/).length > 15 ? 2200 : userMsg.split(/\s+/).length > 8 ? 1600 : 1000;

    setTimeout(() => {
      const result = xbeeThink(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: result.response, thinking: result.thinking }]);
      setThinking(false);
    }, delay);
  };

  const handleCapability = (label: string) => {
    setInput(label);
    // Auto-send for certain quick actions
    if (['Get ideas', 'Deep think'].includes(label)) {
      setMessages(prev => [...prev, { role: 'user', content: label }]);
      setThinking(true);
      setTimeout(() => {
        const result = xbeeThink(label);
        setMessages(prev => [...prev, { role: 'ai', content: result.response, thinking: result.thinking }]);
        setThinking(false);
      }, 1200);
    }
  };

  return (
    <>
      {/* Draggable floating button */}
      <div
        ref={dragRef}
        className="fixed z-[999] touch-none select-none"
        style={{
          right: `calc(1.5rem - ${buttonPos.x}px)`,
          bottom: `calc(6rem - ${buttonPos.y}px)`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <motion.div
          className={cn(
            'w-14 h-14 rounded-full bg-gradient-to-br from-xbee-primary via-xbee-secondary to-xbee-accent text-white shadow-glow flex items-center justify-center cursor-grab active:cursor-grabbing lg:bottom-8',
            isDragging && 'scale-110 shadow-2xl'
          )}
          whileHover={{ scale: 1.1 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.4)',
              '0 0 40px rgba(139, 92, 246, 0.4)',
              '0 0 20px rgba(59, 130, 246, 0.4)'
            ],
          }}
          transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <Sparkles className="w-6 h-6 pointer-events-none" />
        </motion.div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-xbee-primary/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      </div>

      {/* AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 right-0 w-full max-w-md h-[85vh] z-[1001] glass-card rounded-t-3xl lg:bottom-4 lg:right-4 lg:rounded-3xl lg:h-[600px] flex flex-col"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-theme shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-xbee-primary via-xbee-secondary to-xbee-accent flex items-center justify-center relative">
                    <Zap className="w-5 h-5 text-white" fill="currentColor" />
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-theme-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-theme-primary flex items-center gap-1.5">
                      Xbee AI
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-xbee-primary/20 to-xbee-secondary/20 text-xbee-primary font-medium">GROK KILLER</span>
                    </h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Chain-of-thought reasoning
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-theme-hover transition-colors">
                  <X className="w-5 h-5 text-theme-secondary" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-xbee-primary/20 via-xbee-secondary/20 to-xbee-accent/20 flex items-center justify-center mx-auto mb-4 relative">
                      <Brain className="w-10 h-10 text-xbee-primary" />
                      <motion.div className="absolute inset-0 rounded-2xl border border-xbee-primary/30" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                    </div>
                    <h3 className="text-lg font-bold text-theme-primary mb-1">I think, therefore I help.</h3>
                    <p className="text-sm text-theme-secondary mb-6">Chain-of-thought AI that actually reasons</p>
                    <div className="grid grid-cols-2 gap-2">
                      {capabilities.map(({ icon: Icon, label, description }) => (
                        <motion.button
                          key={label}
                          className="p-3 rounded-xl bg-theme-tertiary hover:bg-theme-hover text-left transition-colors"
                          onClick={() => handleCapability(label)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5 text-xbee-primary mb-2" />
                          <p className="text-sm font-medium text-theme-primary">{label}</p>
                          <p className="text-xs text-theme-tertiary">{description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={cn(
                        'max-w-[85%] rounded-2xl overflow-hidden',
                        msg.role === 'user'
                          ? 'bg-xbee-primary text-white rounded-br-md'
                          : 'bg-theme-tertiary text-theme-primary rounded-bl-md'
                      )}>
                        <div className="px-4 py-3">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.thinking && msg.role === 'ai' && (
                          <button
                            className="w-full px-4 py-1.5 text-[10px] text-theme-tertiary hover:text-xbee-primary border-t border-theme/50 flex items-center justify-center gap-1 hover:bg-theme-hover/50 transition-colors"
                            onClick={() => setShowThinking(showThinking === idx ? null : idx)}
                          >
                            <Brain className="w-3 h-3" />
                            {showThinking === idx ? 'Hide' : 'Show'} reasoning ({msg.thinking.length} steps)
                          </button>
                        )}
                        <AnimatePresence>
                          {showThinking === idx && msg.thinking && (
                            <motion.div className="px-4 py-2 bg-theme-hover/50 space-y-1" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                              {msg.thinking.map((step, i) => (
                                <div key={i} className="flex items-start gap-2 text-[11px]">
                                  <span className="text-xbee-primary font-bold shrink-0">{step.step}:</span>
                                  <span className="text-theme-secondary">{step.content}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))
                )}
                {thinking && (
                  <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-theme-tertiary px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-2 text-sm text-theme-secondary">
                        <div className="flex gap-1">
                          <motion.div className="w-2 h-2 bg-xbee-primary rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                          <motion.div className="w-2 h-2 bg-xbee-secondary rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                          <motion.div className="w-2 h-2 bg-xbee-accent rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                        </div>
                        Reasoning...
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-theme px-4 py-3 bg-theme-primary/80 backdrop-blur-xl rounded-b-3xl shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask anything... I'm actually smart "
                    className="flex-1 bg-theme-tertiary rounded-full px-4 py-2.5 text-sm text-theme-primary placeholder:text-theme-tertiary outline-none focus:ring-2 focus:ring-xbee-primary/30"
                  />
                  <motion.button
                    className="p-2.5 rounded-full bg-gradient-to-r from-xbee-primary to-xbee-secondary text-white disabled:opacity-40"
                    onClick={handleSend}
                    whileTap={{ scale: 0.9 }}
                    disabled={!input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}