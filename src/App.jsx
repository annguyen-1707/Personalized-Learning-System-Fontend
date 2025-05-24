import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/adminPages/Dashboard";
import MainLayout from "./components/adminLayouts/MainLayout";
import HomePage from "./pages/HomePage/HomePage"
 

function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage/>} />
        </Route>
      </Route>
      <Route>
        <Route path="dashboard" element={<MainLayout />}>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
