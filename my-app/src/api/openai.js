export async function fetchInteractionResult(drugs) {
    if (drugs.length < 2) {
      throw new Error('Введите минимум два препарата!')
    }
  
    const prompt = `
  You are a professional pharmacologist and nutritionist with in-depth knowledge of clinical pharmacology, pharmacokinetics and nutritional science.
  Your task is to analyze the interaction between the following substances in a strictly scientific way: ${drugs.join(', ')}.
  
  Requirements for the analysis
  <b>Механизм взаимодействия</b> - at what level does the interaction occur? (pharmacodynamics, pharmacokinetics, antagonism, synergy)
  <b>Последствия взаимодействия</b> - Possible effects (strengthening, weakening, side effects)
  <b>Как избежать негативных последствий</b>- Dosage recommendations, division of intake, clinical recommendations.
  <b>Заключение</b> о допустимости сочетания: can/can't, conditions of intake.
  
  Use **only verified sources**: clinical trials, DrugBank, PubMed, Vidal, Micromedex, scientific journals and WHO/FDA/EMA guidelines.
  If no data are available, write: _"No reliable data. Consultation with a physician or pharmacologist is recommended."_
  **Prohibited** from making up references or using Wikipedia and forums.
  
  Add **2 Source Citation URLs** at the end of your response in the format:
  - Resource Name (link)
  
  If narcotic drugs are injected (except those authorized for use in Russia), display the message "Введенные компоненты запрещены к медицинскому применению в России. Анализ невозможен"
  
  Important:
  - The answer should be concise but informative. Avoid water, unnecessary information.
  - Eliminate unnecessary repetition
  - Don't make up data if there is no reliable information on the interaction - in that case, write that the information is missing and advise to consult a doctor.
  Respond in **Russian**.`
  
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }
  
    const response = await fetch("https://api.proxyapi.ru/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "user", content: prompt }
          ]
        })
      })
    
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`)
      }
    
      const data = await response.json()
      return data.choices[0].message.content
    }
  