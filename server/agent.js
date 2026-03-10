import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph-checkpoint";
import { searchKnowledgeBase } from "./tools.js";
import { PineconeStore } from "@langchain/pinecone";

// Create a memory saver for persisting conversation history
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
      systemPrompt:
        `You are a helpful AI assistant.

If the user asks about information that may exist in the uploaded documents,
use the search_knowledge_base tool.

If the question is general knowledge or small talk,
answer directly without using tools.

Only call the tool when necessary.
`,
    });

    console.log(`🤖 Running agent for: "${message}"`);

    // Invoke here has an agentic behavior and it will decide to use the tool or not.
    const response = await agent.invoke(
      {
        messages: [{ role: "user", content: message }],
      },
      {
        configurable: {
          thread_id: sessionId, // This maintains conversation history per session
        },
      }
    );

    // Extract the last message content
    const lastMessage = response.messages[response.messages.length - 1];
    const output = lastMessage?.content || "";

    console.log(`✅ Agent response: ${output.slice(0, 100)}...`);

    return { output };
  } catch (error) {
    console.error("❌ Error in runAgent:", error);
    throw error;
  }
}
