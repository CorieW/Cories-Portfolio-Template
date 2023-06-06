import React, { useState, useEffect } from 'react';
import './styles/ProjectPage.scss';

function ProjectPage(props) {
  const id = props.id

  console.log(id);

  const [project, setProject] = useState({
    id: 1,
    name: 'Project Name',
    shortDesc: 'Short description',
    date: '2021-08-02',
    thumbnailImageUrl: 'https://via.placeholder.com/150',
    images: [
      {
        imageTitle: '50x50',
        imageUrl: 'https://via.placeholder.com/50',
        imageDesc: 'This image is 50x50 pixels'
      },
      {
        imageTitle: '150x150',
        imageUrl: 'https://via.placeholder.com/150',
        imageDesc: 'This image is 150x150 pixels'
      },
      {
        imageTitle: '250x250',
        imageUrl: 'https://via.placeholder.com/250',
        imageDesc: 'This image is 250x250 pixels'
      },
      {
        imageTitle: '500x500',
        imageUrl: 'https://via.placeholder.com/500',
        imageDesc: 'This image is 500x500 pixels'
      },
      {
        imageTitle: '1000x1000',
        imageUrl: 'https://via.placeholder.com/1000',
        imageDesc: 'This image is 1000x1000 pixels'
      },
      {
        imageTitle: '2000x2000',
        imageUrl: 'https://via.placeholder.com/2000',
        imageDesc: 'This image is 2000x2000 pixels'
      }
    ],
    sections: [
      {
        title: 'Description',
        content: 'Description'
      },
      {
        title: 'Tech Stack',
        content: 'Tech Stack'
      },
      {
        title: 'Design',
        content: 'Design'
      },
      {
        title: 'Frontend',
        content: 'da'
      },
      {
        title: 'Backend',
        content: 'Backend'
      },
      {
        title: 'Related Links',
        content: 'Related Links'
      }
    ]
  });
  // Index of the active section
  const [activeSection, setActiveSection] = useState(0);
  // Index of the active image
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Remove the '#' symbol from the hash value
    const hashValue = window.location.hash.substring(1);
    setActiveSection(getSectionIndexByHashValue(hashValue));

    // Add event listener to listen for changes in the hash value
    const handleHashChange = () => {
      const updatedHashValue = window.location.hash.substring(1);
      setActiveSection(getSectionIndexByHashValue(updatedHashValue));
    };

    window.addEventListener('hashchange', handleHashChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Convert a title to a hash value
  function convertTitleToHashValue(title) {
    return title.toLowerCase().replace(' ', '-');
  }

  // Get the section object that matches the hash value
  function getSectionIndexByHashValue(hashValue) {
    // Note: Returns -1 if no section is found
    const sectionIndex = project.sections.findIndex(section => convertTitleToHashValue(section.title) === hashValue);
    return sectionIndex;
  }

  function getProjectSectionsList() {
    return (
      <ul id='project-sections'>
        {project.sections.map((section, index) => (
          getSectionButton(section.title, index)
        ))}
      </ul>
    )
  }

  function getActiveSection() {
    if (activeSection === -1) {
      return project.sections[0];
    }

    return project.sections[activeSection];
  }

  function getActiveImage() {
    return project.images[activeImage];
  }

  function getSectionButton(sectionTitle, key) {
    // Create a simple section name, used to identify the active section in the URL
    let hashValue = convertTitleToHashValue(sectionTitle);
    let isActive = sectionTitle === getActiveSection().title ? true : false;
    return (
      <li key={key} className={isActive ? 'active' : ''}><a href={'#' + hashValue}>{sectionTitle}</a></li>
    )
  }

  function convertDateToReadableFormat(date) {
    // Convert date to a readable format
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  if (id) {
    return (
      <div id='project-page-container'>
        <div id='details'>
          <h2>Project: {project.name}</h2>
          <p>{project.shortDesc}</p>
        </div>
        <div id='slideshow-container'>
          <div className='slide-btn-container'>
            <button onClick={() => setActiveImage(activeImage - 1)} disabled={activeImage === 0 ? true : false}><i class="fa-solid fa-caret-left"></i></button>
          </div>
          <div id='img-container'>
            <img src={getActiveImage().imageUrl} alt={getActiveImage().imageTitle} />
          </div>
          <div className='slide-btn-container'>
            <button onClick={() => setActiveImage(activeImage + 1)} disabled={activeImage === project.images.length - 1 ? true : false}><i class="fa-solid fa-caret-right"></i></button>
          </div>
          <div id='img-info'>
            <p id='img-title'>{getActiveImage().imageTitle}</p>
            <p id='img-description'>{getActiveImage().imageDesc}</p>
          </div>
        </div>
        <p id='completion-date'>Completion Date: {convertDateToReadableFormat(project.date)}</p>
        {getProjectSectionsList()}
        <div id='project-active-section-container'>
          <h3>{getActiveSection().title}</h3>
          <p>{getActiveSection().content}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div id='project-page-container'>
        <div id='details'>
          <h2>404 Project Not Found</h2>
        </div>
      </div>
    )
  }
}

export default ProjectPage;
