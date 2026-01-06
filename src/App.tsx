import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import {
  SwitchIcon,
  ClipboardIcon,
  SpeakerIcon,
  MicrophoneIcon,
  HeartIcon,
} from './components/Icons.tsx'
import { useStore } from './hooks/useStore.ts'
import { useDebounce } from './hooks/useDebounce.ts'
import { Container, Row, Col, Button, Stack } from 'react-bootstrap'
import { AUTO_LANGUAGE } from '../shared/constants.ts'
import { LanguageSelector } from './components/LanguageSelector.tsx'
import { SectionType } from '../shared/type.d'
import { TextArea } from './components/TextArea.tsx'
import { useEffect } from 'react'
import { requestTranslate } from './services/requestTranslate.ts'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

function App() {
  const {
    fromLanguage,
    fromText,
    toLanguage,
    result,
    loading,
    setFromLanguage,
    setFromText,
    setToLanguage,
    setResult,
    interchangeLanguages,
  } = useStore()

  const devouncedFromText = useDebounce(fromText, 300)

  useEffect(() => {
    if (devouncedFromText === '') {
      setResult('')
      return
    }

    let isCancelled = false

    requestTranslate({ fromLanguage, toLanguage, text: devouncedFromText })
      .then((translatedText) => {
        if (!isCancelled) {
          setResult(translatedText)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setResult('Error')
        }
      })

    return () => {
      isCancelled = true
    }
  }, [devouncedFromText, fromLanguage, toLanguage])

  const handleClipboard = () => {
    navigator.clipboard.writeText(result).catch(() => {})
  }

  const handleSpeak = () => {
    if (!result) return

    const utterance = new SpeechSynthesisUtterance(result)
    utterance.lang = toLanguage.includes('-')
      ? toLanguage
      : `${toLanguage}-${toLanguage.toUpperCase()}`

    const voices = speechSynthesis.getVoices()
    const voice = voices.find((v) => v.lang.startsWith(toLanguage))
    if (voice) utterance.voice = voice

    speechSynthesis.speak(utterance)
  }

  const handleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = fromLanguage.includes('-')
      ? fromLanguage
      : `${fromLanguage}-${fromLanguage.toUpperCase()}`
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setFromText(transcript)
    }

    recognition.start()
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '60px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          zIndex: 101,
        }}
      >
        <span style={{  fontSize: '1.3rem' }}>
          Ai Translator
        </span>
        <a
          href="https://github.com/BeruzDev/ai-translate"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center' }}
          aria-label="GitHub"
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub"
            width={32}
            height={32}
          />
        </a>
      </header>
      <Container fluid>
        <Row>
          <Col>
            <Stack gap={2}>
              <LanguageSelector
                type={SectionType.From}
                value={fromLanguage}
                onChange={setFromLanguage}
              />
              <div style={{ position: 'relative' }}>
                <TextArea
                  type={SectionType.From}
                  value={fromText}
                  onChange={setFromText}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    opacity: 0.5,
                    display: 'flex',
                  }}
                >
                  <Button variant="link" onClick={handleMic}>
                    <MicrophoneIcon />
                  </Button>
                </div>
              </div>
            </Stack>
          </Col>

          <Col xs="auto">
            <Button
              variant="link"
              disabled={fromLanguage === AUTO_LANGUAGE}
              onClick={() => {
                interchangeLanguages()
              }}
            >
              <SwitchIcon />
            </Button>
          </Col>

          <Col>
            <Stack gap={2}>
              <LanguageSelector
                type={SectionType.To}
                value={toLanguage}
                onChange={setToLanguage}
              />
              <div style={{ position: 'relative' }}>
                <TextArea
                  type={SectionType.To}
                  value={result}
                  onChange={setResult}
                  loading={loading}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    opacity: 0.5,
                    display: 'flex',
                  }}
                >
                  <Button variant="link" onClick={handleClipboard}>
                    <ClipboardIcon />
                  </Button>

                  <Button variant="link" onClick={handleSpeak}>
                    <SpeakerIcon />
                  </Button>
                </div>
              </div>
            </Stack>
          </Col>
        </Row>
      </Container>

      <footer
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100%',
          textAlign: 'left',
          padding: '1rem 2rem',
          background: '#fff',
          zIndex: 100,
        }}
      >
        Developed by BeruzDev <HeartIcon />
      </footer>
    </>
  )
}

export default App
