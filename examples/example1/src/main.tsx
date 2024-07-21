import ReactDOM from 'react-dom/client';
import './index.css';
import {
    Portfolio,
    IPortfolio,
    IOpenEmailApp
} from 'cories-portfolio-template';
import 'cories-portfolio-template/dist/style.css';

// Load the data for the portfolio.
// In this instance, the data is static, so asynchronous loading is not necessary.
// However, in other cases, the data may be fetched from a database or API.
const loadFunc = async (): Promise<IPortfolio> => {
    const aboutMe = {
        header: 'Hello, I am <br/><strong>John Doe</strong>. <br/>I am a <span style="color: var(--theme-color);">Developer</span>',
        profileImageUrl: 'https://via.placeholder.com/150',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a cursus nulla. Ut in ultricies dolor. Integer sem nibh, fermentum at sagittis vitae, blandit elementum metus. Etiam eu arcu euismod, maximus erat quis, tempor massa. In ligula risus, rutrum ac euismod in, consectetur quis libero. Aliquam placerat vitae mauris ut blandit. Morbi aliquet tellus eget varius convallis. Donec dictum arcu eget enim consequat vehicula. Aenean tincidunt lorem justo, nec vestibulum lorem vestibulum euismod. Etiam sed est vitae purus dapibus aliquam quis id risus. Quisque fermentum sed risus ut blandit. Sed viverra sapien augue, ac elementum sem vehicula nec. ',
    }
    const skills = [
        {
            name: 'React',
            acquiredDate: new Date(2020, 1, 1),
            iconUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'Node.js',
            acquiredDate: new Date(2020, 1, 1),
            iconUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'Firebase',
            acquiredDate: new Date(2020, 1, 1),
            iconUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'TypeScript',
            acquiredDate: new Date(2023, 1, 1),
            iconUrl: 'https://via.placeholder.com/150'
        },
        {
            name: 'Python',
            acquiredDate: new Date(2023, 5, 1),
            iconUrl: 'https://via.placeholder.com/150'
        },
        {
            name: 'Java',
            acquiredDate: new Date(2023, 5, 1),
            iconUrl: 'https://via.placeholder.com/150'
        },
        {
            name: 'C++',
            acquiredDate: new Date(2023, 11, 1),
            iconUrl: 'https://via.placeholder.com/150'
        },
        {
            name: 'C#',
            acquiredDate: new Date(2024, 5, 1),
            iconUrl: 'https://via.placeholder.com/150'
        },
        {
            name: 'SQL',
            acquiredDate: new Date(2024, 5, 1),
            iconUrl: 'https://via.placeholder.com/150'
        }
    ]
    const projects = [
        {
            showcase: {
                title: 'Project 1',
                url: 'https://simpleworldgen.com/'
            }
        },
        {
            showcase: {
                title: 'Project 2',
                component: (
                    <div>
                        <h2 style={{ margin: '0' }}>
                            Super Duper Simple Example
                        </h2>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'normal', textAlign: 'center' }}>
                            This is a super simple example of a project showcase
                        </h3>
                    </div>
                )
            }
        }
    ]
    const contacts = [
        {
            header: 'Email',
            value: 'contact@johndoe.com',
        },
        {
            header: 'Phone',
            value: '123-456-7890',
        },
        {
            header: 'Address',
            value: '1234 Elm Street, Springfield, IL 627'
        }
    ]
    const socials = [
        {
            title: 'LinkedIn',
            url: '/',
            iconType: 'ClassName',
            icon: 'fab fa-linkedin',
        },
        {
            title: 'GitHub',
            url: '/',
            iconType: 'ClassName',
            icon: 'fab fa-github',
        },
        {
            title: 'Twitter',
            url: '/',
            iconType: 'ClassName',
            icon: 'fab fa-twitter',
        },
        {
            title: 'Instagram',
            url: '/',
            iconType: 'ClassName',
            icon: 'fab fa-instagram',
        },
        {
            title: 'Facebook',
            url: '/',
            iconType: 'ClassName',
            icon: 'fab fa-facebook',
        }
    ]

    const data = {
        name: 'John Doe',
        logo: '',
        aboutMe,
        skills,
        projects,
        contacts,
        socials,
        contactForm: {
            handler: {
                yourEmail: 'contact@johndoe.com',
            } as IOpenEmailApp
        },
    } as IPortfolio;
    return data;
};

const settings = {
    styling: {
        themeColor: 'lime',
        backgroundColor: 'black',
        contrastColor: null, // Use default
        disabledColor: null, // Use default
        textColor: null, // Use default
        softTextColor: null, // Use default
        borderColor: null, // Use default
        errorColor: null // Use default
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Portfolio settings={settings} loadFunc={loadFunc} />
);
