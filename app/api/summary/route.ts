import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { tools, savings } = body;

    const prompt = `
You are an AI financial optimization assistant.

Generate a short professional AI spend audit summary.

Tools:
${JSON.stringify(tools)}

Monthly Savings:
$${savings}

Keep response under 100 words.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return Response.json({
      summary:
        completion.choices[0].message.content,
    });

  } catch (error) {

    return Response.json({
      summary:
        "Your AI stack shows optimization opportunities. Consider reducing unused seats and switching to lower-cost plans for improved operational efficiency.",
    });

  }

}