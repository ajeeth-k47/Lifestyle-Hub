# 🏠 Lifestyle Hub - AI Powered application

A modern lifestyle content hub built with Next.js, featuring AI-powered summarization, semantic search, and intelligent recommendations.

## Features

- **AI Article Summarization** - Automatic concise summaries using Groq AI
- **Semantic Q&A** - Intelligent question answering using RAG architecture
- **Smart Recommendations** - Article recommendation based on user selected article
- **Responsive Design** - Bootstrap-powered responsive interface
- **Headless CMS** - Contentful integration for content management
- **Vector Search** - Pinecone-powered semantic search

## Tech Stack

- **Frontend**: Next.js 14, React, Bootstrap
- **CMS**: Contentful
- **AI**: Groq (Llama 3.1 8B Instant)
- **Vector Database**: Pinecone (multilingual-e5-large)
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Accounts on Contentful, Pinecone, and Groq

## folder structure
  .
├── app/                     # Next.js App directory
│   ├── article/             # Article-specific pages or components
│   ├── ask-ai/              # Qusetion and Answering page powered with smart assistant named Lily
│   ├── globals.css          # Global CSS styles
│   ├── layout.js            # App-wide layout component
│   └── page.js              # Main app entry page (e.g., homepage)
│
├── components/              # Reusable React components
│   └── ...                  # (Components not expanded in this view)
│
├── lib/                     # Utility functions and external service clients
│   ├── ai.js                # functions and api calls to Groq LLM 
│   ├── contentful.js        # Integration with Contentful CMS
│   └── pinecone-client.js   # Pinecone vector DB interaction
│
├── pages/                   # API routes
│   └── api/                 # API endpoints for backend logic
│       ├── rag-ask.js       # RAG (Retrieval-Augmented Generation) query handler
│       ├── recommend.js     # Recommendation engine endpoint
│       └── summarize.js     # Summarization endpoint
│
├── node_modules/            # Node dependencies (auto-managed)
└── ...

## Explanation

- **app**: Contains the main application files, including `article`, `ask-ai`, and home page.
- **components**: Contains the UI components for different sections of the website such as `Articles`, `Home`, and `Layout`.
- **lib**: Holds utility files like `ai.js`, `contentful.js`, and `pinecone-client.js` to interact with external services.
- **pages/api**: Contains the API routes for handling requests like `rag-ask.js`, `recommend.js`, and `summarize.js`.


## 🏃‍♂️ Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd lifestyle-hub
npm install

### 2. Create .env file
Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token

AI Services
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key

### 3. Populate dummy data
populate the contenful with dummy content.
create a index in pincone and store the vector and metadata

### 4. Run the application
npm run dev

## API Endpoints
### 1. Summarization API
POST /api/summarize
Content-Type: application/json
Request Body:
{
  "articleSlug": "your-article-slug"
}

### 2. Ask AI API
POST /api/rag-ask  
Content-Type: application/json
Request Body:
{
  "question": "Your question here"
}

### 3. Recommendation API
POST /api/recommend
Content-Type: application/json
Request Body:
{
  "articleSlug": "your-article-slug"
}
