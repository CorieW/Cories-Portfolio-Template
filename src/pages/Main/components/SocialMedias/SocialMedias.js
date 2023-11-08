import React, { useState } from 'react'
import { useEffect } from 'react'
import requests from '../../../../requests'
import './SocialMedias.scss'

function SocialMedias() {
    const [socialMedias, setSocialMedias] = useState([])

    useEffect(() => {
        requests.fetchSocialMedias().then((socialMedias) => {
            setSocialMedias(socialMedias)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    function renderSocialMedias() {
        return (
            <>
                {socialMedias.map((socialMedia, index) => (
                    <button key={index} className='general-btn-1'>
                        <a href={socialMedia.url} target="_blank" rel="noreferrer" aria-label={socialMedia.title}>
                            {renderIcon(socialMedia)}
                        </a>
                    </button>
                ))}
            </>
        )
    }

    function renderIcon(socialMedia) {
        const isFontAwesome = socialMedia.icon.startsWith('fa')

        if (isFontAwesome) {
            return (
                <i className={`fab ${socialMedia.icon}`}></i>
            )
        } else {
            return (
                <img src={socialMedia.icon} alt={socialMedia.title} />
            )
        }
    }

    return (
        <div className='social-medias'>
            {renderSocialMedias()}
        </div>
    )
}

export default SocialMedias