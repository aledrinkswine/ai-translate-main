import type { FromLanguage, Language } from '../../shared/type'

interface Props {
  fromLanguage: FromLanguage
  toLanguage: Language
  text: string
}

export async function requestTranslate({ fromLanguage, toLanguage, text }: Props) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fromLanguage,
      toLanguage,
      text,
    }),
  })

  if (!res.ok) throw new Error('Error al traducir')

  const data = await res.json()
  return data.translatedText
}
