// import the required hooks
import { useState } from "react";

// import the API function that will talk to back-end
import { sendChatMessage } from "../services/api.js";

// import the required components from 'antd'
import { Form, Input, Typography, Switch } from "antd";

// import the required icons from 'react-icons'
import { CiChat1 } from "react-icons/ci";
import { FaChevronUp } from "react-icons/fa6";

// import the gradient button component ( see official docs ) from 'antd'
import GradientButton from "./GradientButton";

// add the required styling to style input and display
import "./ChatBot.css";

function ChatBot() {
  // declare variable for toggling heading animation
  const [isHeadingAnimating, setHeadingAnimating] = useState(false);
  // declare variable for toggling chat app visibility
  const [isChatVisible, setIsChatVisible] = useState(false);

  // declare variables for the actual chat implmentation
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // function to "enable" / run when the switch is on
  const handleSwitchChecked = (checked) => {
    // change / set the animation for the heading
    setHeadingAnimating(checked);
    // change / set the visibility of the chat app
    setIsChatVisible(checked);
  };

  // function to handle the input of messages
  const handleUserMessageInput = async (e) => {
    // NOTE: stop the page from reloading and wait for input to process first
    e.preventDefault();

    // check if the user is sending trying to send empty inputs --> "skip it"
    if (!userMessage.trim()) {
      return;
    }

    // add all user ( message ) inputs to the history
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    // keep track of the chat input --> for AI to continue to get context
    setChatHistory((prev) => {
      [...prev, newUserMessage];
    });

    // clear the input and show loading
    setUserMessage("");
    setIsLoading(true);

    try {
      // call the API / AI and wait for response
      const response = await sendChatMessage(userMessage);

      // add AI responses to chat history --> to be able to get context
      const aiMessage = {
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      // keep track of the chat input --> for AI to continue to get context
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      // NOTE: do also add the `message` component here
      console.error("Failed to send message:", error);

      // add an error message to the chat if requests failed to send response
      const errorMessage = {
        role: "error",
        content: "Sorry, I couldn't process your message. Please try again.",
        timestamp: new Date().toISOString(),
      };

      // INFO: do also add the failed message to chat
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-background">
        <div className="chatbot-top-heading">
          <div className="chatbot-heading-left-section">
            <Typography.Title
              level={4}
              className={`chatbot-heading-text ${isHeadingAnimating ? "heading-move-up-down" : ""}`}
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
            <div className="chatbot-display-container"></div>
            <div className="chatbot-main-input">
              <Form layout="vertical" className="chatbot-input-form">
                <Form.Item className="chatbot-input-container">
                  <div className="chatbot-inputs">
                    <Input
                      className="chatbot-input-component"
                      placeholder="Please Enter A Message"
                      size="large"
                      prefix={<CiChat1 />}
                    />
                    <GradientButton
                      className="chatbot-submit-button"
                      icon={<FaChevronUp />}
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
