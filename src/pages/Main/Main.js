import { useState, useRef, useEffect } from 'react';
import $ from 'jquery';
import './styles/Main.scss';
import Nav from '../../components/Nav/Nav';
import selfie from '../../assets/profile_img.jpg';

function Main() {
  const [activeHash, setActiveHash] = useState('about-me-section');
  let currSectionIndex = 0;
  let prevScrollY = 0;

  useEffect(() => {
    // Add event listener to listen for changes in the hash value
    // When the hash value changes, update the active hash value.
    const handleHashChange = () => {
      const updatedHashValue = window.location.hash.substring(1);
      setActiveHash(updatedHashValue);
    };

    window.addEventListener('hashchange', handleHashChange);

    const handleScroll = (e) => {
      e.preventDefault();
      // Get the current scroll position
      const scrollPosition = window.scrollY;
      const deltaY = scrollPosition - prevScrollY;
      const bottomPostionOfView = window.scrollY + window.innerHeight;

      // Get the sections
      const sectionElements = document.getElementsByClassName('section');

      // Get the section that is currently in view
      let activeSection = sectionElements[currSectionIndex];
      let sectionTop = activeSection.offsetTop;
      let sectionBottom = sectionTop + activeSection.offsetHeight;

      // Clamp the scroll position to the current section
      let remainingScrollFromBottom = sectionBottom - bottomPostionOfView;
      let remainingScrollFromTop = scrollPosition - sectionTop;

      if (remainingScrollFromBottom <= 0.001) {
        window.scrollTo(0, sectionBottom - window.innerHeight);
      }
      if (remainingScrollFromTop <= 0.001) {
        window.scrollTo(0, sectionTop);
      }
      
      // Get distance from top of the section
      let distanceFromTopOfSection = sectionTop - scrollPosition;

      // Show nav bar when at top of the section
      if (distanceFromTopOfSection === 0) {
        document.getElementById('nav-container').classList.remove('hidden');
      } else {
        document.getElementById('nav-container').classList.add('hidden');
      }

      setActiveHash(activeSection.id);
      prevScrollY = scrollPosition;
    };

    window.addEventListener('scroll', handleScroll);

    const moveSection = (e) => {
      const sectionElements = document.getElementsByClassName('section');
      let activeSection = sectionElements[currSectionIndex];
      
      // Check if the current section is in view
      let sectionTop = activeSection.offsetTop;
      let sectionBottom = sectionTop + activeSection.offsetHeight;
      const scrollDownReady = sectionBottom - window.scrollY <= window.innerHeight;
      const scrollUpReady = window.scrollY - sectionTop <= window.innerHeight;

      if (scrollDownReady && e.deltaY > 0 && sectionElements.length !== currSectionIndex + 1) currSectionIndex += 1;
      else if (scrollUpReady && e.deltaY < 0 && currSectionIndex !== 0) currSectionIndex -= 1;
      else return

      window.scrollTo(0, activeSection.offsetTop);
    }

    window.addEventListener('touchmove', moveSection, { passive: false });
    window.addEventListener('wheel', moveSection, { passive: false });

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', moveSection);
      window.removeEventListener('wheel', moveSection);
    };
  }, []);

  function getLinksComponent() {
    return (
      <>
        {getLinkComponentFor('about-me-section', 'About Me')}
        {getLinkComponentFor('skills-section', 'Skills')}
        {getLinkComponentFor('projects-section', 'Projects')}
        {getLinkComponentFor('contact-section', 'Contact')}
      </>
    )
  }

  function getLinkComponentFor(hashValue, name) {
    // Check if the hash value matches the active hash value
    // This is used to determine if the link is active
    let isActive = activeHash === hashValue;
    return (
      <li><a href={'#' + hashValue} className={isActive ? 'active' : ''}>{name}</a></li>
    )
  }

  return (
    <div id='main-page-container'>
      <Nav linksComponent={getLinksComponent()}/>
      <div className='section' id='about-me-section'>
        <div id='about-me-container'>
          <div id='upper-container'>
            <div id='img-container'>
              <img src={selfie} alt='Profile image' />
            </div>
            <h2>Hello, I am <br/><strong>Corie Watson</strong>. <br/>I am a Developer</h2>
          </div>
          <div id='info-container'>
            <p>Sed eget sagittis lacus, ac hendrerit enim. Curabitur quis tellus et odio scelerisque rhoncus at eget magna. Sed mattis sapien lacus, at auctor mauris tempor eget. Donec velit ipsum, blandit sed arcu eu, volutpat placerat massa. Fusce volutpat leo ut turpis mattis lobortis. Duis aliquam urna et ex hendrerit, sed lacinia leo volutpat. Aliquam et placerat metus. Duis tincidunt posuere mi, vel posuere magna vehicula at. Vestibulum ullamcorper justo massa, at maximus nisl dapibus eu. Cras eu odio vitae dolor maximus bibendum. Phasellus laoreet nulla quis pharetra eleifend. Nunc ac vestibulum dolor. </p>
          </div>
        </div>
      </div>
      <div className='section' id='skills-section'>
        <div id='skills-container'>
          <h2>Skills</h2>
        </div>
      </div>
      <div className='section' id='projects-section'>
        <div id='projects-container'>
          <h2>Projects</h2>
        </div>
      </div>
      <div className='section' id='contact-section'>
        <div id='contact-container'>
          <h2>Contact</h2>
        </div>
      </div>
    </div>
  );
}

export default Main;
