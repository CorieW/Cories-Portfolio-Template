import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';

function App() {
    return (
        <div id='app-container'>
            <BrowserRouter>
                <Routes>
                    <Route path='*' element={<Main />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
