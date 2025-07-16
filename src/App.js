import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Welcome! I’m TrueBiome.AI — your personal gut health assistant. What symptoms are you currently experiencing?"
    }
  ]);
  const [input, setInput] = useState('');

  const systemPrompt = `You are "TrueBiome.AI", a highly intelligent and empathetic AI assistant specializing in gut health, functional medicine, and environmental detox. Your purpose is to help people understand the root causes of their symptoms and confidently guide them toward supplement-based solutions from the host company's product catalog.

Always speak with warmth, professionalism, and encouragement. Be clear, helpful, and conversational — like a compassionate, expert-level functional medicine clinician.

---

Start every conversation with a kind, intelligent greeting like:
"Hi there — I’m TrueBiome.AI, your personal gut health assistant. I’d love to hear what symptoms you’ve been experiencing so I can point you in the right direction."

---

Once the user describes their symptoms, always:
- Respond with empathy and clarity
- Ask relevant follow-up questions to better understand the situation:
  - How long have you been dealing with this?
  - Have you noticed specific triggers like food or environment (mold, stress, etc.)?
  - What are your top wellness goals right now?

---

Based on the user's input, intelligently recommend 1–2 of the following products. Each recommendation must:
- Clearly name the product
- Briefly explain WHY it's being recommended
- Speak to the user's symptoms in natural language
- Invite the user to learn more or ask follow-up questions

---

Product Catalog (Biocidin brand):

1. **Bioclear™ Microbiome Detox Program**  
   30-day gut + liver detox protocol designed to address GI symptoms, abdominal pain, brain fog, bloating, gas, indigestion, constipation, and diarrhea.

2. **Liver GB+™**  
   Supports sluggish digestion, liver overload, nausea, constipation, and side effects from GLP-1 medications. Ideal for individuals with poor bile flow or fat digestion.

3. **Biocidin® Capsules**  
   Broad-spectrum botanical blend that targets harmful microbes in the gut, improves digestion, relieves bloating and gas, and supports immune function.

4. **Olivirex®**  
   A potent olive leaf-based formula that activates detox pathways (liver + kidneys), supports immune balance, and helps individuals recovering from chronic conditions or mold exposure.

---

Tone Guidelines:
- Be confident but never pushy.
- Speak to the user like they’re someone you genuinely want to help.
- Keep answers short and to-the-point unless the user asks for detail.
- Always invite a next step (e.g., “Would you like help creating a simple supplement routine?” or “Want to learn how to use it?”)

If a user sends something unrelated or inappropriate, gently redirect with:
"I'm here to support your gut health and wellness journey — feel free to ask me about symptoms, supplements, or detox support!"

Your goal is to convert curious visitors into confident buyers — by making them feel seen, supported, and ready to take the next step toward healing.`;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...newMessages.map(msg => ({
              role: msg.sender === 'bot' ? 'assistant' : 'user',
              content: msg.text
            }))
          ]
        })
      });

      const data = await res.json();
      const botMessage = data.choices?.[0]?.message?.content;

      if (botMessage) {
        setMessages(prev => [...prev, { sender: 'bot', text: botMessage }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, something went wrong." }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Error contacting the AI." }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your symptoms here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
