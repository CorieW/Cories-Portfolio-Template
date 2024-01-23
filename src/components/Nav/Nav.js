import { useState, useEffect } from 'react';
import './Nav.scss';
import logo from '../../assets/signature512.png';

function Nav(props) {
    const linksComponent = props.linksComponent;

    useEffect(() => {
        // Add event listener to listen for changes in the hash value
        // When the hash value changes, close the mobile nav menu
        const handleHashReplaced = (e) => {
            toggleMobileNav(false);
        };

        window.addEventListener('hashReplaced', handleHashReplaced);
    }, []);

    function toggleMobileNav(val = null) {
        const navMenu = document.getElementById('nav-menu');
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

    function checkForClickOutsideNav(e) {
        const toggleMobileNavContainer = document.getElementById(
            'open-mobile-nav-container'
        );
        const navMenu = document.getElementById('nav-menu');

        // if contains toggle button, do nothing
        if (toggleMobileNavContainer.contains(e.target)) {
            return;
        }

        // if doesn't contain menu, toggle menu (close)
        if (!navMenu.contains(e.target)) {
            toggleMobileNav(false);
        }
    }

    return (
        <div id='nav-container'>
            <a href='/' className='fade-in'>
                <div id='logo'>
                    <img src={logo} alt='Logo' />
                </div>
                <h1>Corie Watson</h1>
            </a>

            <div className={linksComponent ? 'fade-in' : 'hide'}>
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
                    <ul>{linksComponent}</ul>
                </div>
            </div>
        </div>
    );
}

export default Nav;
