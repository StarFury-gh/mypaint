import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage, DrawingPage } from "./pages";

import { ConfigProvider } from "antd";

import "./index.css";

import AppHeader from "./components/AppHeader";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <ConfigProvider
      theme={{
        cssVar: { key: "index" },
        components: {
          Slider: {
            trackBg: "var(--primary)",
            trackHoverBg: "var(--primary)",
            dotBorderColor: "var(--primary)",
            dotActiveBorderColor: "var(--primary)",
            handleColor: "var(--primary)",
          },
        },
      }}
    >
      <Router>
        <AppHeader />
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/draw" element={<DrawingPage />}></Route>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/register" element={<RegisterForm />}></Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
