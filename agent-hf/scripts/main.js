import { HfAgent, LLMFromHub, defaultTools } from 'https://cdn.jsdelivr.net/npm/@huggingface/agents@latest/+esm';

const HF_TOKEN = 'hf***';
const agent = new HfAgent(
  HF_TOKEN, 
  LLMFromHub(HF_TOKEN, "HuggingFaceH4/zephyr-7b-beta"), 
  [...defaultTools]
);

export async function runAgentTask() {
  const code = await agent.generateCode("Draw a picture of a cat wearing a top hat. Then caption the picture and read it out loud.");
  console.log(code);
  const messages = await agent.evaluateCode(code);
  console.log(messages);
  // Or run directly with: await agent.run("Draw a picture...");
}
