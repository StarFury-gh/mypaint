import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage, DrawingPage } from "./pages";

import AppHeader from "./components/AppHeader";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <Router>
      <AppHeader />
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/draw" element={<DrawingPage />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
