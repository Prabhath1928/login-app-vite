import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Users from "./components/Users";
import Carts from "./components/Carts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/users" element={<Users />} />
      <Route  path="/carts" element={<Carts />} />
    </Routes>
  );
}

export default App;  
