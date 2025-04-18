import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Welcome from './components/Welcome';

function App() { 

  return (
    <div className="w-full">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
