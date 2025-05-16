import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/notfound";
import Statistics from "./pages/statistics";
import Accounts from "./pages/accounts";
import Upload from "./pages/upload";
import Category from "./pages/category";
import Transactions from "./pages/transactions";
import { useState } from "react";
import './css/bootstrap-icons.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/upload/:from?" element={<Upload />} />

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/statistics" element={<Statistics />} />

        <Route path="/accounts" element={<Accounts />} />

        <Route path="/category" element={<Category />} />

        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;
