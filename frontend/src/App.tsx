import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage, DrawingPage } from "./pages";

import AppHeader from "./components/AppHeader";

function App() {
  return (
    <Router>
      <AppHeader />
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/draw" element={<DrawingPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
