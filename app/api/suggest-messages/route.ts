import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
// import { GoogleGenerativeAIStream, OpenAIStream, StreamingTextResponse } from 'ai';


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


export async function POST(req: Request) {
    try {
        const prompt = `
Create a list of five concise, constructive, and natural-sounding feedback suggestions about a developer’s portfolio.
These messages will be used as quick-select options in an anonymous feedback app, allowing visitors to easily send feedback after viewing the portfolio.

Format the output as a single string, with each message separated by '||'.

Guidelines:
- Keep each message short and clear.
- Use a friendly and professional tone.
- Mix appreciation and constructive suggestions.
- Avoid overly harsh criticism.
- Not all messages should be questions.
- Focus on portfolio quality, project clarity, skills, presentation, or improvement areas.
- Avoid personal, sensitive, or offensive language.

Example output format:
"Your portfolio is well structured, but adding more technical details would make it stronger.||I really liked the project layout and how easy it is to navigate.||Highlighting measurable results could make your work stand out more.||Some sections could benefit from clearer explanations.||It would help to showcase which project best represents your strongest skills."
`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                maxOutputTokens: 400,
                temperature: 1.0,
                topP: 0.95,
                topK: 40

            },

        });
        // for await (const chunk of response) {
        //     return Response.json(chunk.text);
        // }

        console.log("response.text", response.text);
        return NextResponse.json(response.text);

        // const stream = GoogleGenerativeAIStream(response as any);
        // return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('suggest-messages error:', error);
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }

}


