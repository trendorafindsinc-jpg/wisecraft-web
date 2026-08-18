import type { Message, ChatSource } from '../../types'

export type ChatRequestMessage = Pick<Message, 'role' | 'content'>

export type ChatSuccess = {
  content: string
  sources: ChatSource[]
}

/**
 * Calls the existing WISECRAFT server endpoint `/api/chat`.
 * Non-streaming: waits for a full JSON response.
 * Real token streaming is not implemented until the backend supports it.
 */
export async function sendChat(
  messages: ChatRequestMessage[]
): Promise<ChatSuccess> {
  let response: Response
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })
  } catch {
    throw new Error('NETWORK_ERROR')
  }

  if (response.status === 429) throw new Error('RATE_LIMIT')

  const data = await response.json().catch(() => ({} as Record<string, unknown>))

  if (!response.ok) {
    const err =
      (data as { error?: string })?.error || `API_ERROR_${response.status}`
    throw new Error(err)
  }

  const content =
    (data as { content?: string }).content ||
    (data as { choices?: { message?: { content?: string } }[] }).choices?.[0]
      ?.message?.content ||
    (data as { response?: string }).response ||
    ''

  if (!content.trim()) {
    throw new Error('EMPTY_RESPONSE')
  }

  const sources =
    (data as { meta?: { sources?: ChatSource[] } }).meta?.sources || []

  return { content: content.trim(), sources }
}
