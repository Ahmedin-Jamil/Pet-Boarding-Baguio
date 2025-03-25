import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaw, faSpinner, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../config';
import './Chatbot.css';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en'); // Default language is English
  const messagesEndRef = useRef(null);
  
  // Initial greeting messages in different languages
  const greetings = {
    en: "Hello! How can I help you with your pet boarding questions today?",
    tl: "Kumusta! Paano kita matutulungan sa iyong mga katanungan tungkol sa pet boarding ngayong araw?"
  };
  
  // Set initial greeting based on selected language
  useEffect(() => {
    setMessages([{ sender: 'bot', text: greetings[language] }]);
  }, [language]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send query to backend with language parameter
      const response = await fetch(`${API_URL}/api/chatbot/query/multilingual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: input,
          language: language // Send the selected language
        }),
        // Adding a timeout to prevent long waiting times if server is unresponsive
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add fallback response if there's an error
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'I\'m having trouble connecting to my knowledge base right now. Please try again later or contact our staff directly for assistance.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <FontAwesomeIcon icon={faPaw} className="me-2" />
        <h4>Baguio Pet Boarding Assistant</h4>
        <Dropdown>
          <Dropdown.Toggle variant="link" id="language-dropdown" className="p-0">
            <FontAwesomeIcon icon={faGlobe} />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={() => setLanguage('en')} active={language === 'en'}>English</Dropdown.Item>
            <Dropdown.Item onClick={() => setLanguage('tl')} active={language === 'tl'}>Tagalog</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="link" className="close-btn" onClick={onClose}>
          &times;
        </Button>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <div className="message-content">
              <FontAwesomeIcon icon={faSpinner} spin />
              <span className="ms-2">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <Form onSubmit={handleSendMessage} className="chatbot-input">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Ask about our pet services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            variant="primary" 
            type="submit"
            disabled={isLoading || !input.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default Chatbot;