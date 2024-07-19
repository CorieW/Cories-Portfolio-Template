import { useState, useEffect } from 'react';
import './Main.scss';
import Nav, { INavLink } from '../../components/Nav/Nav';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import AboutMe from './components/AboutMe/AboutMe';
import Contact from './components/Contact/Contact';
import Toast from '../../components/Toast/Toast';
import StarryCanvas from '../../components/StarryCanvas/StarryCanvas';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import IPortfolio from '../../ts/IPortfolio';
import useStore from '../../ts/store';
import VerticalSectionsSlideshow, {
    ISection,
} from '../../components/VerticalSectionsSlideshow/VerticalSectionsSlideshow';
import ISettings from '../../ts/ISettings';

type Props = {
    settings: ISettings | null;
    loadFunc: () => Promise<IPortfolio>;
};

function Main(props: Props) {
    const { settings, loadFunc } = props;

    const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);

    const { setToast, toast } = useStore();

    // Handle loading the data
    useEffect(() => {
        loadFunc().then((data) => {
            setPortfolio(data);
        });
    }, []);

    function getLinks(): INavLink[] {
        if (!portfolio) return [];

        const aboutMeLink = { name: 'About Me', hashValue: 'about-me-section' };
        const skillsLink =
            portfolio.skills !== null && portfolio.skills.length > 0
                ? { name: 'Skills', hashValue: 'skills-section' }
                : null;
        const projectsLink =
            portfolio.projects !== null && portfolio.projects.length > 0
                ? { name: 'Projects', hashValue: 'projects-section' }
                : null;
        const contactLink =
            portfolio.contactForm !== null
                ? { name: 'Contact', hashValue: 'contact-section' }
                : null;

        const links = [aboutMeLink, skillsLink, projectsLink, contactLink];
        return links.filter((link) => link !== null) as INavLink[];
    }

    function getSectionJSX(
        sectionComponent: JSX.Element,
        idPrefix: string,
        condition: boolean
    ): JSX.Element | null {
        return condition ? (
            <div className='section' id={idPrefix + '-section'}>
                {sectionComponent}
            </div>
        ) : null;
    }

    function getSections(portfolio: IPortfolio): ISection[] {
        const { aboutMe, skills, projects, contacts, socials, contactForm } =
            portfolio;

        const aboutMeJSX: JSX.Element | null = getSectionJSX(
            <AboutMe aboutMe={aboutMe} socialMedias={socials} />,
            'about-me',
            true
        );
        const skillSectionJSX: JSX.Element | null = getSectionJSX(
            <Skills skills={skills} />,
            'skills',
            skills.length !== 0
        );
        const projectSectionJSX: JSX.Element | null = getSectionJSX(
            <Projects projects={projects} settings={settings?.projectsSlideshow} />,
            'projects',
            projects.length !== 0
        );
        const contactSectionJSX: JSX.Element | null =
            contactForm === null
                ? null
                : getSectionJSX(
                      <Contact
                          contactForm={contactForm}
                          contacts={contacts}
                          socials={socials}
                      />,
                      'contact',
                      true
                  );

        const hashes: string[] = [
            'about-me-section',
            'skills-section',
            'projects-section',
            'contact-section',
        ];
        const sectionJSXs = [
            aboutMeJSX,
            skillSectionJSX,
            projectSectionJSX,
            contactSectionJSX,
        ];

        const sections: ISection[] = [];
        for (let i = 0; i < sectionJSXs.length; i++) {
            const sectionJSX = sectionJSXs[i];
            if (sectionJSX === null) continue;

            sections.push({
                hash: hashes[i],
                component: sectionJSX,
            });
        }
        return sections;
    }

    const dynamicContentJSX = (portfolio: IPortfolio) => (
        <>
            <Nav
                visible={portfolio !== null}
                name={portfolio.name}
                logo={portfolio.logo}
                links={getLinks()}
            />

            <div className='fade-out-display-none'>
                <LoadingScreen />
            </div>

            <div id='sections' className='fade-in-500ms'>
                <VerticalSectionsSlideshow sections={getSections(portfolio)} />
            </div>
        </>
    )

    return (
        <div id='main-page-container'>
            <Toast setToast={setToast} toast={toast} />
            <StarryCanvas />
            { portfolio !== null ? dynamicContentJSX(portfolio) : <LoadingScreen /> }
        </div>
    );
}

export default Main;
