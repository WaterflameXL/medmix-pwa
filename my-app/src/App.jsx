import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import { fetchInteractionResult } from './api/openai'
import './App.css'

function App() {
  const [inputs, setInputs] = useState(['', '']) // минимум 2 поля
  const [step, setStep] = useState('form') // form | loading | result
  const [result, setResult] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (index, value) => {
    const updated = [...inputs]
    updated[index] = value
    setInputs(updated)
  }

  const addField = () => {
    if (inputs.length >= 5) return
    setInputs([...inputs, ''])
  }

  const handleCheck = () => {
    const filled = inputs.filter(v => v.trim() !== '')
    if (filled.length < 2) {
      alert('Введите минимум два препарата')
      return
    }
    setStep('loading')
  }

  const handleVideoFinished = async () => {
    const filled = inputs.filter(v => v.trim() !== '')
    setIsProcessing(true)
    try {
      const content = await fetchInteractionResult(filled)
      setResult(content)
    } catch (e) {
      setResult(`❌ ${e.message}`)
    }
    setIsProcessing(false)
    setStep('result')
  }

  return (
    <>
      {step === 'form' && (
        <div style={{ padding: '20px' }}>
          <h1>MedMix</h1>
          {inputs.map((value, index) => (
            <input
              key={index}
              value={value}
              placeholder={`Препарат ${index + 1}`}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{ display: 'block', marginBottom: '10px' }}
            />
          ))}
          {inputs.length < 5 && (
            <button onClick={addField}>+ Добавить препарат</button>
          )}
          <br />
          <button onClick={handleCheck}>Проверить совместимость</button>
        </div>
      )}

      {step === 'loading' && <LoadingScreen onFinish={handleVideoFinished} />}

      {step === 'result' && (
        <div style={{ padding: '20px' }}>
          <h1>Результат</h1>
          {isProcessing ? <p>⚙️ Получаем ответ...</p> : (
            <div dangerouslySetInnerHTML={{ __html: result }} />
          )}
          <button style={{ marginTop: '20px' }} onClick={() => {
            setStep('form')
            setResult('')
            setInputs(['', ''])
          }}>🔁 Новый анализ</button>
        </div>
      )}
    </>
  )
}

export default App
