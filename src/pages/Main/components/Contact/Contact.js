import React, { useState, useEffect } from 'react';
import './Contact.scss';
import axios from 'axios';
import { useStore } from '../../../../store';
import SocialMedias from '../SocialMedias/SocialMedias';

function Contact() {
    const contactInfo = useStore((state) => state.contactInfo);
    const setToast = useStore((state) => state.setToast);

    const [sending, setSending] = useState(false);

    function sendEmail(e) {
        e.preventDefault();

        if (sending) return;

        const form = e.target;
        const formData = new FormData(form);
        const data = {
            fname: formData.get('fname'),
            sname: formData.get('sname'),
            email: formData.get('email'),
            title: formData.get('title'),
            message: formData.get('message'),
        };

        if (!validate(data)) return;

        setSending(true);
        setToast({ type: 'info', message: 'Sending message...' });

        axios
            .post(
                'https://europe-north1-portfolio-9202d.cloudfunctions.net/sendEmail',
                data
            )
            .then((response) => {
                if (response.status === 200) {
                    setToast({
                        type: 'success',
                        message: 'Message sent successfully',
                    });
                    form.reset();
                } else {
                    setToast({
                        type: 'error',
                        message: 'Failed to send message',
                    });
                }
            })
            .catch((error) => {
                setToast({ type: 'error', message: 'Failed to send message' });
            })
            .finally(() => {
                setSending(false);
            });
    }

    function validate(data) {
        const { fname, sname, email, message, title } = data;

        if (!fname || !sname || !email || !message || !title) {
            setToast({ type: 'error', message: 'Please fill in all fields' });
            return false;
        }

        if (!email.includes('@') || !email.includes('.') || email.length < 5) {
            setToast({ type: 'error', message: 'Please enter a valid email' });
            return false;
        }

        return true;
    }

    function renderContactPlaces() {
        if (!contactInfo) return;

        const contactPlaces = contactInfo.sort(
            (a, b) => b.importance - a.importance
        );

        // order based on priority

        return contactPlaces.map((contactPlace, key) => {
            return renderContactPlace(contactPlace, key);
        });
    }

    function renderContactPlace(contactPlace, key) {
        return (
            <div className='contact-place' key={key}>
                <span>{contactPlace.header}</span>
                <br />
                {contactPlace.data}
            </div>
        );
    }

    return (
        <div>
            <h2>Contact</h2>
            <div id='contact-container'>
                <div className='get-in-touch'>
                    <h3>Get In Touch</h3>
                    <form onSubmit={sendEmail}>
                        <div className='input-group'>
                            <div className='required'>
                                <input
                                    id='fname'
                                    name='fname'
                                    type='text'
                                    placeholder='First name'
                                />
                                <span>*</span>
                            </div>
                            <div className='required'>
                                <input
                                    id='sname'
                                    name='sname'
                                    type='text'
                                    placeholder='Last name'
                                />
                                <span>*</span>
                            </div>
                        </div>
                        <div className='required'>
                            <input
                                id='email'
                                name='email'
                                type='text'
                                placeholder='Email'
                            />
                            <span>*</span>
                        </div>
                        <br />
                        <div className='required'>
                            <input
                                id='title'
                                name='title'
                                type='text'
                                placeholder='Subject'
                            />
                            <span>*</span>
                        </div>
                        <div className='required'>
                            <textarea
                                id='message'
                                name='message'
                                placeholder='Message'
                            ></textarea>
                            <span>*</span>
                        </div>
                        <button disabled={sending}>Send</button>
                    </form>
                </div>
                <div className='contact-details'>
                    <h3>Contact Details</h3>
                    <div className='contact-places'>
                        {renderContactPlaces()}
                        <div className='contact-place socials'>
                            <SocialMedias />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
