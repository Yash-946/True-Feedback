import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
export const runtime = 'edge';


export async function POST(req: Request) {

  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const questionsArray = text.split('||').map(question => question.trim());

    // console.log(questionsArray[0],questionsArray[1],questionsArray[2]);
    // const encoder = new TextEncoder();

    return Response.json({
      success: true,
      message: questionsArray
    }, { status: 200 })

  } catch (error) {
    console.error("Error generating content:", error);
    return Response.json({
      success: false,
      message: "Failed to generate content"
    }, { status: 500 })
  }
}
