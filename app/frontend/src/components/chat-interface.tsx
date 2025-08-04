"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>
  isLoading?: boolean
}

export function ChatInterface({ onSendMessage, isLoading = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "## 👨‍🍳 **Welcome to MooFoo!** ✨\n\nHello there! I'm your **personal food assistant** and I'm here to make your dining experience absolutely amazing! 🍽️\n\n**What can I help you with today?**\n\n• 🍳 **Cook something delicious** at home\n• 🍽️ **Find amazing restaurants** near you\n• 🌶️ **Discover new cuisines** and flavors\n• 🎯 **Get personalized recommendations** based on your mood\n\nJust tell me what you're craving or how you're feeling, and I'll create the perfect food experience for you! 😊",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')

    try {
      const response = await onSendMessage(currentInput)
      
      // Add a small delay to make the chat feel more natural
      setTimeout(() => {
        // Add AI response to messages
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, aiMessage])
      }, 500)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickSuggestions = [
    { text: "I'm craving spicy North Indian food! 🌶️", emoji: "🔥" },
    { text: "Show me healthy vegetarian recipes", emoji: "🥗" },
    { text: "Find the best restaurants near Electronic City", emoji: "🍽️" },
    { text: "I want something sweet and delicious", emoji: "🍰" }
  ]

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">👨‍🍳</div>
            <div className="logo-text">
              <h1>MooFoo</h1>
              <p>Your Personal Food Assistant</p>
            </div>
          </div>
          <div className="food-emoji">🍕🍜🍔</div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`message-wrapper ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-bubble">
                <div className="message-content">
                  {!message.isUser && <div className="bot-avatar">🍽️</div>}
                  <div className="message-text">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom styling for markdown elements
                        h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                        h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                        h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                        strong: ({children}) => <strong className="markdown-strong">{children}</strong>,
                        em: ({children}) => <em className="markdown-em">{children}</em>,
                        ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                        ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                        li: ({children}) => <li className="markdown-li">{children}</li>,
                        p: ({children}) => <p className="markdown-p">{children}</p>,
                        code: ({children}) => <code className="markdown-code">{children}</code>,
                        pre: ({children}) => <pre className="markdown-pre">{children}</pre>,
                        blockquote: ({children}) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                        hr: () => <hr className="markdown-hr" />,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                  {message.isUser && <div className="user-avatar">👤</div>}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="loading-message"
          >
            <div className="loading-bubble">
              <div className="loading-avatar">🍽️</div>
              <div className="loading-text">Thinking...</div>
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="suggestions-container"
        >
          <p className="suggestions-title">Try asking me:</p>
          <div className="suggestions-grid">
            {quickSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setInputValue(suggestion.text)
                  // Auto-send the suggestion
                  setTimeout(() => {
                    const userMessage: Message = {
                      id: Date.now().toString(),
                      text: suggestion.text,
                      isUser: true,
                      timestamp: new Date()
                    }
                    setMessages(prev => [...prev, userMessage])
                    
                    // Send the message
                    onSendMessage(suggestion.text).then(response => {
                      // Add a small delay to make the chat feel more natural
                      setTimeout(() => {
                        const aiMessage: Message = {
                          id: (Date.now() + 1).toString(),
                          text: response,
                          isUser: false,
                          timestamp: new Date()
                        }
                        setMessages(prev => [...prev, aiMessage])
                      }, 500)
                    }).catch(error => {
                      console.error('Error sending suggestion:', error)
                      const errorMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
                        isUser: false,
                        timestamp: new Date()
                      }
                      setMessages(prev => [...prev, errorMessage])
                    })
                  }, 100)
                }}
                className="suggestion-button"
              >
                <span className="suggestion-emoji">{suggestion.emoji}</span>
                <span className="suggestion-text">{suggestion.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about recipes, restaurants, or food recommendations..."
            className="message-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            <span className="send-icon">📤</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(135deg, #fff8dc 0%, #fff5e6 50%, #ffe4b5 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          position: relative;
        }

        .chat-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(247, 147, 30, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .chat-header {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
          padding: 20px;
          box-shadow: 
            0 4px 20px rgba(255, 107, 53, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 1;
        }

        .chat-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-icon {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 4px 15px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.3);
          position: relative;
          animation: pulse 2s ease-in-out infinite;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff6b35, #f7931e, #ff8c42, #ff6b35);
          border-radius: 50%;
          z-index: -1;
          animation: rotate 3s linear infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .logo-text h1 {
          color: white;
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .logo-text p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .food-emoji {
          font-size: 1.5rem;
          color: white;
        }

        .messages-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
          position: relative;
          z-index: 1;
          scroll-behavior: smooth;
        }

        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
        }

        .message-wrapper {
          display: flex;
          margin-bottom: 10px;
        }

        .user-message {
          justify-content: flex-end;
        }

        .bot-message {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          background: white;
          border-radius: 20px;
          padding: 15px 20px;
          box-shadow: 
            0 4px 15px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.5);
          position: relative;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }

        .message-bubble::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          pointer-events: none;
        }

        .user-message .message-bubble {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          box-shadow: 
            0 4px 15px rgba(255, 107, 53, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .user-message .message-bubble::before {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
        }

        .bot-message .message-bubble {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 2px solid #90ee90;
          box-shadow: 
            0 4px 15px rgba(144, 238, 144, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        .message-content {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .bot-avatar, .user-avatar {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .message-text {
          line-height: 1.5;
          font-size: 0.95rem;
        }

        /* Markdown Styles */
        .markdown-h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: inherit;
        }

        .markdown-h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0.4rem 0;
          color: inherit;
        }

        .markdown-h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.3rem 0;
          color: inherit;
        }

        .markdown-strong {
          font-weight: 700;
          color: inherit;
        }

        .markdown-em {
          font-style: italic;
          color: inherit;
        }

        .markdown-ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          list-style-type: disc;
        }

        .markdown-ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          list-style-type: decimal;
        }

        .markdown-li {
          margin: 0.2rem 0;
          line-height: 1.4;
        }

        .markdown-p {
          margin: 0.3rem 0;
          line-height: 1.5;
        }

        .markdown-code {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .markdown-pre {
          background: rgba(0, 0, 0, 0.1);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 0.5rem 0;
        }

        .markdown-blockquote {
          border-left: 4px solid currentColor;
          padding-left: 1rem;
          margin: 0.5rem 0;
          opacity: 0.8;
        }

        /* User message specific markdown styles */
        .user-message .markdown-strong {
          color: white;
        }

        .user-message .markdown-em {
          color: rgba(255, 255, 255, 0.9);
        }

        .user-message .markdown-code {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .user-message .markdown-pre {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .user-message .markdown-blockquote {
          border-left-color: rgba(255, 255, 255, 0.5);
          color: rgba(255, 255, 255, 0.9);
        }

        /* Additional markdown enhancements */
        .markdown-ul li::marker {
          color: inherit;
        }

        .markdown-ol li::marker {
          color: inherit;
          font-weight: 600;
        }

        /* Horizontal rule styling */
        .markdown-hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, currentColor, transparent);
          margin: 1rem 0;
          opacity: 0.3;
        }

        /* Better spacing for lists */
        .markdown-ul, .markdown-ol {
          margin: 0.8rem 0;
        }

        .markdown-li {
          margin: 0.4rem 0;
        }

        /* Enhanced paragraph spacing */
        .markdown-p {
          margin: 0.5rem 0;
        }

        /* Better heading spacing */
        .markdown-h1, .markdown-h2, .markdown-h3 {
          margin: 1rem 0 0.5rem 0;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 5px;
          text-align: right;
        }

        .loading-message {
          display: flex;
          justify-content: flex-start;
        }

        .loading-bubble {
          background: white;
          border: 2px solid #90ee90;
          border-radius: 20px;
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .loading-avatar {
          font-size: 1.2rem;
        }

        .loading-text {
          font-size: 0.9rem;
          color: #666;
          margin: 0 10px;
          font-weight: 500;
        }

        .loading-dots {
          display: flex;
          gap: 5px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #ff6b35;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .suggestions-container {
          padding: 20px;
          text-align: center;
        }

        .suggestions-title {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          max-width: 600px;
          margin: 0 auto;
        }

        .suggestion-button {
          background: linear-gradient(135deg, #fff8dc 0%, #ffe4b5 100%);
          border: 2px solid #ff6b35;
          border-radius: 15px;
          padding: 12px 16px;
          color: #8b4513;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
        }

        .suggestion-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s ease;
        }

        .suggestion-button:hover::before {
          left: 100%;
        }

        .suggestion-button:hover {
          background: linear-gradient(135deg, #ffe4b5 0%, #ffd700 100%);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 
            0 8px 25px rgba(255, 107, 53, 0.3),
            0 0 0 1px rgba(255, 107, 53, 0.2);
        }

        .suggestion-emoji {
          font-size: 1.2rem;
        }

        .suggestion-text {
          flex: 1;
        }

        .input-container {
          padding: 20px;
          background: linear-gradient(135deg, #fff8dc 0%, #ffe4b5 100%);
          border-top: 2px solid #ffd700;
          position: relative;
          z-index: 1;
        }

        .input-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.5) 50%, transparent 100%);
        }

        .input-wrapper {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .message-input {
          flex: 1;
          border: 2px solid #ff6b35;
          border-radius: 25px;
          padding: 15px 20px;
          font-size: 1rem;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 
            0 2px 10px rgba(255, 107, 53, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(5px);
        }

        .message-input:focus {
          border-color: #f7931e;
          box-shadow: 
            0 0 0 3px rgba(255, 107, 53, 0.1), 
            0 4px 15px rgba(255, 107, 53, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: scale(1.02);
        }

        .send-button {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 15px rgba(255, 107, 53, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .send-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 
            0 8px 25px rgba(255, 107, 53, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.3);
        }

        .send-button:hover:not(:disabled)::before {
          opacity: 1;
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-icon {
          font-size: 1.2rem;
          color: white;
        }
      `}</style>
    </div>
  )
} 