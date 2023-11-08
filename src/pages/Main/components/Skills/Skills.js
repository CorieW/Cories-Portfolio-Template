import React, {useState, useEffect} from 'react';
import './Skills.scss';
import Loading from '../Loading/Loading';
import requests from '../../../../requests';

function Skills() {
    const [skills, setSkills] = useState(null);

    const skillsPerRow = 3;

    let previousAcquired = 0;

    useEffect(() => {
        requests.fetchSkills2().then((data) => {
            const orderedSkills = data.sort((a, b) => {
                return a.acquired - b.acquired;
            });

            console.log('orderedSkills', orderedSkills);

            setSkills(orderedSkills);
        })
    }, []);

    function convertAcquiredNumberToString(acquired) {
        const decimal = acquired % 1;
        const integer = Math.floor(acquired);

        if (decimal === 0) return integer;
        if (decimal < 0.25) return 'Early ' + integer;
        if (decimal < 0.5) return 'Mid ' + integer;
        if (decimal < 0.75) return 'Late ' + integer;
        return 'End ' + integer;
    }

    function renderSkillsTimeline() {
        const elements = [];

        let rowElements = [];

        skills.forEach((skill, index) => {
            const isRowEnd = (index + 1) % skillsPerRow === 0;

            rowElements.push(skill);

            if (isRowEnd) {
                elements.push(rowElements);
                rowElements = [];
            }
        });

        if (rowElements.length > 0) elements.push(rowElements);

        console.log('elements', elements);

        return (
            <div className='timeline'>
                {elements.map((row, index) => {
                    const isEven = index % 2 === 0;
                    const isLast = index === elements.length - 1;

                    return renderSkillsRow(row, !isEven, isLast);
                })}
            </div>
        )
    }

    function renderSkillsRow(skills, reverse, isLast) {
        return (
            <div className={`timeline-row ${reverse ? 'reverse' : ''}`}>
                {skills.map((skill, index) => {
                    const isLastSkill = skill === skills[skills.length - 1];

                    const acquired = skill.acquired;
                    const acquiredStr = convertAcquiredNumberToString(skill.acquired);
                    const cachedPreviousAcquired = previousAcquired;

                    previousAcquired = acquired;

                    if (isLastSkill && isLast) {
                        return (
                            <>
                                <div className='timeline-row-line'>
                                    <span className={'acquired ' + (cachedPreviousAcquired === acquired ? 'hidden' : '')}>
                                        { acquiredStr }
                                    </span>
                                </div>
                                { renderSkill(skill) }
                                <div className='timeline-row-line'>
                                    <span className='acquired'>
                                        Now
                                    </span>
                                </div>
                            </>
                        )
                    }

                    if (isLastSkill) {
                        return (
                            <>
                                <div className='timeline-row-line'>
                                    <span className={'acquired ' + (cachedPreviousAcquired === acquired ? 'hidden' : '')}>
                                        { acquiredStr }
                                    </span>
                                </div>
                                { renderSkill(skill) }
                                <div className='timeline-row-line'></div>
                            </>
                        )
                    }

                    return (
                        <>
                            <div className='timeline-row-line'>
                                <span className={'acquired ' + (cachedPreviousAcquired === acquired ? 'hidden' : '')}>
                                    { acquiredStr }
                                </span>
                            </div>
                            { renderSkill(skill) }
                        </>
                    )
                })}
            </div>
        )
    }

    function renderSkill(skill, key) {
        const {name, imageURL} = skill;

        return (
            <button className='timeline-skill-btn' key={key}>
                <img src={imageURL} alt={name}/>
                {/* <span>{convertAcquiredNumberToString(acquired)}</span> */}
                <span>{name}</span>
            </button>
        )
    }

    if (!skills) return (
        <div id='skills-container'>
            <Loading />
        </div>
    )
    return (
        <div id='skills-container'>
            <h2>Skills</h2>
            {renderSkillsTimeline()}
        </div>
    )
}

export default Skills;
