import React, { useState, useRef, useEffect } from 'react';

const MovieChatbot = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your movie assistant. Ask me for recommendations!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const callGeminiAPI = async (prompt) => {
    const apiKey = "AIzaSyCW2y2i0957mDs6lazUxQGGr28CyAN1pFI";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Sorry, I'm having trouble connecting to the movie expert. Please try again later.";

      if (errorData.error?.message && errorData.error.message.includes('Gemini API free tier is not available in your country')) {
        errorMessage = "Error: Gemini API free tier is not available in your country, or billing needs to be enabled for your project in Google AI Studio.";
      } else if (response.status === 400 && errorData.error?.details?.[0]?.reason === 'API_KEY_INVALID') {
        errorMessage = "Error: Your API key is not valid. Please ensure your environment's API key is correctly configured and has access to the Gemini API.";
      } else if (response.status === 403) {
        errorMessage = "Forbidden: It seems there's an issue with API key permissions. Please ensure your environment's API key has the necessary access.";
      } else if (errorData.error?.message) {
        errorMessage = `Sorry, I'm having trouble: ${errorData.error.message}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", result);
      throw new Error("Received an unexpected response from the movie expert.");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `You are a helpful movie expert. Recommend movies with brief descriptions. Keep responses under 100 words. User query: ${userMessage.text}`;
      const botResponseText = await callGeminiAPI(prompt);
      setMessages(prev => [...prev, { text: botResponseText, sender: 'bot' }]);
    } catch (error) {
      console.error("Error in handleSend:", error);
      setMessages(prev => [...prev, { text: error.message, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodRecommendation = async () => {
    const mood = window.prompt("What mood are you in? (e.g., happy, sad, adventurous, thoughtful)");
    if (!mood) return; 

    const userMessage = { text: `Recommend movies for a ${mood} mood.`, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const promptText = `You are a helpful movie expert. Recommend a few movies suitable for a ${mood} mood, with brief descriptions. Keep responses under 150 words.`;
      const botResponseText = await callGeminiAPI(promptText);
      setMessages(prev => [...prev, { text: botResponseText, sender: 'bot' }]);
    } catch (error) {
      console.error("Error in handleMoodRecommendation:", error);
      setMessages(prev => [...prev, { text: error.message, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlotSummary = async () => {
    const movieTitle = window.prompt("Which movie's plot would you like summarized?");
    if (!movieTitle) return; 

    const userMessage = { text: `Summarize the plot of "${movieTitle}".`, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const promptText = `You are a helpful movie expert. Provide a brief plot summary for the movie "${movieTitle}". Keep the summary under 100 words.`;
      const botResponseText = await callGeminiAPI(promptText);
      setMessages(prev => [...prev, { text: botResponseText, sender: 'bot' }]);
    } catch (error) {
      console.error("Error in handlePlotSummary:", error);
      setMessages(prev => [...prev, { text: error.message, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open Movie Chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform scale-100 opacity-100">

          <div className="bg-blue-600 text-white p-3 font-bold flex justify-between items-center rounded-t-lg">
            Movie Assistant
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold px-2 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Minimize Chatbot"
            >
              —
            </button>
          </div>

          <div className="h-64 p-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`mb-2 p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' 
                  ? 'bg-blue-100 ml-auto text-right' 
                  : 'bg-gray-200 mr-auto text-left'}`}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="mb-2 p-2 rounded-lg bg-gray-200 mr-auto max-w-[80%] animate-pulse">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>


          <div className="p-3 border-t border-b flex flex-wrap justify-center gap-2 bg-gray-100">
            <button 
              onClick={handleMoodRecommendation}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              ✨ Mood Matcher
            </button>
            <button 
              onClick={handlePlotSummary}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              ✨ Summarize Plot
            </button>
          </div>

          <div className="p-3 border-t flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for movie recommendations..."
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading} 
            />
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading} 
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieChatbot;
