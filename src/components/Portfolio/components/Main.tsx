import { useState, useEffect } from 'react';
import './Main.scss';
import Nav, { INavLink } from '../../Nav/Nav';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import AboutMe from './components/AboutMe/AboutMe';
import Contact from './components/Contact/Contact';
import Toast from '../../Toast/Toast';
import StarryCanvas from '../../StarryCanvas/StarryCanvas';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import IPortfolio from '../../../ts/IPortfolio';
import useStore from '../../../ts/store';
import VerticalSectionsSlideshow, {
    ISection,
} from '../../VerticalSectionsSlideshow/VerticalSectionsSlideshow';
import ISettings from '../../../ts/ISettings';

type Props = {
    settings: ISettings | null;
    loadFunc: () => Promise<IPortfolio>;
};

function Main(props: Props) {
    const { settings, loadFunc } = props;

    const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
    const [sections, setSections] = useState<ISection[]>([]);
    const [sectionHashes, setSectionHashes] = useState<string[]>([]);
    const [sectionIndex, setSectionIndex] = useState(0);

    const { setToast, toast } = useStore();

    // Handle loading the data
    useEffect(() => {
        loadFunc().then((data) => {
            setPortfolio(data);
            setSections(getSections(data));
        });
    }, []);

    useEffect(() => {
        // Get the current hash value
        const hashValue = window.location.hash.substring(1);
        // Set the section index to the index of the section with the hash value
        setSectionIndex(getSectionIndexByHashValue(hashValue));

        // Add event listener to listen for changes in the hash value
        // When the hash value changes, update the active hash value.
        const handleHashReplaced = () => {
            // Get the updated hash value
            const updatedHashValue = window.location.hash.substring(1);
            // Set the section index to the index of the section with the updated hash value
            setSectionIndex(getSectionIndexByHashValue(updatedHashValue));
        };

        function getSectionIndexByHashValue(hashValue: string): number {
            return sectionHashes.indexOf(hashValue);
        }

        window.addEventListener('hashReplaced', handleHashReplaced);
        return () => {
            window.removeEventListener('hashReplaced', handleHashReplaced);
        };
    }, [sectionHashes]);

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

        const sectionJSXs = [
            aboutMeJSX,
            skillSectionJSX,
            projectSectionJSX,
            contactSectionJSX,
        ];

        const hashes: string[] = [
            'about-me-section',
            'skills-section',
            'projects-section',
            'contact-section',
        ];

        const sections: ISection[] = [];
        const usedHashes: string[] = [];
        for (let i = 0; i < sectionJSXs.length; i++) {
            const sectionJSX = sectionJSXs[i];
            if (sectionJSX === null) continue;

            usedHashes.push(hashes[i]);

            sections.push({
                component: sectionJSX,
            });
        }

        setSectionHashes(usedHashes);
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

            <div id='sections' className='fade-in-500ms'>
                <VerticalSectionsSlideshow
                    sections={sections}
                    sectionIndex={sectionIndex}
                    onSectionIndexChange={(index) => {
                        // Update the hash value in the URL to that of the active section
                        const hash = sectionHashes[index];
                        window.history.replaceState(null, '', `#${hash}`);
                        const event = new CustomEvent('sectionChanged', {
                            detail: { hash },
                        });
                        window.dispatchEvent(event);
                    }}
                    distanceFromTopOfSection={(distance) => {
                        console.log('distanceFromTopOfSection', distance);
                        // Hide the nav bar when the user is changing sections
                        const navContainer = document.getElementById('nav-container');
                        if (!navContainer) return;

                        if (distance !== 0) navContainer.classList.add('hidden');
                        else navContainer.classList.remove('hidden');
                    }}
                />
            </div>
        </>
    )

    return (
        <div id='main-page-container'>
            <Toast setToast={setToast} toast={toast} />
            <StarryCanvas />
            <LoadingScreen enabled={portfolio === null} />
            { portfolio !== null ? dynamicContentJSX(portfolio) : null }
        </div>
    );
}

export default Main;
