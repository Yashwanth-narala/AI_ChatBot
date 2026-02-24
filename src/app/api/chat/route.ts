import { NextRequest, NextResponse } from "next/server"

type ChatRole = "system" | "user" | "assistant"

interface ChatMessage {
  role: ChatRole
  content: string
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY. Add it to your .env.local file." },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : []
    const context = typeof body?.context === "string" ? body.context : null

    const payloadMessages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful study assistant for middle-school history students. Use the provided context from the chapter when available. Keep answers clear, structured, and easy to understand. If the user asks to 'explain' or to 'explain like I'm five', give a slow, step-by-step explanation in full sentences, using simple analogies and short paragraphs, not just key points. Only use bullet points when the user explicitly asks to list or summarize. IMPORTANT FORMATTING RULES:\n\n1. For SUMMARIZE requests: Write responses as flowing prose paragraphs WITHOUT any numbering or bullet points. Do NOT include numbers like '1.', '2.', etc. Just write natural paragraphs.\n\n2. For QUESTIONS requests: ALWAYS format each question on a completely separate line with blank lines between them. Each question must start with a number (1., 2., 3., etc.) on its own line, followed by the question text. NEVER put multiple questions on the same line.\n\n3. CRITICAL: When the user provides selected text or specific context and asks for questions - ONLY generate questions from that provided text. Do NOT use general knowledge or information outside the provided text. Base all questions ONLY on what is explicitly stated in the selected/provided text.",
      },
      ...(context
        ? [
            {
              role: "system" as const,
              content: `Context from the textbook or notes:\n\n${context}`,
            },
          ]
        : []),
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: payloadMessages,
        temperature: 1.2,
        top_p: 0.95,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", errorText)
      return NextResponse.json(
        {
          error: "OpenAI API error",
          details: errorText,
        },
        { status: 500 }
      )
    }

    const data = await response.json()
    let content =
      data?.choices?.[0]?.message?.content ??
      "I'm sorry, I couldn't generate a response. Please try asking again."

    // Check if the request was for questions or summarize
    const isQuestionRequest = messages.some((m) =>
      /question|quiz|practice|check.*understanding|ask.*question/i.test(m.content)
    )

    // Format only if it's a question request
    if (isQuestionRequest) {
      content = formatResponseWithLineBreaks(content)
    } else {
      // For summarize requests, remove any numbering
      content = removeNumbering(content)
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Chat route error:", error)
    return NextResponse.json(
      { error: "Unexpected error while generating AI response." },
      { status: 500 }
    )
  }
}

function removeNumbering(content: string): string {
  // Remove numbering like "1. " at the start of lines, keeping just the text
  content = content.replace(/^\d+\.\s+/gm, "")
  return content.trim()
}

function formatResponseWithLineBreaks(content: string): string {
  // Split content by numbered question pattern (e.g., 1. 2. 3.)
  const parts = content.split(/(?=\d+\.\s)/g)

  // Clean and format each part
  const formatted = parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n")

  return formatted.trim()
}

