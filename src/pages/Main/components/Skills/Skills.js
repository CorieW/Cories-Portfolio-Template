import React, {useState, useEffect} from 'react';
import './Skills.scss';
import firebase from '../../../../firebase.js';
import Loading from '../Loading/Loading';

function Skills() {
    const [skillCategories, setSkillCategories] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    function fetchSkills() {
        // get and add skills to skillCategories
        const db = firebase.firestore();
        let skillsRef = db.collection('skills').orderBy('priority', 'desc');

        const storageRef = firebase.storage().ref();

        skillsRef.get().then(async (querySnapshot) => {
            console.log(1);
            const skillsCategories = [];
          
            for (const doc of querySnapshot.docs) {
              const skillsCategory = doc.data();
          
              const getImageURLPromises = skillsCategory.skills.map(async (skill) => {
                try {
                  const imageRef = storageRef.child(skill.imageURL);
                  const url = await imageRef.getDownloadURL();
                  skill.imageURL = url;
                  console.log(2);
                } catch (error) {
                  console.error('Error retrieving image URL:', error);
                }
              });
          
              await Promise.all(getImageURLPromises);
              skillsCategories.push(skillsCategory);
            }
          
            console.log('skillsCategories:', skillsCategories);
            setSkillCategories(skillsCategories);
          
            console.log('loaded');
          });
    }

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
