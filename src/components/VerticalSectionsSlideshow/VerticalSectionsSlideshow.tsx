import { useState, useRef, useEffect } from 'react';
import './VerticalSectionsSlideshow.scss';
import arrowUp from '../../assets/arrow-up.svg';
import arrowDown from '../../assets/arrow-down.svg';
import CorrectedSVG from '../CorrectedSVG/CorrectedSVG';

export interface ISection {
    hash: string;
    component: React.JSX.Element;
}

type Props = {
    sections: ISection[];
};

function VerticalSectionsSlideshow(props: Props) {
    const { sections } = props;

    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [sectionHashes, setSectionHashes] = useState<string[]>([]);
    const slideShowRef = useRef<HTMLDivElement>(null);
    const currSectionIndexRef = useRef(0);
    const sectionLockedRef = useRef(true);

    useEffect(() => {
        // Get the hash values for each section
        const hashArr: string[] = [];
        sections.forEach((section) => {
            hashArr.push(section.hash);
        });
        setSectionHashes(hashArr);
    }, []);

    useEffect(() => {
        const slideShowElement = slideShowRef.current as HTMLElement;

        // Get the current hash value
        const hashValue = window.location.hash.substring(1);
        // Set the section index to the index of the section with the hash value
        currSectionIndexRef.current =
            getActiveSectionIndexByHashValue(hashValue);
        setActiveSectionIndex(currSectionIndexRef.current);
        if (currSectionIndexRef.current !== 0) switchToActiveSection();

        // Handles moving to the next or previous section
        // when the user scrolls past or before the current section
        const moveSection = (e: TouchEvent | WheelEvent) => {
            if (!slideShowElement) return;

            // If section is not locked (because scrolling to it already), prevent default
            if (!sectionLockedRef.current) {
                e.preventDefault();
                // Continue scrolling to the active section
                switchToActiveSection();
                return;
            }

            const deltaY = e instanceof WheelEvent ? e.deltaY : e.touches[0].clientY;
            const isScrollingDown = deltaY > 0;
            const isScrollingUp = deltaY < 0;
            if (canMoveSectionDown() && isScrollingDown) {
                // Move to the next section
                currSectionIndexRef.current += 1;
                e.preventDefault();
                switchToActiveSection();
            } else if (canMoveSectionUp() && isScrollingUp) {
                // Move to the previous section
                currSectionIndexRef.current -= 1;
                e.preventDefault();
                switchToActiveSection();
            }

            function canMoveSectionDown() {
                const activeSection: HTMLElement = getActiveSection();
                const remainingScrollFromBottom = distanceFromBottomOfSection(activeSection);
                const scrollDownReady = Math.round(remainingScrollFromBottom) <= 0;
                const isLastSection = currSectionIndexRef.current === sectionHashes.length - 1;
                return scrollDownReady && !isLastSection;
            }

            function canMoveSectionUp() {
                const activeSection: HTMLElement = getActiveSection();
                const remainingScrollFromTop = distanceFromTopOfSection(activeSection);
                const scrollUpReady = Math.round(remainingScrollFromTop) <= 0;
                const isFirstSection = currSectionIndexRef.current === 0;
                return scrollUpReady && !isFirstSection;
            }
        };

        // Handles locking and unlocking the user to/from the current section
        const trackScroll = () => {
            if (!slideShowElement) return;

            // Currently section is not locked, meaning the user is scrolling to a section
            if (!isSectionLocked()) handleSectionSwitching();
            // Section is locked, meaning the user is scrolling within a section, clamp the user to the section
            else clampToSection(getActiveSection());

            function handleSectionSwitching() {
                let activeSection: HTMLElement = getActiveSection()
                let remainingScrollFromTop = distanceFromTopOfSection(activeSection);

                // If the user scrolls past the top of the section, unlock the section
                if (Math.round(remainingScrollFromTop) === 0) {
                    sectionLockedRef.current = true;
                    triggerSectionChange();
                }
            }

            function triggerSectionChange() {
                setActiveSectionIndex(currSectionIndexRef.current);

                // Update the hash value in the URL to that of the active section
                const hash = sectionHashes[currSectionIndexRef.current];
                window.history.replaceState(null, '', `#${hash}`);
                const event = new CustomEvent('sectionChanged', {
                    detail: { hash },
                });
                window.dispatchEvent(event);
            }
        };

        const handleNavOnScroll = () => {
            const navContainer = document.getElementById('nav-container');
            if (!navContainer) return;

            const nextSectionDist = distanceFromNextSection();

            // Show nav bar when at top of the section
            if (nextSectionDist === 0) {
                navContainer.classList.remove('hidden');
            } else {
                navContainer.classList.add('hidden');
            }
        };

        // Add event listener to listen for changes in the hash value
        // When the hash value changes, update the active hash value.
        const handleHashReplaced = () => {
            // Get the updated hash value
            const updatedHashValue = window.location.hash.substring(1);
            // Set the section index to the index of the section with the updated hash value
            currSectionIndexRef.current =
                getActiveSectionIndexByHashValue(updatedHashValue);
            // Scroll to the active section
            switchToActiveSection();
        };

        function clampToSection(section: HTMLElement) {
            let sectionTop = section.offsetTop;
            let sectionBottom = sectionTop + section.offsetHeight;

            // Get the distance from the top of the section and the bottom of the currently selected section
            let remainingScrollFromBottom = distanceFromBottomOfSection(section);
            let remainingScrollFromTop = distanceFromTopOfSection(section);

            // Lock the user to the current section if they scroll past the top or bottom of the section
            if (Math.round(remainingScrollFromBottom) <= 0) {
                const scrollOptions: ScrollToOptions = {
                    top: sectionBottom - slideShowElement.clientHeight,
                    behavior: 'smooth',
                };

                slideShowElement.scrollTo(scrollOptions);
            }
            else if (Math.round(remainingScrollFromTop) <= 0) {
                const scrollOptions: ScrollToOptions = {
                    top: sectionTop,
                    behavior: 'smooth',
                };

                slideShowElement.scrollTo(scrollOptions);
            }
        }

        function getActiveSection(): HTMLElement {
            const sectionElements: HTMLCollectionOf<Element> =
                slideShowElement.getElementsByClassName('section');
            return sectionElements[currSectionIndexRef.current] as HTMLElement;
        }

        function getActiveSectionIndexByHashValue(hashValue: string) {
            for (let i = 0; i < sectionHashes.length; i++) {
                if (sectionHashes[i] === hashValue) return i;
            }
            return 0;
        }

        function isSectionLocked() {
            return sectionLockedRef.current;
        }

        function distanceFromTopOfSection(sectionContainer: HTMLElement): number {
            const scrollPosition = slideShowElement.scrollTop;
            const sectionTop = sectionContainer.offsetTop;
            return scrollPosition - sectionTop;
        }

        function distanceFromBottomOfSection(sectionContainer: HTMLElement): number {
            const sectionBottom = sectionContainer.offsetTop + sectionContainer.offsetHeight;
            const bottomPostionOfView = slideShowElement.scrollTop + slideShowElement.clientHeight;
            return sectionBottom - bottomPostionOfView;
        }

        function distanceFromNextSection() {
            if (slideShowElement == null) return 0;

            const sectionElements: HTMLCollectionOf<Element> =
                slideShowElement.getElementsByClassName('section');
            const nextSection: HTMLElement = sectionElements[
                currSectionIndexRef.current
            ] as HTMLElement;
            return distanceFromTopOfSection(nextSection);
        }

        slideShowElement.addEventListener('wheel', moveSection, { passive: false });
        slideShowElement.addEventListener('scroll', trackScroll);
        slideShowElement.addEventListener('scroll', handleNavOnScroll);
        window.addEventListener('hashReplaced', handleHashReplaced);

        // Clean up the event listener on component unmount
        return () => {
            slideShowElement.removeEventListener('wheel', moveSection);
            slideShowElement.removeEventListener('scroll', trackScroll);
            slideShowElement.removeEventListener('scroll', handleNavOnScroll);
            window.removeEventListener('hashReplaced', handleHashReplaced);
        };
    }, [sectionHashes]);

    useEffect(() => {
        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                switchSectionInDirection('down');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                switchSectionInDirection('up');
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [activeSectionIndex]);

    function switchToActiveSection() {
        const sectionElements: HTMLCollectionOf<Element> =
            document.getElementsByClassName('section');
        let activeSection: HTMLElement = sectionElements[
            currSectionIndexRef.current
        ] as HTMLElement;
        const scrollOptions: ScrollToOptions = {
            top: activeSection.offsetTop,
            behavior: 'smooth',
        };
        // Disable the section lock
        sectionLockedRef.current = false;
        // Scroll to the active section
        slideShowRef.current?.scrollTo(scrollOptions);
    }

    function switchSectionInDirection(direction: 'up' | 'down') {
        // Can't move down if at the bottom
        if (
            direction === 'down' &&
            activeSectionIndex === sectionHashes.length - 1
        )
            return;
        // Can't move up if at the top
        if (direction === 'up' && activeSectionIndex === 0) return;

        currSectionIndexRef.current =
            activeSectionIndex + (direction === 'down' ? 1 : -1);
        switchToActiveSection();
    }

    function isMoveSectionBtnDisabled(direction: 'up' | 'down') {
        // Can't move down if at the bottom
        if (
            direction === 'down' &&
            activeSectionIndex === sectionHashes.length - 1
        )
            return true;
        // Can't move up if at the top
        if (direction === 'up' && activeSectionIndex === 0) return true;
        return false;
    }

    return (
        <div
            className={`vertical-sections-slideshow-container fade-in-500ms`}
            ref={slideShowRef}
        >
                <div className='move-section-btns-container'>
                    <button
                        className={
                            'move-section-up-btn general-btn-1 ' +
                            (isMoveSectionBtnDisabled('up') ? 'disabled' : '')
                        }
                        onClick={() => switchSectionInDirection('up')}
                    >
                        <CorrectedSVG src={arrowUp} />
                    </button>
                    <button
                        className={
                            'move-section-down-btn general-btn-1 ' +
                            (isMoveSectionBtnDisabled('down') ? 'disabled' : '')
                        }
                        onClick={() => switchSectionInDirection('down')}
                    >
                        <CorrectedSVG src={arrowDown} />
                    </button>
                </div>
                <div className='sections-container'>
                    {sections.map((section, index) => (
                        <div key={index}>{section.component}</div>
                    ))}
                </div>
        </div>
    );
}

export default VerticalSectionsSlideshow;
