import { tool } from "langchain";
import { z } from "zod";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { OllamaEmbeddings } from "@langchain/ollama";

let vectorStore;

const getVectorStore = async () => {
  if (vectorStore) return vectorStore;

  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX;

  if (!apiKey) {
    throw new Error("Missing PINECONE_API_KEY");
  }

  if (!indexName) {
    throw new Error("Missing PINECONE_INDEX");
  }

  const pc = new PineconeClient({ apiKey });
  const index = pc.Index(indexName);

  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex: index
    }
  );
  
  return vectorStore;
};

export const searchKnowledgeBase = tool(
  async ({ query }) => {
    console.log(`🔍 Agent is searching Pinecone for: "${query}"`);

    const store = await getVectorStore();

    const results = await store.similaritySearch(query, 10);

console.log("RESULT COUNT:", results.length);

results.forEach((r, i) => {
  console.log(`Result ${i+1}:`, r.pageContent.slice(0,100));
});

    if (!results || results.length === 0) {
      return "No information found in the knowledge base.";
    }

    results.forEach((r, i) => {
      console.log(`Result ${i + 1}:`, r.pageContent.slice(0, 200));
    });

    const context = results.map((doc) => doc.pageContent).join("\n\n");

    return `Use the following context to answer the question:

${context}`;
  },
  {
    name: "search_knowledge_base",
    description:
      "Searches the internal knowledge base for information from uploaded PDF documents.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);
