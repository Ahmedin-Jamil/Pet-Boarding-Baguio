import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import Chatbot from './Chatbot';
import ChatFrame from './ChatFrame';
import './ChatbotButton.css';

const ChatbotButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleAskQuestions = () => {
    setShowChatbot(true);
  };

  const handleClose = () => {
    setShowPopup(false);
    setShowChatbot(false);
  };

  return (
    <div className="global-help-section">
      <Button 
        variant="light" 
        className="global-help-btn rounded-circle"
        onClick={() => setShowPopup(!showPopup)}
      >
        <FontAwesomeIcon icon={faQuestion} />
      </Button>
      
      {showPopup && (
        <div className="global-chatbot-popup">
          {showChatbot ? (
            <Chatbot onClose={handleClose} />
          ) : (
            <ChatFrame onAskQuestions={handleAskQuestions} onClose={handleClose} />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;