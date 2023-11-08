import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import NonMainPage from './pages/NonMainPage/NonMainPage';
import { useEffect } from 'react';
import LoadingScreen from './pages/Main/components/LoadingScreen/LoadingScreen';

function App() {
  useEffect(() => {
    return () => {
    }
  }, [])

  return (
    <div id='app-container'>
      {/* <LoadingScreen /> */}
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
