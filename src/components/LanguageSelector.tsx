import { Form } from 'react-bootstrap'
import './TextArea.css'
import { AUTO_LANGUAGE, SUPORTED_LANGUAGES } from '../../shared/constants.ts'
import {
  SectionType,
  type FromLanguage,
  type Language,
} from '../../shared/type.d'

type Props =
  | {
      type: SectionType.From
      value: FromLanguage
      onChange: (language: FromLanguage) => void
    }
  | {
      type: SectionType.To
      value: Language
      onChange: (language: Language) => void
    }

export const LanguageSelector = ({ onChange, type, value }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as Language)
  }

  return (
    <Form.Select
      className='custom-scrollbar'
      aria-label="Select language"
      onChange={handleChange}
      value={value}
    >
      {type === SectionType.From && (
        <option value={AUTO_LANGUAGE}>Detect lenguage</option>
      )}

      {Object.entries(SUPORTED_LANGUAGES).map(([key, literal]) => (
        <option key={key} value={key}>
          {literal}
        </option>
      ))}
    </Form.Select>
  )
}
