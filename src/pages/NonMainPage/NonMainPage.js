import { Route, Routes } from 'react-router-dom';
import Nav from '../../components/Nav/Nav';
import ProjectPage from '../ProjectPage/ProjectPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './NonMainPage.scss';

function NonMainPage() {
  return (
    <>
      <Nav />
      <div id='content-container'>
          <Routes>
              <Route exact path='/projects' element={<ProjectPage />} />
              <Route exact path='/projects/:id' element={<ProjectPage id='2' />} />
              <Route path='*' element={<NotFoundPage />} />
          </Routes>
      </div>
    </>
  );
}

export default NonMainPage;
