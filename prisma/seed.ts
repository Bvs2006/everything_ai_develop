import { PrismaClient, Difficulty, Pricing, ToolCategory, TemplateCategory } from "@prisma/client";

const prisma = new PrismaClient();

// NOTE: this seed ships a representative slice of each content type (enough
// to exercise every page, filter, and relation). Extend each array to reach
// the full MVP target counts (20 frameworks / 20 SDKs / 30 tools / 10
// templates / 10 articles) — the shape is identical, so it's copy-paste work.

const FRAMEWORKS = [
  { name: "LangChain", language: "Python", difficulty: Difficulty.INTERMEDIATE, stars: 92000, tags: ["orchestration", "agents"], docsUrl: "https://python.langchain.com", githubUrl: "https://github.com/langchain-ai/langchain", description: "A framework for composing LLM calls, tools, and memory into chains and agents." },
  { name: "LangGraph", language: "Python", difficulty: Difficulty.ADVANCED, stars: 8000, tags: ["agents", "orchestration"], docsUrl: "https://langchain-ai.github.io/langgraph/", githubUrl: "https://github.com/langchain-ai/langgraph", description: "A low-level library for building stateful, multi-actor agent graphs." },
  { name: "LlamaIndex", language: "Python", difficulty: Difficulty.INTERMEDIATE, stars: 36000, tags: ["rag", "indexing"], docsUrl: "https://docs.llamaindex.ai", githubUrl: "https://github.com/run-llama/llama_index", description: "A data framework for connecting custom data sources to large language models." },
  { name: "CrewAI", language: "Python", difficulty: Difficulty.BEGINNER, stars: 20000, tags: ["agents", "multi-agent"], docsUrl: "https://docs.crewai.com", githubUrl: "https://github.com/joaomdmoura/crewAI", description: "A framework for orchestrating role-playing, autonomous AI agents." },
  { name: "AutoGen", language: "Python", difficulty: Difficulty.ADVANCED, stars: 33000, tags: ["multi-agent", "microsoft"], docsUrl: "https://microsoft.github.io/autogen/", githubUrl: "https://github.com/microsoft/autogen", description: "A framework from Microsoft for building multi-agent conversational systems." },
  { name: "Agno", language: "Python", difficulty: Difficulty.INTERMEDIATE, stars: 6000, tags: ["agents", "lightweight"], docsUrl: "https://docs.agno.com", githubUrl: "https://github.com/agno-agi/agno", description: "A lightweight framework for building fast, model-agnostic AI agents." },
  { name: "PydanticAI", language: "Python", difficulty: Difficulty.BEGINNER, stars: 7000, tags: ["type-safety", "agents"], docsUrl: "https://ai.pydantic.dev", githubUrl: "https://github.com/pydantic/pydantic-ai", description: "A type-safe agent framework built by the Pydantic team." },
];

const SDKS = [
  { name: "OpenAI SDK", language: "Python", overview: "Official client library for the OpenAI API.", installation: "pip install openai", features: ["Chat completions", "Embeddings", "Function calling", "Streaming"], exampleCode: "from openai import OpenAI\nclient = OpenAI()\nresp = client.chat.completions.create(model='gpt-4', messages=[...])", docsUrl: "https://platform.openai.com/docs", githubUrl: "https://github.com/openai/openai-python", tags: ["llm", "api"] },
  { name: "Anthropic SDK", language: "Python", overview: "Official client library for the Anthropic Claude API.", installation: "pip install anthropic", features: ["Messages API", "Tool use", "Streaming", "Vision"], exampleCode: "import anthropic\nclient = anthropic.Anthropic()\nmsg = client.messages.create(model='claude-sonnet-4-6', ...)", docsUrl: "https://docs.claude.com", githubUrl: "https://github.com/anthropics/anthropic-sdk-python", tags: ["llm", "api"] },
  { name: "IBM watsonx.ai SDK", language: "Python", overview: "SDK for IBM's watsonx.ai foundation model platform, including Granite models.", installation: "pip install ibm-watsonx-ai", features: ["Granite model access", "Prompt tuning", "Deployment management"], exampleCode: "from ibm_watsonx_ai.foundation_models import Model\nmodel = Model(model_id='ibm/granite-13b-chat-v2', ...)", docsUrl: "https://ibm.github.io/watsonx-ai-python-sdk/", githubUrl: "https://github.com/IBM/watsonx-ai-python-sdk", tags: ["ibm", "granite"] },
  { name: "Hugging Face Transformers", language: "Python", overview: "The standard library for downloading and running open-source model weights.", installation: "pip install transformers", features: ["Model hub access", "Pipelines", "Fine-tuning", "Tokenizers"], exampleCode: "from transformers import pipeline\ngen = pipeline('text-generation', model='gpt2')", docsUrl: "https://huggingface.co/docs/transformers", githubUrl: "https://github.com/huggingface/transformers", tags: ["open-source", "models"] },
];

const TOOLS = [
  { name: "Cursor", category: ToolCategory.IDE, pricing: Pricing.FREEMIUM, description: "An AI-native code editor built as a fork of VS Code.", website: "https://cursor.com", tags: ["editor"] },
  { name: "GitHub Copilot", category: ToolCategory.CODING_ASSISTANT, pricing: Pricing.PAID, description: "AI pair programmer integrated into popular IDEs.", website: "https://github.com/features/copilot", tags: ["autocomplete"] },
  { name: "IBM Granite", category: ToolCategory.MODELS, pricing: Pricing.FREE, description: "Open-source foundation models from IBM optimized for enterprise use.", website: "https://www.ibm.com/granite", tags: ["ibm", "open-source"] },
  { name: "OpenAI API", category: ToolCategory.APIS, pricing: Pricing.PAID, description: "Hosted API access to GPT models for text, vision, and audio.", website: "https://platform.openai.com", tags: ["api"] },
  { name: "Tesseract OCR", category: ToolCategory.OCR, pricing: Pricing.FREE, description: "Open-source OCR engine for extracting text from images and scans.", website: "https://github.com/tesseract-ocr/tesseract", tags: ["open-source"] },
  { name: "Vercel", category: ToolCategory.DEPLOYMENT, pricing: Pricing.FREEMIUM, description: "Deployment platform with first-class Next.js support.", website: "https://vercel.com", tags: ["hosting", "nextjs"] },
  { name: "Neon", category: ToolCategory.DATABASE, pricing: Pricing.FREEMIUM, description: "Serverless Postgres with branching, built for modern app deployment.", website: "https://neon.tech", tags: ["postgres", "serverless"] },
  { name: "Pinecone", category: ToolCategory.VECTOR_DATABASE, pricing: Pricing.FREEMIUM, description: "Managed vector database for semantic search and RAG applications.", website: "https://www.pinecone.io", tags: ["rag", "embeddings"] },
  { name: "LangSmith", category: ToolCategory.MONITORING, pricing: Pricing.FREEMIUM, description: "Observability and evaluation platform for LLM applications.", website: "https://smith.langchain.com", tags: ["observability"] },
  { name: "Railway", category: ToolCategory.HOSTING, pricing: Pricing.FREEMIUM, description: "Infrastructure platform for deploying apps, databases, and cron jobs.", website: "https://railway.app", tags: ["hosting"] },
];

const TEMPLATES = [
  { name: "AI Chatbot Starter", category: TemplateCategory.AI_CHATBOT, description: "A streaming chat UI backed by a model provider of your choice.", folderStructure: "app/\n  api/chat/route.ts\n  page.tsx\ncomponents/\n  chat-window.tsx\nlib/\n  model-client.ts", recommendedStack: ["Next.js", "Vercel AI SDK", "Tailwind CSS"] },
  { name: "RAG Application", category: TemplateCategory.RAG_APPLICATION, description: "Document ingestion, embedding, and retrieval-augmented chat.", folderStructure: "ingest/\n  loader.py\n  embed.py\napi/\n  query.py\nvectorstore/\n  pinecone_client.py", recommendedStack: ["LlamaIndex", "Pinecone", "FastAPI"] },
  { name: "AI Agent Scaffold", category: TemplateCategory.AI_AGENT, description: "A single-agent scaffold with tool-calling and memory.", folderStructure: "agent/\n  main.py\n  tools/\n  memory.py", recommendedStack: ["LangGraph", "PydanticAI"] },
  { name: "AI Workflow Automation", category: TemplateCategory.AI_WORKFLOW, description: "Multi-step workflow chaining model calls with external APIs.", folderStructure: "workflows/\n  pipeline.py\nsteps/\n  extract.py\n  transform.py\n  load.py", recommendedStack: ["LangChain", "Langflow"] },
  { name: "Document Chat", category: TemplateCategory.DOCUMENT_CHAT, description: "Upload a document and chat with its contents.", folderStructure: "app/\n  upload/\n  chat/\nlib/\n  pdf-parser.ts", recommendedStack: ["Next.js", "LlamaIndex", "pgvector"] },
  { name: "Code Assistant", category: TemplateCategory.CODE_ASSISTANT, description: "A repo-aware coding assistant with file search and diffs.", folderStructure: "assistant/\n  index.ts\n  repo-search.ts\n  diff-apply.ts", recommendedStack: ["TypeScript", "tree-sitter", "OpenAI API"] },
];

const ARTICLES = [
  { title: "Choosing between LangChain and LangGraph", category: "Frameworks", excerpt: "A practical comparison for teams building agentic applications.", contentMdx: "## Overview\n\nBoth frameworks come from the same team but solve different problems...\n\n## When to use LangChain\n\nLangChain suits linear chains and simpler RAG pipelines.\n\n## When to use LangGraph\n\nLangGraph suits stateful, multi-actor agent systems that need explicit control flow.", tags: ["langchain", "langgraph"] },
  { title: "Building your first RAG pipeline", category: "RAG", excerpt: "Step-by-step guide from document ingestion to answer generation.", contentMdx: "## Step 1: Ingest\n\nLoad and chunk your documents...\n\n## Step 2: Embed\n\nGenerate embeddings and store them in a vector database...\n\n## Step 3: Retrieve & generate\n\nQuery the vector store and pass retrieved context to your model.", tags: ["rag", "tutorial"] },
];

async function main() {
  console.log("Seeding categories & tags...");
  const catNames = ["Orchestration", "Agents", "RAG", "Multi-agent"];
  for (const name of catNames) {
    await prisma.category.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: { name, slug: name.toLowerCase() },
    });
  }

  const allTagNames = new Set<string>();
  [...FRAMEWORKS, ...SDKS, ...TOOLS, ...ARTICLES].forEach((item) =>
    item.tags.forEach((t) => allTagNames.add(t))
  );
  for (const name of allTagNames) {
    await prisma.tag.upsert({
      where: { slug: name },
      update: {},
      create: { name, slug: name },
    });
  }

  console.log("Seeding frameworks...");
  for (const fw of FRAMEWORKS) {
    const slug = fw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.framework.upsert({
      where: { slug },
      update: {},
      create: {
        name: fw.name,
        slug,
        description: fw.description,
        language: fw.language,
        difficulty: fw.difficulty,
        stars: fw.stars,
        docsUrl: fw.docsUrl,
        githubUrl: fw.githubUrl,
        tags: { connect: fw.tags.map((t) => ({ slug: t })) },
      },
    });
  }

  console.log("Seeding SDKs...");
  for (const sdk of SDKS) {
    const slug = sdk.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.sdk.upsert({
      where: { slug },
      update: {},
      create: {
        name: sdk.name,
        slug,
        overview: sdk.overview,
        installation: sdk.installation,
        features: sdk.features,
        exampleCode: sdk.exampleCode,
        docsUrl: sdk.docsUrl,
        githubUrl: sdk.githubUrl,
        language: sdk.language,
        tags: { connect: sdk.tags.map((t) => ({ slug: t })) },
      },
    });
  }

  console.log("Seeding tools...");
  for (const tool of TOOLS) {
    const slug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.tool.upsert({
      where: { slug },
      update: {},
      create: {
        name: tool.name,
        slug,
        category: tool.category,
        pricing: tool.pricing,
        description: tool.description,
        website: tool.website,
        tags: { connect: tool.tags.map((t) => ({ slug: t })) },
      },
    });
  }

  console.log("Seeding templates...");
  for (const t of TEMPLATES) {
    const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.template.upsert({
      where: { slug },
      update: {},
      create: {
        name: t.name,
        slug,
        category: t.category,
        description: t.description,
        folderStructure: t.folderStructure,
        recommendedStack: t.recommendedStack,
      },
    });
  }

  console.log("Seeding a demo admin user + articles...");
  const admin = await prisma.user.upsert({
    where: { email: "admin@everythingaidevelop.dev" },
    update: {},
    create: {
      email: "admin@everythingaidevelop.dev",
      name: "Admin",
      role: "ADMIN",
      profile: {
        create: { username: "admin", bio: "Platform administrator.", skills: [], interests: [] },
      },
    },
  });

  for (const a of ARTICLES) {
    const slug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        title: a.title,
        slug,
        excerpt: a.excerpt,
        contentMdx: a.contentMdx,
        category: a.category,
        readingTimeMin: Math.max(1, Math.round(a.contentMdx.split(" ").length / 200)),
        authorId: admin.id,
        tags: { connect: a.tags.map((t) => ({ slug: t })) },
      },
    });
  }

  console.log("Seeding community groups...");
  const groups = ["LLM Developers", "MCP Builders", "AI Agents", "Open Source Contributors", "AI Researchers"];
  for (const name of groups) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.group.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description: `A group for ${name.toLowerCase()}.`, category: "general" },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
