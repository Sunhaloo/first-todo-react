// import the required hooks
import { useState } from "react";

// import the API function that will talk to back-end
import { sendChatMessage } from "../services/api.js";

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

  // get the current theme
  const { theme } = useTheme();

  // determine if both switch is on and theme is dark
  const isRgbEffectActive = isHeadingAnimating && theme === "dark";

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
    // prevent default form submission behavior if form event is passed
    if (e && e.preventDefault) e.preventDefault();

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
    setChatHistory((prev) => [...prev, newUserMessage]);

    // clear the input and show loading
    setUserMessage("");
    setIsLoading(true);

    try {
      // call the API / AI and wait for response and also pass the conversation history
      const response = await sendChatMessage(userMessage, [
        ...chatHistory,
        newUserMessage,
      ]);

      console.log("Chat API response:", response); // Debug log

      // add AI responses to chat history --> to be able to get context
      const aiMessage = {
        role: "assistant",
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      // keep track of the chat input --> for AI to continue to get context
      setChatHistory((prev) => [...prev, aiMessage]);

      // check if function / tool calls were executed and trigger refresh if "CUD" operation / tool used
      if (response.functionCalls && response.functionCalls.length > 0) {
        console.log("Function calls executed:", response.functionCalls);
        // trigger todo refresh if "CUD"" operations were performed
        const cudOperations = ["createTodo", "updateTodo", "deleteTodo"];
        const hasCudOperation = response.functionCalls.some((func) =>
          cudOperations.includes(func.name || func),
        );

        if (hasCudOperation && onTodoChange) {
          console.log(
            "Triggering refresh after CUD operation from functionCalls",
          ); // Debug log
          // make the refresh actually occur
          onTodoChange();
        }
      }
      // Alternative: check if the message indicates a CRUD operation was performed
      else {
        const message = response.message ? response.message.toLowerCase() : "";
        const crudKeywords = ["created", "updated", "deleted", "task", "todo"];

        // Check if the message specifically indicates a todo was created, updated, or deleted
        const hasCudOperation =
          message.includes("created the task") ||
          message.includes("updated the task") ||
          message.includes("deleted the task");

        if (hasCudOperation && onTodoChange) {
          console.log(
            "Triggering refresh after CUD operation from message content",
          ); // Debug log
          onTodoChange();
        } else {
          console.log("No CUD operations detected in response"); // Debug log
        }
      }
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
      setChatHistory((prev) => [...(prev || []), errorMessage]);
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
              <Form
                layout="vertical"
                className="chatbot-input-form"
                onFinish={handleUserMessageInput}
              >
                <Form.Item className="chatbot-input-container">
                  <div className="chatbot-inputs">
                    <Input
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
