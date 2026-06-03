import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage, DrawingPage, ProfilePage } from "./pages";

import { ConfigProvider } from "antd";

import "./index.css";

import { useAuth } from "./hooks";

import AppHeader from "./components/AppHeader";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  const auth = useAuth();
  return (
    <ConfigProvider
      theme={{
        cssVar: { key: "index" },
        components: {
          Slider: {
            colorPrimary: "var(--primary)",
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
        <AppHeader authStatus={auth.status} />
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/draw" element={<DrawingPage />}></Route>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/register" element={<RegisterForm />}></Route>
          <Route
            path="/profile"
            element={
              <ProfilePage
                authStatus={auth.status}
                username={auth.user.username}
              />
            }
          ></Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
