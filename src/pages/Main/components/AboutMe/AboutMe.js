import './AboutMe.scss';
import { useState, useEffect } from 'react';
import requests from '../../../../requests.js';
import SocialMedias from '../SocialMedias/SocialMedias.js';

function AboutMe() {
    const [profileImgUrl, setProfileImgUrl] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [infoText, setInfoText] = useState('');

    useEffect(() => {
        requests.fetchAboutMe().then((data) => {
            console.log(data);
            setProfileImgUrl(data.profileImgUrl);
            setHeaderText(data.headerText);
            setInfoText(data.infoText);
        });
    }, []);

    return (
        <div id='about-me-container'>
            <div id='upper-container'>
                <div id='img-container'>
                    <img src={profileImgUrl} alt='Profile image' />
                </div>
                <h2 dangerouslySetInnerHTML={{__html: headerText}}></h2>
            </div>
            <div id='info-container'>
                <p dangerouslySetInnerHTML={{__html: infoText}}></p>
                <SocialMedias />
            </div>
        </div>
    )
}

export default AboutMe;