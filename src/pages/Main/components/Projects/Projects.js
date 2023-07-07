import React, {useState, useEffect} from 'react';
import './styles/Projects.scss';
import firebase from '../../../../firebase.js';

function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    function fetchProjects() {
        const db = firebase.firestore();
        const projectsRef = db.collection('projects');

        projectsRef.get().then((querySnapshot) => {
            let projects = [];
            querySnapshot.forEach((doc) => {
                projects.push(doc.data());
            });
            setProjects(projects);
        });
    }

    return (
        <div id='projects-container'>
            <h2>Projects</h2>
            <ul className='list-container'>
                <li className='project-listing'>
                    <a className='absolute-btn'></a>
                    <img src='https://via.placeholder.com/150' alt='Project thumbnail' className='project-thumbnail' />
                    <div className='info-container'>
                        <p className='project-title'>Example Project</p>
                        <p className='project-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor lectus ut magna sollicitudin dignissim. Suspendisse non lacus ac nibh lacinia aliquam.</p>
                        <p className='more-info'>Click for more info</p>
                    </div>
                </li>
                <li className='project-listing'>
                    <a className='absolute-btn'></a>
                    <img src='https://via.placeholder.com/150' alt='Project thumbnail' className='project-thumbnail' />
                    <div className='info-container'>
                        <p className='project-title'>Example Project</p>
                        <p className='project-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor lectus ut magna sollicitudin dignissim. Suspendisse non lacus ac nibh lacinia aliquam.</p>
                        <p className='more-info'>Click for more info</p>
                    </div>
                </li>
                <li className='project-listing'>
                    <a className='absolute-btn'></a>
                    <img src='https://via.placeholder.com/150' alt='Project thumbnail' className='project-thumbnail' />
                    <div className='info-container'>
                        <p className='project-title'>Example Project</p>
                        <p className='project-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor lectus ut magna sollicitudin dignissim. Suspendisse non lacus ac nibh lacinia aliquam.</p>
                        <p className='more-info'>Click for more info</p>
                    </div>
                </li>
                <li className='project-listing'>
                    <a className='absolute-btn'></a>
                    <img src='https://via.placeholder.com/150' alt='Project thumbnail' className='project-thumbnail' />
                    <div className='info-container'>
                        <p className='project-title'>Example Project</p>
                        <p className='project-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor lectus ut magna sollicitudin dignissim. Suspendisse non lacus ac nibh lacinia aliquam.</p>
                        <p className='more-info'>Click for more info</p>
                    </div>
                </li>
                <li className='project-listing'>
                    <a className='absolute-btn'></a>
                    <img src='https://via.placeholder.com/150' alt='Project thumbnail' className='project-thumbnail' />
                    <div className='info-container'>
                        <p className='project-title'>Example Project</p>
                        <p className='project-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor lectus ut magna sollicitudin dignissim. Suspendisse non lacus ac nibh lacinia aliquam.</p>
                        <p className='more-info'>Click for more info</p>
                    </div>
                </li>
                <li className='project-listing'>
                    <a className='absolute-btn'></a>
                    <img src='https://via.placeholder.com/150' alt='Project thumbnail' className='project-thumbnail' />
                    <div className='info-container'>
                        <p className='project-title'>Example Project</p>
                        <p className='project-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempor lectus ut magna sollicitudin dignissim. Suspendisse non lacus ac nibh lacinia aliquam.</p>
                        <p className='more-info'>Click for more info</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Projects;
