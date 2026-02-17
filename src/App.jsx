import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './features/auth/Landing';
import Login from './features/auth/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
