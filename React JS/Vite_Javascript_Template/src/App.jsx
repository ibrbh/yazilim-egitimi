import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home_Page from './Pages.jsx/Home_Page';
import JSXRules from './Components/JSXRules'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Page/>} />
          <Route path="/jsx-rules" element={<JSXRules />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
