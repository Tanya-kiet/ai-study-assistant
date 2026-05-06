export type QuizQuestion = {
  question: string
  options: string[]
  answer: string
}

function stripCodeFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
}

function parseModelJson(content: string): unknown {
  const trimmed = content.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    try {
      return JSON.parse(stripCodeFences(trimmed))
    } catch {
      const start = trimmed.indexOf('[')
      const end = trimmed.lastIndexOf(']')
      if (start !== -1 && end > start) {
        return JSON.parse(trimmed.slice(start, end + 1))
      }
      const oStart = trimmed.indexOf('{')
      const oEnd = trimmed.lastIndexOf('}')
      if (oStart !== -1 && oEnd > oStart) {
        return JSON.parse(trimmed.slice(oStart, oEnd + 1))
      }
      throw new Error('Invalid JSON from model')
    }
  }
}

function normalizeQuestions(rawList: QuizQuestion[]): QuizQuestion[] {
  const out: QuizQuestion[] = []
  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue
    const q =
      typeof (item as QuizQuestion).question === 'string' ? (item as QuizQuestion).question.trim() : ''
    const opts = Array.isArray((item as QuizQuestion).options)
      ? (item as QuizQuestion).options.map((o) => String(o).trim()).filter(Boolean)
      : []
    const rawAnswer =
      typeof (item as QuizQuestion).answer === 'string'
        ? (item as QuizQuestion).answer.trim()
        : ''
    if (!q || opts.length !== 4) continue

    const matched =
      opts.find((o) => o === rawAnswer) ??
      opts.find((o) => o.toLowerCase() === rawAnswer.toLowerCase())
    if (!matched) continue

    out.push({ question: q, options: [...opts], answer: matched })
    if (out.length >= 5) break
  }
  return out
}

/** Demo-only: browser exposes the key via network tab. Prefer a backend proxy in production. */
export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error(
      'Missing VITE_OPENAI_API_KEY. Create .env.local in the project root with: VITE_OPENAI_API_KEY=sk-...',
    )
  }

  const trimmedTopic = topic.trim()
  if (!trimmedTopic) {
    throw new Error('Topic is empty')
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: `Generate exactly 5 multiple-choice quiz questions about: "${trimmedTopic}".

Return ONLY valid JSON in this shape (root must be an object):
{
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Exactly one option that matches one element of options (same spelling)."
    }
  ]
}

Requirements: exactly 5 items; each question has exactly 4 distinct options; "answer" must equal one option string verbatim.`,
        },
      ],
    }),
  })

  const bodyText = await res.text()

  if (!res.ok) {
    let snippet = bodyText.slice(0, 240)
    try {
      const errJson = JSON.parse(bodyText) as { error?: { message?: string } }
      snippet = errJson.error?.message ?? snippet
    } catch {
      /* keep snippet */
    }
    throw new Error(`OpenAI request failed (${res.status}): ${snippet}`)
  }

  let data: {
    choices?: Array<{ message?: { content?: string | null }; finish_reason?: string }>
  }
  try {
    data = JSON.parse(bodyText) as typeof data
  } catch {
    throw new Error('Invalid response body from OpenAI')
  }

  const content = data.choices?.[0]?.message?.content
  if (!content?.trim()) {
    throw new Error('Empty model response — try again')
  }

  let parsed: unknown
  try {
    parsed = parseModelJson(content)
  } catch {
    throw new Error('Could not parse JSON from the model. Try generating again.')
  }

  let list: QuizQuestion[] = []

  if (Array.isArray(parsed)) {
    list = parsed as QuizQuestion[]
  } else if (parsed && typeof parsed === 'object') {
    const o = parsed as Record<string, unknown>
    const quizArr = o.quiz ?? o.questions ?? o.mcqs ?? o.items
    if (Array.isArray(quizArr)) list = quizArr as QuizQuestion[]
  }

  const normalized = normalizeQuestions(list)

  if (normalized.length !== 5) {
    throw new Error(
      'Model returned incomplete questions. Tap Generate Quiz again.',
    )
  }

  return normalized
}
