// import a 'Card' and 'Button' component from 'antd'
import { Button, Card } from "antd";
import "./App.css";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>TODO Application</h1>

      <Card title="Ant Design Card" style={{ width: "300" }}>
        <p>Working Ant Design Card Component!</p>

        <Button type="primary">Ant Design Test Button</Button>
      </Card>
    </div>
  );
}

export default App;
