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

        const getActiveSectionIndexByHashValue = (hashValue: string) => {
            for (let i = 0; i < sectionHashes.length; i++) {
                if (sectionHashes[i] === hashValue) return i;
            }
            return 0;
        };

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
            if (!slideShowElement) {
                e.preventDefault();
                // Interrupted scroll, continue scrolling to the active section
                switchToActiveSection();
                return;
            }

            if (!slideShowElement) return;

            const deltaY =
                e instanceof WheelEvent ? e.deltaY : e.touches[0].clientY;

            const sectionElements: HTMLCollectionOf<Element> =
                slideShowElement.getElementsByClassName('section');
            let activeSection: HTMLElement = sectionElements[
                currSectionIndexRef.current
            ] as HTMLElement;

            // Check if the current section is in view
            let sectionTop = activeSection.offsetTop;
            let sectionBottom = sectionTop + activeSection.offsetHeight;
            let remainingScrollFromTop = slideShowElement.scrollTop - sectionTop;
            let remainingScrollFromBottom =
                sectionBottom - (slideShowElement.scrollTop + slideShowElement.clientHeight);

            const scrollDownReady = Math.round(remainingScrollFromBottom) <= 0;
            const scrollUpReady = Math.round(remainingScrollFromTop) <= 0;
            const isScrollingDown = deltaY > 0;
            const isScrollingUp = deltaY < 0;
            const isLastSection =
                currSectionIndexRef.current === sectionElements.length + 1;
            const isFirstSection = currSectionIndexRef.current === 0;

            if (scrollDownReady && isScrollingDown && !isLastSection) {
                // Current section is the last section
                if (
                    currSectionIndexRef.current ===
                    sectionElements.length - 1
                ) {
                    e.preventDefault();
                    return;
                }

                // Move to the next section
                currSectionIndexRef.current += 1;
                e.preventDefault();
            } else if (scrollUpReady && isScrollingUp && !isFirstSection) {
                // Move to the previous section
                currSectionIndexRef.current -= 1;
                e.preventDefault();
            } else return;

            switchToActiveSection();
        };

        // Handles locking and unlocking the user to/from the current section
        const trackScroll = () => {
            if (!slideShowElement) return;

            const scrollPosition = slideShowElement.scrollTop;
            const bottomPostionOfView = slideShowElement.scrollTop + slideShowElement.clientHeight;

            const sectionElements: HTMLCollectionOf<Element> =
                slideShowElement.getElementsByClassName('section');
            let activeSection: HTMLElement = sectionElements[
                currSectionIndexRef.current
            ] as HTMLElement;

            let sectionTop = activeSection.offsetTop;
            let sectionBottom = sectionTop + activeSection.offsetHeight;

            // Get the distance from the top of the section and the bottom of the currently selected section
            let remainingScrollFromBottom = sectionBottom - bottomPostionOfView;
            let remainingScrollFromTop = scrollPosition - sectionTop;

            // Currently section is not locked, meaning the user is scrolling to a section
            if (!sectionLockedRef.current) {
                // Section is in view, lock the section
                if (Math.round(remainingScrollFromTop) === 0) {
                    // Lock the user to the current section
                    sectionLockedRef.current = true;
                    // Now that the section is locked, update the active section index
                    setActiveSectionIndex(currSectionIndexRef.current);
                    // Update the hash value in the URL to that of the active section
                    const hash =
                        sectionElements[currSectionIndexRef.current].id;
                    window.history.replaceState(null, '', `#${hash}`);
                    const event = new CustomEvent('sectionChanged', {
                        detail: { hash },
                    });
                    window.dispatchEvent(event);
                }

                // Otherwise, don't do anything, continue to wait for the section to be in view
                return;
            }

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

        function distanceFromTopOfSection(sectionContainer: HTMLElement) {
            const scrollPosition = slideShowElement.scrollTop;
            const sectionTop = sectionContainer.offsetTop;
            return Math.round(sectionTop - scrollPosition);
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
