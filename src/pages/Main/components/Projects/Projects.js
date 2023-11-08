import React, {useState, useEffect, useRef} from 'react';
import './styles/Projects.scss';
import requests from '../../../../requests.js';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [slideIndex, setSlideIndex] = useState(null);
    const [nextSlideTimeout, setNextSlideTimeout] = useState(null);

    useEffect(() => {
        requests.fetchProjects().then((data) => {
            setProjects(data.projects);
        });
    }, []);

    useEffect(() => {
        // When projects are fetched, set the slideshow's background color
        // to match the first project's background color
        const slideshow = document.getElementById('projects-slideshow');
        const project = projects[slideIndex];

        if (project) {
            slideshow.style.backgroundColor = project.bgColor;
        }

        setSlideIndex(0);
    }, [projects]);

    useEffect(() => {
        if (typeof slideIndex !== 'number') return;
        if (nextSlideTimeout) clearTimeout(nextSlideTimeout);

        // When the slide index changes, update slideshow's background color
        // to match the project's background color
        const slideshow = document.getElementById('projects-slideshow');
        const project = projects[slideIndex];

        if (project) {
            slideshow.style.backgroundColor = project.bgColor;
        }

        setNextSlideTimeout(setTimeout(() => {
            setSlideIndex((slideIndex + 1) % projects.length);
        }, 5000));
    }, [slideIndex, projects]);

    function displayProjects() {
        return projects.map((project, i) => {
            const className = 'slide' + (i == slideIndex ? ' active' : '');

            return (
                <li className={className} key={i}>
                    <img src={project.showcaseImg} alt={project.title} className='project-showcase-img' />
                </li>
            )
        });
    }

    // Display an indicator for each project
    // First indicator is active
    function displayIndicators() {
        return projects.map((project, i) => {
            return (
                <a className={ 'slide-indicator' + (i == slideIndex ? ' active' : '') }
                    onClick={ () => setSlideIndex(i) }
                    key={i}>
                </a>
            )
        });
    }

    return (
        <div id='projects-slideshow'>
            <ul className='slide-list'>
                <div className='encompassing-shadow-box'></div>

                { displayProjects() }
            </ul>

            <ul className='slide-indicators'>
                { displayIndicators() }
            </ul>
        </div>
    )
}

export default Projects;
