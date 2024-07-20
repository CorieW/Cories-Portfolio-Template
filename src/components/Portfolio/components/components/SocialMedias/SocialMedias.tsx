import ISocialMedia from '../../../../../ts/ISocialMedia';
import './SocialMedias.scss';

type Props = {
    displayNames?: boolean;
    socialMedias: ISocialMedia[];
};

function SocialMedias(props: Props) {
    const { displayNames = false, socialMedias } = props;

    function renderSocialMedias() {
        return (
            <>
                {socialMedias.map((socialMedia, index) => (
                    <button key={index} className='general-btn-1 social-media-btn'>
                        <a
                            href={socialMedia.url}
                            target='_blank'
                            rel='noreferrer'
                            aria-label={socialMedia.title}
                        ></a>
                        <p>
                            {renderIcon(socialMedia.title, socialMedia.iconType, socialMedia.icon)}
                            {displayNames ? (
                                <span className='social-media-title'>
                                    {socialMedia.title}
                                </span>
                            ) : null}
                        </p>
                    </button>
                ))}
            </>
        );
    }

    function renderIcon(title: string, iconType: string, icon: string) {
        if (iconType === 'ClassName') {
            return <i className={`${icon}`}></i>;
        } else if (iconType === 'ImageSrc') {
            return <img src={icon} alt={title} />;
        } else {
            return <p>{title}</p>;
        }
    }

    return <div className='social-medias'>{renderSocialMedias()}</div>;
}

export default SocialMedias;
