import './AboutMe.scss';
import SocialMedias from '../SocialMedias/SocialMedias.js';
import IAboutMe from '../../../../../ts/data/IAboutMe.js';
import ISocialMedia from '../../../../../ts/data/ISocialMedia.js';

type Props = {
    aboutMe: IAboutMe;
    socialMedias: ISocialMedia[];
};

function AboutMe(props: Props) {
    const { aboutMe, socialMedias } = props;
    const { header, profileImageUrl, description } = aboutMe;

    return (
        <div id='about-me-container'>
            <div className='upper-container'>
                <div className='profile-img-container'>
                    <img src={profileImageUrl} alt='Profile image' />
                </div>
                <h1 dangerouslySetInnerHTML={{ __html: header }}></h1>
            </div>
            <div className='profile-info-container'>
                <p dangerouslySetInnerHTML={{ __html: description }}></p>
                <SocialMedias socialMedias={socialMedias} displayNames={true} />
            </div>
        </div>
    );
}

export default AboutMe;
