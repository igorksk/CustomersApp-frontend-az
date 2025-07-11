import './App.css';
import Customers from './components/Customers';

import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider>
      <Customers />
    </ConfigProvider>
  );
}

export default App;
