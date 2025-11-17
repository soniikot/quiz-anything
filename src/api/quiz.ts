import { createServerFn } from '@tanstack/react-start'

export type Question = {
  question: string
  options: Array<string>
  correctAnswer: number
}

export type Quiz = {
  title: string
  questions: Array<Question>
  generatedBy?: 'ai' | 'fallback'
}

export const generateQuizFromUrl = createServerFn({ method: 'POST' })
  .inputValidator((data: { url: string; numberOfQuestions: number }) => data)
  .handler(async ({ data }) => {
    const { url, numberOfQuestions } = data

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch webpage')
      }

      const html = await response.text()

      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 20000)

      const quiz = await generateQuiz(textContent, url, numberOfQuestions)

      return quiz
    } catch (error) {
      throw new Error(
        'Failed to generate quiz: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    }
  })

async function generateQuiz(
  text: string,
  url: string,
  numberOfQuestions: number,
): Promise<Quiz> {
  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    throw new Error(
      'GROQ_API_KEY is not configured. Please add it to your .env file.',
    )
  }

  const prompt = `You are a professional quiz creator. Read this text and create ${numberOfQuestions} high-quality multiple-choice questions that test real comprehension.

TEXT:
${text}

STRICT REQUIREMENTS:
1. Questions must be CLEAR, SPECIFIC, and test actual understanding
2. Each question needs exactly 4 distinct answer options
3. One correct answer, three plausible but wrong distractors
4. NO fill-in-the-blank questions
5. Questions should focus on key facts, concepts, relationships, or conclusions from the text
6. Answer options should be concise (1-2 sentences max each)
7. Vary question types: definitions, causes/effects, comparisons, main ideas, details

QUESTION PATTERNS TO USE:
- "What is [concept] according to the text?"
- "Why does [X] happen?"
- "Which of these best describes [Y]?"
- "What is the main difference between [A] and [B]?"
- "According to the text, what effect does [X] have?"

RETURN ONLY VALID JSON (no markdown, no explanation):
{
  "questions": [
    {
      "question": "Clear, specific question here?",
      "options": ["Concise answer A", "Concise answer B", "Concise answer C", "Concise answer D"],
      "correctAnswer": 0
    }
  ]
}`

  try {
    const aiResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert quiz creator who generates high-quality, clear, and educational multiple-choice questions.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 3000,
        }),
      },
    )

    if (!aiResponse.ok) {
      throw new Error(`Groq API error: ${aiResponse.statusText}`)
    }

    const aiData = await aiResponse.json()
    const aiContent = aiData.choices[0].message.content

    const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      title: `Quiz from ${new URL(url).hostname}`,
      questions: parsed.questions.slice(0, numberOfQuestions),
      generatedBy: 'ai',
    }
  } catch (error) {
    console.error('AI generation failed', error)
    throw new Error(
      'Failed to generate quiz with AI: ' +
        (error instanceof Error ? error.message : 'Unknown error'),
    )
  }
}
