import { useState, useEffect } from 'react';
import $ from 'jquery';
import './styles/Main.scss';
import Nav from '../../components/Nav/Nav';
import selfie from '../../assets/profile_img.jpg';
import Skills from './components/Skills/Skills';

function Main() {
  const [activeSectionID, setActiveSectionID] = useState('about-me-section');
  const sectionHashes = ['about-me-section', 'skills-section', 'projects-section', 'contact-section'];
  let currSectionIndex = 0;
  let prevScrollY = 0;
  let sectionLocked = true;

  useEffect(() => {
    const getActiveSectionIndexByHashValue = (hashValue) => {
      for (let i = 0; i < sectionHashes.length; i++) {
        if (sectionHashes[i] === hashValue) return i;
      }
      return 0;
    }

    const switchToActiveSection = () => {
      const sectionElements = document.getElementsByClassName('section');
      let activeSection = sectionElements[currSectionIndex];
      const scrollOptions = {
        top: activeSection.offsetTop,
        behavior: 'smooth'
      }
      console.log(activeSection.offsetTop)
      // Disable the section lock
      sectionLocked = false;
      // Scroll to the active section
      window.scrollTo(scrollOptions);
    }

    // Get the current hash value
    const hashValue = window.location.hash.substring(1);
    // Set the section index to the index of the section with the hash value
    currSectionIndex = getActiveSectionIndexByHashValue(hashValue);
    if (currSectionIndex !== 0) switchToActiveSection();

    // Add event listener to listen for changes in the hash value
    // When the hash value changes, update the active hash value.
    const handleHashChange = (e) => {
      // Get the updated hash value
      const updatedHashValue = window.location.hash.substring(1);
      // Set the section index to the index of the section with the updated hash value
      currSectionIndex = getActiveSectionIndexByHashValue(updatedHashValue);
      // Scroll to the active section
      switchToActiveSection();
    };

    window.addEventListener('hashReplaced', handleHashChange);

    const handleScroll = (e) => {
      // Get the current scroll position
      const scrollPosition = window.scrollY;
      const bottomPostionOfView = window.scrollY + window.innerHeight;

      // Get the sections
      const sectionElements = document.getElementsByClassName('section');

      // Get the active section
      let activeSection = sectionElements[currSectionIndex];
      let sectionTop = activeSection.offsetTop;
      let sectionBottom = sectionTop + activeSection.offsetHeight;

      // Clamp the scroll position to the current section
      let remainingScrollFromBottom = sectionBottom - bottomPostionOfView;
      let remainingScrollFromTop = scrollPosition - sectionTop;

      if (!sectionLocked) {
        if (Math.round(remainingScrollFromTop) === 0) {
          console.log('Section locked');
          sectionLocked = true;
          // Now that the section is locked, update the active section ID
          setActiveSectionID(sectionElements[currSectionIndex].id);
          // Update the hash value
          window.history.replaceState(null, null, `#${sectionElements[currSectionIndex].id}`);
        }
        
        return;
      }
      
      if (Math.round(remainingScrollFromBottom) <= 0) {
        const scrollOptions = {
          top: sectionBottom - window.innerHeight,
          behavior: 'auto'
        }

        window.scrollTo(scrollOptions);
      }
      if (Math.round(remainingScrollFromTop) <= 0) {
        const scrollOptions = {
          top: sectionTop,
          behavior: 'auto'
        }

        window.scrollTo(scrollOptions);
      }

      prevScrollY = scrollPosition;
    };

    window.addEventListener('scroll', handleScroll);

    const handleNavOnScroll = () => {
      const scrollPosition = window.scrollY;
      const sectionElements = document.getElementsByClassName('section');
      let activeSection = sectionElements[currSectionIndex];
      let sectionTop = activeSection.offsetTop;

      // Get distance from top of the section
      let distanceFromTopOfSection = Math.round(sectionTop - scrollPosition);

      // Show nav bar when at top of the section
      if (distanceFromTopOfSection === 0) {
        document.getElementById('nav-container').classList.remove('hidden');
      } else {
        document.getElementById('nav-container').classList.add('hidden');
      }
    }

    window.addEventListener('scroll', handleNavOnScroll);

    const moveSection = (e) => {
      if (!sectionLocked) {
        e.preventDefault();
        // Interrupted scroll, continue scrolling to the active section
        switchToActiveSection();
        return;
      }

      const sectionElements = document.getElementsByClassName('section');
      let activeSection = sectionElements[currSectionIndex];
      
      // Check if the current section is in view
      let sectionTop = activeSection.offsetTop;
      let sectionBottom = sectionTop + activeSection.offsetHeight;
      let remainingScrollFromTop = window.scrollY - sectionTop;
      let remainingScrollFromBottom = sectionBottom - (window.scrollY + window.innerHeight);

      const scrollDownReady = Math.round(remainingScrollFromBottom) <= 0;
      const scrollUpReady = Math.round(remainingScrollFromTop) <= 0;

      if (scrollDownReady && e.deltaY > 0 && sectionElements.length !== currSectionIndex + 1) currSectionIndex += 1;
      else if (scrollUpReady && e.deltaY < 0 && currSectionIndex !== 0) currSectionIndex -= 1;
      else return

      switchToActiveSection();
    }

    window.addEventListener('touchmove', moveSection, { passive: false });
    window.addEventListener('wheel', moveSection, { passive: false });

    // Clean up the event listener on component unmount
    return () => {
      // window.removeEventListener('load', handleLoad);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleNavOnScroll);
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

  function onLinkClick(e) {
    e.preventDefault();
    const hash = e.target.hash.substring(1);
    window.history.replaceState(null, null, `#${hash}`);

    const event = new CustomEvent('hashReplaced', { detail: { hash } });
    window.dispatchEvent(event);
  }

  function getLinkComponentFor(hashValue, name, defActive = false) {
    // Check if the hash value matches the active hash value
    // This is used to determine if the link is active
    let isActive = activeSectionID === hashValue;
    return (
      <li><a href={'#' + hashValue} className={isActive ? 'active' : ''} onClick={onLinkClick}>{name}</a></li>
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
        <Skills />
      </div>
      <div className='section' id='projects-section'>
        <h2>Projects</h2>
        <div id='projects-container'>
        </div>
      </div>
      <div className='section' id='contact-section'>
        <h2>Contact</h2>
        <div id='contact-container'>
        </div>
      </div>
    </div>
  );
}

export default Main;
