import { Routes, Route } from "react-router-dom";
import Home from "./sections/Home.jsx";
import Login from "./sections/Login.jsx";
import Signin from "./sections/Signin.jsx";
import MonumentDetails from "./sections/MonumentDetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/monument/:id" element={<MonumentDetails />} />
    </Routes>
  );
}

export default App;
