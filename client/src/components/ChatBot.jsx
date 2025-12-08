// import the required hooks
import { useState, useRef, useEffect } from "react";

// import the required components from 'antd'
import { Form, Input, message, Typography, Switch } from "antd";

// import the API functions that will talk to back-end
import { sendChatMessage, getGreetingMessage } from "../services/api";

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
  // reference for auto-scrolling chat to bottom
  const chatDisplayRef = useRef(null);

  // get the current theme
  const { theme } = useTheme();

  // determine if both switch is on and theme is dark
  const isRgbEffectActive = isHeadingAnimating && theme === "dark";

  // declare variables for the actual chat implementation
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  // function to "enable" / run when the switch is on
  const handleSwitchChecked = async (checked) => {
    // change / set the animation for the heading
    setHeadingAnimating(checked);
    // change / set the visibility of the chat app
    setIsChatVisible(checked);

    // display a success message to the user
    messageApi.open({
      type: "success",
      content: "AI Chatbot Successfully Toggled",
      duration: 1,
    });

    console.log("[ChatBot](Toggle) AI Chatbot Successfully Toggled");

    // if toggled on and chat history is empty, fetch greeting message
    if (checked && chatHistory.length === 0) {
      setIsLoading(true);
      try {
        const data = await getGreetingMessage();

        setChatHistory([{ role: "assistant", content: data.message }]);

        console.log("[ChatBot](Greeting) Greeting message received");
      } catch (error) {
        console.error("[ChatBot](Greeting) Error:", error);

        messageApi.open({
          type: "error",
          content: error.error || "Failed to get greeting message",
          duration: 3,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // function to send message to the AI backend
  const handleSendMessage = async () => {
    // validate message
    if (!userMessage.trim()) {
      return;
    }

    const currentMessage = userMessage.trim();
    setUserMessage(""); // clear input immediately
    setIsLoading(true);

    // add user message to chat history
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: currentMessage },
    ];
    setChatHistory(updatedHistory);

    try {
      // call the `sendChatMessage` function / end-point
      const data = await sendChatMessage(currentMessage, chatHistory);

      // update chat history with AI response
      setChatHistory([
        ...updatedHistory,
        { role: "assistant", content: data.message },
      ]);

      // trigger the page fresh on "CUD" operation
      if (data.toolsUsed && onTodoChange) {
        onTodoChange();
      }

      console.log("[ChatBot](Send) Message sent and response received");
    } catch (error) {
      console.error("[ChatBot](Send) Error:", error);

      messageApi.open({
        type: "error",
        content: error.error || "Failed to get AI response",
        duration: 3,
      });

      // Revert to previous history since request failed
      setChatHistory(chatHistory);
    } finally {
      setIsLoading(false);
      // refocus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // handle `<Enter>` key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {contextHolder}
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
              <div className="chatbot-display-container" ref={chatDisplayRef}>
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.role}`}>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}

                {isLoading && (
                  <div className="chat-message assistant">
                    <div className="message-content typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
              <div className="chatbot-main-input">
                <Form
                  layout="vertical"
                  className="chatbot-input-form"
                  onFinish={handleSendMessage}
                >
                  <Form.Item className="chatbot-input-container">
                    <div className="chatbot-inputs">
                      <Input
                        ref={inputRef}
                        value={userMessage}
                        onChange={(e) => {
                          setUserMessage(e.target.value);
                        }}
                        onKeyPress={handleKeyPress}
                        className="chatbot-input-component"
                        placeholder="Ask me to manage your todos..."
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
    </>
  );
}

// export as reusable component
export default ChatBot;
