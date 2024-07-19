import './Contact.scss';
import axios from 'axios';
import SocialMedias from '../SocialMedias/SocialMedias';
import IContact from '../../../../ts/IContact';
import useStore from '../../../../ts/store';
import ContactForm, {
    IContactData,
} from '../../../../components/ContactForm/ContactForm';
import {
    IContactForm,
    IHook,
    IOpenEmailApp,
} from '../../../../ts/IContactForm';
import ISocialMedia from '../../../../ts/ISocialMedia';

type Props = {
    contactForm: IContactForm;
    contacts: IContact[];
    socials: ISocialMedia[];
};

function Contact(props: Props) {
    const { contactForm, contacts } = props;

    const { setToast } = useStore();

    const contactJSX = (contact: IContact, key: number) => {
        return (
            <div className='contact-place' key={key}>
                <span>{contact.header}</span>
                <br />
                {contact.value}
            </div>
        );
    };

    const contactsJSX = contacts.map((contact, key) => {
        return contactJSX(contact, key);
    });

    async function handleHookSubmit(
        hook: IHook,
        form: HTMLFormElement,
        data: IContactData
    ) {
        setToast({ type: 'info', message: 'Sending message...' });

        await axios
            .post(hook.url, data)
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
            .catch(() => {
                setToast({ type: 'error', message: 'Failed to send message' });
            });
    }

    async function handleEmailAppSubmit(
        emailApp: IOpenEmailApp,
        data: IContactData
    ) {
        const email = emailApp.yourEmail;
        const subject = data.title;
        const message = data.message;

        window.open(`mailto:${email}?subject=${subject}&body=${message}`);
    }

    async function submitFunc(form: HTMLFormElement, data: IContactData) {
        const handler = contactForm.handler;

        if ('url' in handler) {
            handleHookSubmit(handler, form, data);
        } else {
            handleEmailAppSubmit(handler, data);
        }
    }

    return (
        <div>
            <h2>Contact</h2>
            <div id='contact-container'>
                <div className='get-in-touch'>
                    <ContactForm submitFunc={submitFunc} setToast={setToast} />
                </div>
                <div className='contact-details'>
                    <div className='contact-places'>
                        {contactsJSX}
                        <div className='contact-place socials'>
                            <SocialMedias socialMedias={props.socials} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
