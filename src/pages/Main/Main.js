import { useState, useRef, useEffect } from 'react';
import $ from 'jquery';
import './Main.scss';
import Nav from '../../components/Nav/Nav';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import AboutMe from './components/AboutMe/AboutMe';
import Contact from './components/Contact/Contact';
import Toast from '../../components/Toast/Toast';
import StarryCanvas from '../../components/StarryCanvas/StarryCanvas';
import { useStore } from '../../store'
import requests from '../../requests.js'
import LoadingScreen from './components/LoadingScreen/LoadingScreen.js';

function Main() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sectionHashes, setSectionHashes] = useState([]);
  const currSectionIndexRef = useRef(0);
  const sectionLockedRef = useRef(true);

  const setAboutMe = useStore(state => state.setAboutMe)
  const setSkills = useStore(state => state.setSkills)
  const setProjects = useStore(state => state.setProjects)
  const setContactInfo = useStore(state => state.setContactInfo)
  const setSocialMedias = useStore(state => state.setSocialMedias)

  const projects = useStore(state => state.projects);

  // Handle loading the data
  useEffect(() => {
    loadEverything()

    async function loadEverything() {
      const isProduction = process.env.NODE_ENV === 'production';

      const aboutMe = await requests.fetchAboutMe();
      const skills = await requests.fetchSkills();
      const projects = await requests.fetchProjects(isProduction);
      const contactInfo = await requests.fetchContactInfo();
      const socialMedias = await requests.fetchSocialMedias();

      setAboutMe(aboutMe)
      setSkills(skills)
      setProjects(projects)
      setContactInfo(contactInfo)
      setSocialMedias(socialMedias)

      setIsLoaded(true);
      setRegularSectionHashes(projects.length !== 0)
    }

    function setRegularSectionHashes(withProjects) {
      setSectionHashes(['about-me-section', 'skills-section', withProjects ? 'projects-section' : null, 'contact-section'].filter(Boolean));
    }
  }, [])

  useEffect(() => {
    const getActiveSectionIndexByHashValue = (hashValue) => {
      for (let i = 0; i < sectionHashes.length; i++) {
        if (sectionHashes[i] === hashValue) return i;
      }
      return 0;
    }

    // Get the current hash value
    const hashValue = window.location.hash.substring(1);
    // Set the section index to the index of the section with the hash value
    currSectionIndexRef.current = getActiveSectionIndexByHashValue(hashValue);
    setActiveSectionIndex(currSectionIndexRef.current);
    if (currSectionIndexRef.current !== 0) switchToActiveSection();

    // Handles moving to the next or previous section
    // when the user scrolls past or before the current section
    const moveSection = (e) => {
      if (!sectionLockedRef.current) {
        e.preventDefault();
        // Interrupted scroll, continue scrolling to the active section
        switchToActiveSection();
        return;
      }

      const sectionElements = document.getElementsByClassName('section');
      let activeSection = sectionElements[currSectionIndexRef.current];

      // Check if the current section is in view
      let sectionTop = activeSection.offsetTop;
      let sectionBottom = sectionTop + activeSection.offsetHeight;
      let remainingScrollFromTop = window.scrollY - sectionTop;
      let remainingScrollFromBottom = sectionBottom - (window.scrollY + window.innerHeight);

      const scrollDownReady = Math.round(remainingScrollFromBottom) <= 0;
      const scrollUpReady = Math.round(remainingScrollFromTop) <= 0;
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const isLastSection = currSectionIndexRef.current === sectionElements.length + 1;
      const isFirstSection = currSectionIndexRef.current === 0;

      if (scrollDownReady && isScrollingDown && !isLastSection) {
        // Move to the next section
        currSectionIndexRef.current += 1;
        e.preventDefault();
      } else if (scrollUpReady && isScrollingUp && !isFirstSection) {
        // Move to the previous section
        currSectionIndexRef.current -= 1;
        e.preventDefault();
      } else return;

      switchToActiveSection();
    }

    window.addEventListener('touchmove', moveSection, { passive: false });
    window.addEventListener('wheel', moveSection, { passive: false });

    // Handles locking and unlocking the user to/from the current section
    const trackScroll = (e) => {
      const scrollPosition = window.scrollY;
      const bottomPostionOfView = window.scrollY + window.innerHeight;

      const sectionElements = document.getElementsByClassName('section');

      let activeSection = sectionElements[currSectionIndexRef.current];
      let sectionTop = activeSection.offsetTop;
      let sectionBottom = sectionTop + activeSection.offsetHeight;

      // Get the distance from the top of the section and the bottom of the currently selected section
      let remainingScrollFromBottom = sectionBottom - bottomPostionOfView;
      let remainingScrollFromTop = scrollPosition - sectionTop;

      // Currently section is not locked, meaning the user is scrolling to a section
      if (!sectionLockedRef.current) {
        // Section is in view, lock the section
        if (Math.round(remainingScrollFromTop) === 0) {
          // Lock the user to the current section
          sectionLockedRef.current = true;
          // Now that the section is locked, update the active section index
          setActiveSectionIndex(currSectionIndexRef.current);
          // Update the hash value in the URL to that of the active section
          window.history.replaceState(null, null, `#${sectionElements[currSectionIndexRef.current].id}`);
        }

        // Otherwise, don't do anything, continue to wait for the section to be in view
        return;
      }

      // Lock the user to the current section if they scroll past the top or bottom of the section
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
    };

    window.addEventListener('scroll', trackScroll);

    const handleNavOnScroll = () => {
      const nextSectionDist = distanceFromNextSection();

      // Show nav bar when at top of the section
      if (nextSectionDist === 0) {
        document.getElementById('nav-container').classList.remove('hidden');
      } else {
        document.getElementById('nav-container').classList.add('hidden');
      }
    }

    window.addEventListener('scroll', handleNavOnScroll);

    // Add event listener to listen for changes in the hash value
    // When the hash value changes, update the active hash value.
    const handleHashReplaced = (e) => {
      // Get the updated hash value
      const updatedHashValue = window.location.hash.substring(1);
      // Set the section index to the index of the section with the updated hash value
      currSectionIndexRef.current = getActiveSectionIndexByHashValue(updatedHashValue);
      // Scroll to the active section
      switchToActiveSection();
    };

    window.addEventListener('hashReplaced', handleHashReplaced);

    function distanceFromTopOfSection(section) {
      const scrollPosition = window.scrollY;
      const sectionTop = section.offsetTop;
      return Math.round(sectionTop - scrollPosition);
    }

    function distanceFromNextSection() {
      const sectionElements = document.getElementsByClassName('section');
      const nextSection = sectionElements[currSectionIndexRef.current];
      return distanceFromTopOfSection(nextSection);
    }

    // Clean up the event listener on component unmount
    return () => {
      // window.removeEventListener('load', handleLoad);
      window.removeEventListener('touchmove', moveSection);
      window.removeEventListener('wheel', moveSection);
      window.removeEventListener('scroll', trackScroll);
      window.removeEventListener('scroll', handleNavOnScroll);
      window.removeEventListener('hashReplaced', handleHashReplaced);
    };
  }, [sectionHashes]);

  function getLinksComponent() {
    return (
      <>
        {getLinkComponentFor('about-me-section', 'About Me')}
        {getLinkComponentFor('skills-section', 'Skills')}
        {projects.length === 0 ? null : getLinkComponentFor('projects-section', 'Projects')}
        {getLinkComponentFor('contact-section', 'Contact')}
      </>
    )
  }

  function getLinkComponentFor(hashValue, name) {
    const handleLinkClick = (e) => {
      e.preventDefault();
      const hash = e.target.hash.substring(1);
      window.history.replaceState(null, null, `#${hash}`);

      const event = new CustomEvent('hashReplaced', { detail: { hash } });
      window.dispatchEvent(event);
    }

    // Check if the hash value matches the active hash value
    // This is used to determine if the link is active
    let isActive = sectionHashes[activeSectionIndex] === hashValue;
    return (
      <li><a href={'#' + hashValue} className={isActive ? 'active' : ''} onClick={handleLinkClick}>{name}</a></li>
    )
  }

  function switchToActiveSection() {
    console.log('switching to active section');
    const sectionElements = document.getElementsByClassName('section');
    let activeSection = sectionElements[currSectionIndexRef.current];
    const scrollOptions = {
      top: activeSection.offsetTop,
      behavior: 'smooth'
    }
    // Disable the section lock
    sectionLockedRef.current = false;
    // Scroll to the active section
    window.scrollTo(scrollOptions);
  }

  function switchSectionInDirection(direction) {
    // Can't move down if at the bottom
    if (direction === 1 && activeSectionIndex === sectionHashes.length - 1) return;
    // Can't move up if at the top
    if (direction === -1 && activeSectionIndex === 0) return;

    currSectionIndexRef.current = activeSectionIndex + direction;
    switchToActiveSection();
  }

  function isMoveSectionBtnDisabled(direction) {
    // Can't move down if at the bottom
    if (direction === 1 && activeSectionIndex === sectionHashes.length - 1) return true;
    // Can't move up if at the top
    if (direction === -1 && activeSectionIndex === 0) return true;
    return false;
  }

  function getProjectsSection() {
    return (
      <div className='section' id='projects-section'>
        <Projects />
      </div>
    )
  }

  return (
    <div id='main-page-container'>
      <Toast />
      <StarryCanvas />
      <Nav linksComponent={sectionHashes.length === 0 ? null : getLinksComponent() }/>

      <div className={isLoaded ? 'fade-out-display-none' : 'fade-in-500ms'}>
        <LoadingScreen />
      </div>

      <div id='sections' className={isLoaded ? 'fade-in-500ms' : 'hide'}>
        <div id='move-section-btns-container' className='fixed-container'>
          <button className={'general-btn-1 ' + (isMoveSectionBtnDisabled(-1) ? 'disabled' : '')} id='move-section-up-btn' onClick={() => switchSectionInDirection(-1)}><i className="fa-solid fa-arrow-up"></i></button>
          <button className={'general-btn-1 ' + (isMoveSectionBtnDisabled(1) ? 'disabled' : '')} id='move-section-down-btn' onClick={() => switchSectionInDirection(1)}><i className="fa-solid fa-arrow-down"></i></button>
        </div>
        <div className='section' id='about-me-section'>
          <AboutMe />
        </div>
        <div className='section' id='skills-section'>
          <Skills />
        </div>
        {projects.length === 0 ? null : getProjectsSection()}
        <div className='section' id='contact-section'>
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default Main;
