import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph-checkpoint";
import { searchKnowledgeBase } from "./tools.js";

const checkpointer = new MemorySaver();

export async function runAgent({ sessionId = "default", message }) {
  try {
    const model = new ChatOllama({
      model: "llama3.1",
      temperature: 0,
    });

    const agent = createAgent({
      model,
      tools: [searchKnowledgeBase],
      checkpointer,
      recursionLimit: 50,
      systemPrompt: `
You are an AI assistant that answers questions using a knowledge base.

When the user asks a question:
1. ALWAYS search the knowledge base using the search_knowledge_base tool.
2. Use the returned context to answer.
3. If the information is not found, say:
"I couldn't find information about this in the uploaded documents."

Be concise and accurate.
`,
    });

    console.log(`🤖 Running agent for: "${message}"`);

    const response = await agent.invoke(
      {
        messages: [{ role: "user", content: message }],
      },
      {
        configurable: {
          thread_id: sessionId,
        },
      }
    );

    const lastMessage = response.messages[response.messages.length - 1];
    const output = lastMessage?.content || "";

    console.log(`✅ Agent response: ${output.slice(0, 100)}...`);

    return { output };
  } catch (error) {
    console.error("❌ Error in runAgent:", error);
    throw error;
  }
}
