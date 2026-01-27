import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
// import { GoogleGenerativeAIStream, OpenAIStream, StreamingTextResponse } from 'ai';


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


export async function POST(req: Request) {
    try {
        const prompt = `Create a list of three concise, constructive, and anonymous feedback messages about a developer’s portfolio, formatted as a single string. Each message must be separated by '||'.

These messages are intended for an anonymous feedback platform. They should encourage honest but respectful feedback about a portfolio, projects, skills, or presentation.

Guidelines:
- Keep each message short and clear.
- Avoid personal, sensitive, or offensive language.
- Focus on portfolio quality, clarity, projects, or improvement areas.
- Use a friendly and professional tone.

Example output format:
Your projects look interesting, but which one best represents your strongest skills?||What part of the portfolio do you think needs the most improvement?||Is there anything missing that would help recruiters understand your work better?"
`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                maxOutputTokens: 400,
                temperature: 1.0,
                topP: 0.95,
                topK:40

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


