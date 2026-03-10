import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OllamaEmbeddings } from "@langchain/ollama";

export const ingestData = async (filePath) => {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const chunks = await splitter.splitDocuments(docs);

  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.Index(process.env.PINECONE_INDEX);

  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });  const store = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  const BATCH_SIZE = 96;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    await store.addDocuments(batch);
  }
  console.log("✅ Ingestion Complete!");
};
