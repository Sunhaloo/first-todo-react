// import the required hooks
import { useState, useRef } from "react";

// import the required components from 'antd'
import { Form, Input, Typography, Switch } from "antd";

// import theme context to determine current theme
import { useTheme } from "../contexts/ThemeContext";

// import the required icons from 'react-icons'
import { CiChat1 } from "react-icons/ci";
import { FaChevronUp } from "react-icons/fa6";

// import the gradient button component ( see official docs ) from 'antd'
import GradientButton from "./GradientButton";

// add the required styling to style input and display
import "./ChatBot.css";

function ChatBot({ onTodoChange }) {
  // declare variable for toggling heading animation
  const [isHeadingAnimating, setHeadingAnimating] = useState(false);
  // declare variable for toggling chat app visibility
  const [isChatVisible, setIsChatVisible] = useState(false);
  // declare variable / reference to keep cursor on chat input even after submit
  const inputRef = useRef(null);

  // get the current theme
  const { theme } = useTheme();

  // determine if both switch is on and theme is dark
  const isRgbEffectActive = isHeadingAnimating && theme === "dark";

  // declare variables for the actual chat implmentation
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hello! I\'m your Task Whisperer. How can I help you with your TODOs today?' },
    { role: 'user', content: 'I need to add a new task to buy groceries' },
    { role: 'ai', content: 'Sure, I can help with that. What category would you like to assign to this task?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // function to "enable" / run when the switch is on
  const handleSwitchChecked = (checked) => {
    // change / set the animation for the heading
    setHeadingAnimating(checked);
    // change / set the visibility of the chat app
    setIsChatVisible(checked);
  };

  return (
    <div className="chatbot">
      <div className="chatbot-background">
        <div className="chatbot-top-heading">
          <div className="chatbot-heading-left-section">
            <Typography.Title
              level={4}
              className={`chatbot-heading-text ${isHeadingAnimating ? "heading-move-up-down" : ""} ${isRgbEffectActive ? "rgb-effect" : ""}`}
            >
              Task Whisperer
            </Typography.Title>
          </div>

          <div className="chatbot-heading-right-section">
            <Switch
              className="chatbot-heading-switch"
              checked={isHeadingAnimating}
              onChange={handleSwitchChecked}
            />
          </div>
        </div>

        {isChatVisible && (
          <div className="chatbot-main-chat">
            <div className="chatbot-display-container">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}

              {isLoading && <div>Thinking...</div>}
            </div>
            <div className="chatbot-main-input">
              <Form layout="vertical" className="chatbot-input-form">
                <Form.Item className="chatbot-input-container">
                  <div className="chatbot-inputs">
                    <Input
                      ref={inputRef}
                      value={userMessage}
                      onChange={(e) => {
                        setUserMessage(e.target.value);
                      }}
                      className="chatbot-input-component"
                      placeholder="Please Enter A Message"
                      size="large"
                      prefix={<CiChat1 />}
                      disabled={isLoading}
                    />
                    <GradientButton
                      htmlType="submit"
                      className="chatbot-submit-button"
                      icon={<FaChevronUp />}
                      disabled={isLoading || !userMessage.trim()}
                    />
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// export as reusable component
export default ChatBot;
