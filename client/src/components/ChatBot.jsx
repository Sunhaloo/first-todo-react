// import the required hooks
import { useState } from "react";

// import the required components from 'antd'
import { Typography, Switch } from "antd";

// add the required styling to style input and display
import "./ChatBot.css";

function ChatBot() {
  // declare variable for toggling heading animation
  const [isHeadingAnimating, setHeadingAnimating] = useState(false);

  // function to "enable" / run when the switch is on
  const handleSwitchChecked = (checked) => {
    // change / set the animation for the heading
    setHeadingAnimating(checked);
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
              AI Chatbot
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
      </div>
    </div>
  );
}

// export as reusable component
export default ChatBot;
