import './AboutMe.scss';
import { useState, useEffect } from 'react';
import SocialMedias from '../SocialMedias/SocialMedias.js';
import { useStore } from '../../../../store';

function AboutMe() {
    const aboutMe = useStore((state) => state.aboutMe);

    const [profileImgURL, setProfileImgURL] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [infoText, setInfoText] = useState('');

    useEffect(() => {
        if (aboutMe) {
            setHeaderText(aboutMe.headerText);
            setInfoText(aboutMe.infoText);
            setProfileImgURL(aboutMe.profileImgURL);
        }
    }, [aboutMe]);

    return (
        <div id='about-me-container'>
            <div id='upper-container'>
                <div id='img-container'>
                    <img src={profileImgURL} alt='Profile image' />
                </div>
                <h2 dangerouslySetInnerHTML={{ __html: headerText }}></h2>
            </div>
            <div id='info-container'>
                <p dangerouslySetInnerHTML={{ __html: infoText }}></p>
                <SocialMedias displayNames={true} />
            </div>
        </div>
    );
}

export default AboutMe;
