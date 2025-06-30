import { NextResponse } from "next/server";

const CHATBOT_API_URL = process.env.CHATBOT_API_URL;

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    if (!message?.trim()) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.trim() }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get response from chatbot');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
