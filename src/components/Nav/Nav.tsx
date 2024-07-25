import { useEffect } from 'react';
import './Nav.scss';

export interface INavLink {
    name: string;
    hashValue: string | null;
}

type Props = {
    visible: boolean;
    name: string | null;
    logo: string | null;
    links: INavLink[];
};

function Nav(props: Props) {
    const { visible, name, logo, links } = props;

    useEffect(() => {
        // Add event listener to listen for changes in the hash value
        // When the hash value changes, close the mobile nav menu
        const handleSectionChanged = () => {
            toggleMobileNav(false);

            // Set the active link
            const navMenu = document.getElementById('nav-menu');
            if (!navMenu) return;

            const links = navMenu.getElementsByTagName('a');
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                if (link.hash === window.location.hash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        };

        window.addEventListener('sectionChanged', handleSectionChanged);

        return () => {
            window.removeEventListener('sectionChanged', handleSectionChanged);
        };
    }, []);

    function toggleMobileNav(val: boolean | null = null) {
        const navMenu = document.getElementById('nav-menu');

        if (!navMenu) return;

        const currentVal = navMenu.classList.contains('toggled');
        // if the same value is passed in, do nothing
        if (currentVal === val) {
            return;
        }

        if (val === null) {
            navMenu.classList.toggle('toggled');
        } else if (val === true) {
            navMenu.classList.add('toggled');
        } else if (val === false) {
            navMenu.classList.remove('toggled');
        }

        if (navMenu.classList.contains('toggled')) {
            window.addEventListener('mouseup', checkForClickOutsideNav);
        } else {
            window.removeEventListener('mouseup', checkForClickOutsideNav);
        }
    }

    function getLinkComponentFor(link: INavLink, index: number) {
        const handleLinkClick = (
            e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
        ) => {
            e.preventDefault();

            if (!e.target) return;
            const target = e.target as HTMLAnchorElement;

            // When clicking on a link, replace the hash value in the URL
            const hash = target.hash.substring(1);
            window.history.replaceState(null, '', `#${hash}`);

            // Close the mobile nav menu once link is clicked
            toggleMobileNav(false);

            const event = new CustomEvent('hashReplaced', { detail: { hash } });
            window.dispatchEvent(event);
        };

        let hashValue = link.hashValue;
        if (!hashValue) {
            hashValue = name ? name.toLowerCase().replace(' ', '-') : '';
        }

        // Check if the hash value matches the active hash value
        // This is used to determine if the link is active
        let isActive = window.location.hash === '#' + hashValue;

        // First link is active by default if no hash value is present
        if (window.location.hash === '' && index === 0) {
            isActive = true;
        }

        return (
            <li key={index}>
                <a
                    href={'#' + hashValue}
                    className={isActive ? 'active' : ''}
                    onClick={handleLinkClick}
                >
                    {link.name}
                </a>
            </li>
        );
    }

    function checkForClickOutsideNav(e: MouseEvent) {
        if (!e.target) return;

        const target = e.target as HTMLElement;
        const toggleMobileNavContainer = document.getElementById(
            'open-mobile-nav-container'
        );
        const navMenu = document.getElementById('nav-menu');

        if (!toggleMobileNavContainer || !navMenu) return;

        // if contains toggle button, do nothing
        if (toggleMobileNavContainer.contains(target)) {
            return;
        }

        // if doesn't contain menu, toggle menu (close)
        if (!navMenu.contains(target)) {
            toggleMobileNav(false);
        }
    }

    const linksJSX = links.map((link, index) =>
        getLinkComponentFor(link, index)
    );

    return (
        <div id='nav-container'>
            <a href='/' className='fade-in'>
                <div id='logo'>{logo && <img src={logo} alt='Logo' />}</div>
                <h1>{name}</h1>
            </a>

            <div className={visible ? 'fade-in' : 'hide'}>
                <div id='open-mobile-nav-container' className='open-nav-btn'>
                    <a onClick={() => toggleMobileNav()}>
                        <span className='fa-solid fa-bars'></span>
                    </a>
                </div>

                <div id='nav-menu' className=''>
                    <div className='mobile-top'>
                        <a
                            onClick={() => toggleMobileNav()}
                            className='close-nav-btn'
                        >
                            <span className='fa-solid fa-close'></span>
                        </a>
                    </div>
                    <ul>{linksJSX}</ul>
                </div>
            </div>
        </div>
    );
}

export default Nav;
