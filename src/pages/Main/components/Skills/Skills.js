import React, {useState, useEffect} from 'react';
import './Skills.scss';
import Loading from '../Loading/Loading';
import requests from '../../../../requests';

function Skills() {
    const [skillCategories, setSkillCategories] = useState(null);

    useEffect(() => {
        requests.fetchSkills().then((data) => {
            setSkillCategories(data.skillsCategories);
        })
    }, []);

    function getSkillsListContainer() {
        return (
            <div id='skills-content-container'>

                {skillCategories.map((category, index) => {
                    return (
                        <div className='skill-category-container' key={index}>
                            <div className='skill-category'>
                                <p className='category'>{category.category}</p>
                            </div>
                            <ul className='skills-list'>
                                {category.skills.map((skill, index) => {
                                    return (
                                        <li className='skill-listing' key={index}>
                                            <img src={skill.imageURL} alt='Skill icon' className='skill-icon' />
                                            <p className='skill-name'>{skill.name}</p>
                                            <p className='skill-desc'>{skill.desc}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (!skillCategories) return (
        <div id='skills-container'>
            <Loading />
        </div>
    )
    return (
        <div id='skills-container'>
            <h2>Skills</h2>
            {getSkillsListContainer()}
        </div>
    )
}

export default Skills;
