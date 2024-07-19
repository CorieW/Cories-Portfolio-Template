import { useState } from 'react';
import './ContactForm.scss';
import { IToast } from '../Toast/Toast';

export interface IContactData {
    fname: string;
    sname: string;
    email: string;
    title: string;
    message: string;
}

type Props = {
    submitFunc: (form: HTMLFormElement, data: IContactData) => Promise<void>;
    setToast: (toast: IToast) => void;
};

function ContactForm(props: Props) {
    const { submitFunc, setToast } = props;

    const [sending, setSending] = useState(false);

    function sendEmail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (sending) return;

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            fname: formData.get('fname'),
            sname: formData.get('sname'),
            email: formData.get('email'),
            title: formData.get('title'),
            message: formData.get('message'),
        } as IContactData;

        if (!validate(data)) return;

        setSending(true);

        submitFunc(form, data).finally(() => {
            setSending(false);
        });
    }

    function validate(data: IContactData) {
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

    return (
        <form className='contact-form' onSubmit={sendEmail}>
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
    );
}

export default ContactForm;
