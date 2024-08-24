import { Route, Routes } from "react-router-dom";

import AdminDashboard from "./components/Admin/Dashboard/AdminDashboard";
import AdminLogin from "./components/Admin/Login/AdminLogin";
import Dashboard from "./components/Client/Dashboard/Dashboard";
import Login from "./components/Client/Login/Login";
import Register from "./components/Client/Register/Register";
import Block from "./components/Home/Blocks/Block";
import Blocks from "./components/Home/Blocks/Blocks";
import Home from "./components/Home/Home";
import UserLogin from "./components/User/Login/UserLogin";
import Test from "./components/User/Test/Test";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/tests" element={<Blocks />} />
        <Route exact path="/tests/:id" element={<Block />} />
        <Route exact path="/client/dashboard/*" element={<Dashboard />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/user/test/:id" element={<UserLogin />} />
        <Route exact path="/user/statement/:id" element={<Test />} />
        <Route exact path="/admin/login" element={<AdminLogin />} />
        <Route exact path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
