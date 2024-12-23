// Import the necessary modules
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env["REPLICATE_API_KEY"],
});

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export const dynamic = "force-dynamic";

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      // console.log(value, done);
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value.toString());
      }
    },
  });
}

const input = {
  min_tokens: 512,
  max_tokens: 3000,
  system_prompt: "You are a helpful assistant, specializing in smart contract auditing",
  prompt_template: `
    <|begin_of_text|><|start_header_id|>system<|end_header_id|>

    {system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>

    {prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

  `,
};

export async function POST(request: Request) {
  if (request.method === "POST") {
    const data = await request.json();
    const { text, prompt } = data;
    if (!text || !prompt) {
      return NextResponse.json({ error: "Must provide input" }, { status: 400 });
    }

    // Insert the code text into the audit prompt
    const auditPrompt = prompt.replace("```\n\n```", `\`\`\`\n${text}\n\`\`\``);

    const inputUse = {
      ...input,
      prompt: auditPrompt,
    };

    try {
      const iterator = replicate.stream("meta/meta-llama-3-70b-instruct", {
        input: inputUse,
      });
      const stream = iteratorToStream(iterator);

      return new Response(stream, {
        headers: {
          "Access-Control-Allow-Origin": "app.certaik.xyz", // Replace with your client domain
        },
      });
    } catch (error) {
      console.error("Error during model call:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
