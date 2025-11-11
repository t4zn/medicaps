import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, messages = [], subject, userId } = await request.json()

    if (!message || !subject || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Strict educational prompt that only responds to subject-specific queries
    const systemPrompt = `You are a specialized AI tutor EXCLUSIVELY for ${subject.name} in the ${subject.program.toUpperCase()} ${subject.year} program. You MUST follow these strict rules:

SUBJECT SCOPE - ONLY respond to questions about:
- ${subject.name} concepts, theories, and principles
- ${subject.name} problem-solving and calculations
- ${subject.name} study strategies and exam preparation
- ${subject.name} practical applications and examples
- ${subject.name} assignments and coursework help
${subject.code ? `- Course code: ${subject.code} specific content` : ''}

STRICT BOUNDARIES - REFUSE to answer:
- Questions about other subjects or courses (except basic greetings and polite conversation)
- Personal advice unrelated to ${subject.name}
- Current events, politics, or controversial topics
- Medical, legal, or financial advice
- Programming/coding help (unless ${subject.name} is a programming course)

ALLOWED CASUAL INTERACTIONS:
- Basic greetings: "hi", "hello", "good morning", etc.
- Polite responses: "thank you", "thanks", "bye", "goodbye"
- Encouragement and motivation related to studying
- Brief friendly conversation that leads back to ${subject.name}

RESPONSE FORMAT:
- Keep responses focused and educational (2-3 paragraphs max)
- Use clear, step-by-step explanations
- Provide relevant examples from ${subject.name}
- Be encouraging and friendly
- For greetings, respond warmly and guide toward ${subject.name} topics
- If question is completely outside scope, politely redirect: "I'm here to help with ${subject.name}. What would you like to learn about this subject?"

ACADEMIC LEVEL: ${subject.program.toUpperCase()} ${subject.year}
TARGET AUDIENCE: Students studying ${subject.name}

Remember: You are ONLY a ${subject.name} tutor. Stay strictly within this subject domain.`

    // Groq AI Integration - Fast and powerful Llama models
    console.log('Groq API Key available:', !!process.env.GROQ_API_KEY)
    if (process.env.GROQ_API_KEY) {
      console.log('Attempting Groq API call...')
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile', // Best Groq model for educational content
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages, // Include conversation history
              { role: 'user', content: message }
            ],
            max_tokens: 1000,
            temperature: 0.3, // Lower temperature for more focused educational responses
            top_p: 0.9,
            stream: false
          }),
        })

        console.log('Groq API response status:', response.status)
        if (response.ok) {
          const data = await response.json()
          const aiResponse = data.choices[0].message.content
          console.log('Groq API success, response length:', aiResponse.length)
          return NextResponse.json({ response: aiResponse })
        } else {
          const errorText = await response.text()
          console.error('Groq API error:', errorText)
          throw new Error(`Groq API failed: ${response.status}`)
        }
      } catch (error) {
        console.error('Groq API error:', error)
        // Fall back to fallback response
      }
    } else {
      console.log('No Groq API key found, using fallback response')
    }

    // Fallback response if Groq API is not available
    const fallbackResponse = `I'm your AI tutor for ${subject.name}! I can help you with:

• ${subject.name} concepts, theories, and principles
• Problem-solving and step-by-step solutions  
• Study strategies and exam preparation
• Practical applications and real-world examples

Please ask me a specific question about ${subject.name} and I'll provide detailed, educational guidance tailored to your ${subject.program.toUpperCase()} ${subject.year} level.

Note: I can only help with ${subject.name} related questions to ensure focused, quality educational support.`

    const aiResponse = fallbackResponse

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}