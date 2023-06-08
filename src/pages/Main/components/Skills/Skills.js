import React, {useState, useEffect} from 'react';
import './Skills.scss';

function Skills() {
    const [skillCategories, setSkillCategories] = useState([
        {
            category: 'Programming Language',
            skills: [
                {
                    name: 'JavaScript',
                    proficiency: 'Proficient'
                },
                {
                    name: 'HTML',
                    proficiency: 'Proficient'
                },
                {
                    name: 'CSS',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Java',
                    proficiency: 'Proficient'
                },
                {
                    name: 'C#',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Python',
                    proficiency: 'Proficient'
                }
            ]
        },
        {
            category: 'Framework',
            skills: [
                {
                    name: 'React',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Node.js',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Express',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Bootstrap',
                    proficiency: 'Proficient'
                },
                {
                    name: 'jQuery',
                    proficiency: 'Proficient'
                },
                {
                    name: 'ASP.NET',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Swing',
                    proficiency: 'Proficient'
                }
            ]
        },
        {
            category: 'Database',
            skills: [
                {
                    name: 'MySQL',
                    proficiency: 'Proficient'
                },
                {
                    name: 'SQLite',
                    proficiency: 'Proficient'
                },
                {
                    name: 'SQL Server',
                    proficiency: 'Proficient'
                }
            ]
        },
        {
            category: 'ORM',
            skills: [
                {
                    name: 'Sequelize',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Entity Framework',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Hibernate',
                    proficiency: 'Proficient'
                }
            ]
        },
        {
            category: 'Other',
            skills: [
                {
                    name: 'Git',
                    proficiency: 'Proficient'
                },
                {
                    name: 'GitHub',
                    proficiency: 'Proficient'
                },
                {
                    name: 'Unity',
                    proficiency: 'Proficient'
                }
            ]
        }
    ]);

    function getSkillsListContainer() {
        console.log(skillCategories)
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
                                            <img src='https://via.placeholder.com/50' alt='Skill icon' className='skill-icon' />
                                            <p className='skill-name'>{skill.name}</p>
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

    return (
        <div id='skills-container'>
            <h2>Skills</h2>
            {getSkillsListContainer()}
        </div>
    )
}

export default Skills;
