import React, { useState, useEffect } from 'react';
import './Skills.scss';
import { useStore } from '../../../../store';

function Skills() {
    const skills = useStore((state) => state.skills);

    const [skillsPerRow, setSkillsPerRow] = useState(3);

    let previousAcquired = 0;

    useEffect(() => {
        setDisplaySettings();

        // On window resize, change how the skills are displayed
        window.addEventListener('resize', () => {
            setDisplaySettings();
        });

        return () => {
            window.removeEventListener('resize', () => {
                setDisplaySettings();
            });
        };
    }, []);

    function setDisplaySettings() {
        const skillsContainer = document.getElementById('skills-container');

        if (window.innerWidth < 650) {
            setSkillsPerRow(1);
            skillsContainer.style.setProperty(`--rowGap`, '10px');
        } else if (window.innerWidth < 1024) {
            setSkillsPerRow(2);
            skillsContainer.style.setProperty(`--rowGap`, '20px');
        } else {
            setSkillsPerRow(3);
            skillsContainer.style.setProperty(`--rowGap`, '50px');
        }
    }

    function convertAcquiredNumberToString(acquired) {
        const decimal = acquired % 1;
        const integer = Math.floor(acquired);

        if (decimal < 0.01) return integer;
        if (decimal <= 0.25) return 'Early ' + integer;
        if (decimal <= 0.5) return 'Mid ' + integer;
        if (decimal <= 0.75) return 'Late ' + integer;
        return 'End ' + integer;
    }

    function renderSkillsTimeline() {
        // Order skills by acquired date
        const orderedSkills = [...skills].sort((a, b) => {
            if (a.acquired < b.acquired) return -1;
            if (a.acquired > b.acquired) return 1;
            return 0;
        });

        const elements = [];
        let rowElements = [];

        orderedSkills.forEach((skill, index) => {
            const isRowEnd = (index + 1) % skillsPerRow === 0;

            rowElements.push(skill);

            if (isRowEnd) {
                elements.push(rowElements);
                rowElements = [];
            }
        });

        if (rowElements.length > 0) elements.push(rowElements);

        return (
            <div className='timeline'>
                {elements.map((row, index) => {
                    const isEven = index % 2 === 0;
                    const isFirst = index === 0;
                    const isLast = index === elements.length - 1;

                    return renderSkillsRow(
                        row,
                        !isEven,
                        isFirst,
                        isLast,
                        index
                    );
                })}
            </div>
        );
    }

    function renderSkillsRow(skills, reverse, isFirst, isLast, key) {
        return (
            <div
                className={`timeline-row ${reverse ? 'reverse' : ''}`}
                key={key}
            >
                {skills.map((skill, index) => {
                    const isLastSkill = skill === skills[skills.length - 1];
                    const isVeryFirstSkill = skill === skills[0] && isFirst;
                    const acquired = skill.acquired;
                    const acquiredStr = convertAcquiredNumberToString(acquired);
                    const cachedPreviousAcquired = previousAcquired;

                    previousAcquired = acquiredStr;

                    if (isLastSkill && isLast) {
                        return (
                            <>
                                <div className='timeline-row-line'>
                                    <span
                                        className={
                                            'acquired ' +
                                            (cachedPreviousAcquired ===
                                            acquiredStr
                                                ? 'hidden'
                                                : '')
                                        }
                                    >
                                        {acquiredStr}
                                    </span>
                                </div>
                                {renderSkill(skill)}
                                <div className='timeline-row-line final'>
                                    <span className='acquired'>Today</span>
                                </div>
                                <div className='edge'></div>
                            </>
                        );
                    }

                    if (isLastSkill) {
                        return (
                            <>
                                <div className='timeline-row-line'>
                                    <span
                                        className={
                                            'acquired ' +
                                            (cachedPreviousAcquired ===
                                            acquiredStr
                                                ? 'hidden'
                                                : '')
                                        }
                                    >
                                        {acquiredStr}
                                    </span>
                                </div>
                                {renderSkill(skill)}
                                <div className='timeline-row-line'></div>
                            </>
                        );
                    }

                    return (
                        <>
                            {isVeryFirstSkill && index === 0 ? (
                                <div className='edge'></div>
                            ) : null}
                            <div
                                className={`timeline-row-line ${isVeryFirstSkill ? 'start' : ''}`}
                            >
                                <span
                                    className={
                                        'acquired ' +
                                        (cachedPreviousAcquired === acquiredStr
                                            ? 'hidden'
                                            : '')
                                    }
                                >
                                    {acquiredStr}
                                </span>
                            </div>
                            {renderSkill(skill)}
                        </>
                    );
                })}
            </div>
        );
    }

    function renderSkill(skill, key) {
        const { name, imageURL } = skill;

        return (
            <button className='timeline-skill-btn' key={key}>
                <img src={imageURL} alt={name} draggable={false} />
                {/* <span>{convertAcquiredNumberToString(acquired)}</span> */}
                <span>{name}</span>
            </button>
        );
    }

    return (
        <div id='skills-container'>
            <h2>Skills</h2>
            {renderSkillsTimeline()}
        </div>
    );
}

export default Skills;
