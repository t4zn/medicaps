# AI Tutor Setup Guide

## 🤖 AI Integration for Your Notes Website

Your website now includes a subject-specific AI tutor that appears as a fourth tab alongside Notes, PYQs, and Formula Sheets.

## ✨ Features Added

- **Subject-Aware Chat**: AI knows the current subject, program, and year
- **Clean Chat Interface**: Modern chat UI with message history
- **Strict Educational Focus**: Only responds to subject-specific educational queries
- **User Authentication**: Only logged-in users can access the AI tutor
- **Real-time Chat**: Instant responses with loading states

## 🚀 Quick Setup

### Option 1: Groq Integration (Recommended - Fast & Free)

1. Get a Groq API key from [Groq Console](https://console.groq.com/keys)
2. Add to your `.env.local`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
3. Restart your development server

**Why Groq?**
- **Lightning Fast**: Responses in milliseconds
- **Free Tier**: Generous free usage limits
- **Llama 3.3 70B**: Latest and most advanced model for educational content
- **Reliable**: High uptime and consistent performance

### Option 2: Other AI Services

Replace the API call in `app/api/ai/chat/route.ts` with:
- **OpenAI GPT-4**: Premium option with excellent educational responses
- **Anthropic Claude**: Great for detailed explanations
- **Google Gemini**: Good alternative with competitive pricing

### Option 3: Fallback Response (Current)

The system shows an educational fallback response when no API key is configured. Perfect for demos!

## 🎯 Hackathon Impact

This feature will impress judges because:

1. **Practical AI Integration**: Not just a gimmick, actually useful for students
2. **Context Awareness**: AI knows exactly what subject the user is studying
3. **Seamless UX**: Integrated naturally into existing workflow
4. **Educational Value**: Helps students learn more effectively

## 🔧 Strict Educational Boundaries

### AI Tutor Limitations (By Design)
The AI tutor is **strictly limited** to educational content for the specific subject:

**✅ Will Answer:**
- Subject concepts and theories
- Problem-solving steps
- Study strategies and exam prep
- Practical applications
- Assignment help

**❌ Will Refuse:**
- Questions about other subjects
- Personal advice unrelated to the subject
- General life questions
- Current events or politics
- Medical/legal/financial advice
- Casual conversation

### Customize the Prompt
Edit the `systemPrompt` in `app/api/ai/chat/route.ts` to:
- Add subject-specific knowledge
- Include curriculum-specific content
- Reference textbooks or materials
- Add institution-specific guidelines

### Add More Features
- **File Upload**: Let users upload PDFs to chat about
- **Study Plans**: AI generates personalized study schedules
- **Quiz Generation**: Create practice questions from chat history
- **Progress Tracking**: Monitor learning progress

## 💡 Demo Tips

1. **Show Context Awareness**: Ask "What topics are covered in this subject?"
2. **Demonstrate Problem Solving**: Ask for step-by-step solutions
3. **Highlight Integration**: Show how it fits naturally with notes and PYQs
4. **Emphasize Personalization**: Different responses for different subjects/programs

## 🚀 Next Steps

1. Add your AI API key for real responses
2. Customize the system prompt for better subject knowledge
3. Consider adding file upload to chat about specific documents
4. Add analytics to track AI usage and popular questions

Your AI tutor is ready to help students succeed! 🎓