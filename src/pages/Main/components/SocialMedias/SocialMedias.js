import React, { useState } from 'react'
import { useEffect } from 'react'
import './SocialMedias.scss'
import { useStore } from '../../../../store'

function SocialMedias() {
    const socialMedias = useStore(state => state.socialMedias)

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