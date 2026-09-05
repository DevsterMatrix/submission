import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./components/Search";
import Medicine from "./components/Medicine";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/medicine" element={<Medicine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
