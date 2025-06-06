import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Upload from '../components/Upload';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        <Navbar /> 
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/upload"
              element={isAuthenticated ? <Upload /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
