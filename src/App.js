import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import NonMainPage from './pages/NonMainPage/NonMainPage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    return () => {
    }
  }, [])
  

  return (
    <div id='app-container'>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Main />} />
          <Route path='*' element={<NonMainPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
