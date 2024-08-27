import { useState, useRef, useEffect } from 'react';
import './VerticalSectionsSlideshow.scss';
import arrowUp from '../../assets/arrow-up.svg';
import arrowDown from '../../assets/arrow-down.svg';
import CorrectedSVG from '../CorrectedSVG/CorrectedSVG';

export interface ISection {
    component: React.JSX.Element;
}

type Props = {
    sections: ISection[];
    sectionIndex?: number;
    onSectionIndexChange?: (index: number) => void;
    distanceFromTopOfSection?: (distance: number) => void;

    arrowKeysEnabled?: boolean;
    mouseWheelEnabled?: boolean;
    touchSwipeEnabled?: boolean;
    visibleMovementArrows?: boolean;
    movementMode?: 'instant' | 'smooth';
    minSectionInterval?: number;
};

function VerticalSectionsSlideshow(props: Props) {
    const PHONE_SWIPE_THRESHOLD = 20;

    const {
        sections,
        sectionIndex: passSectionIndex = 0,
        onSectionIndexChange = () => {},
        distanceFromTopOfSection: passDistanceFromTopOfSection = () => {},

        arrowKeysEnabled = true,
        mouseWheelEnabled = true,
        touchSwipeEnabled = true,
        visibleMovementArrows = true,
        movementMode = 'smooth',
        minSectionInterval = 200,
    } = props;

    const [sectionIndex, setSectionIndex] = useState(0);
    const [lastSectionChangeTime, setLastSectionChangeTime] = useState(0);
    const isChangingSectionRef = useRef(false);
    const slideShowRef = useRef<HTMLDivElement>(null);

    // Handle section index changes
    useEffect(() => {
        switchSectionToIndex(passSectionIndex);
    }, [passSectionIndex]);

    // Handle section locking
    useEffect(() => {
        const slideShowElement = slideShowRef.current as HTMLElement;

        // Handles locking and unlocking the user to/from the current section
        const clampScrolling = () => {
            const topDistance = distanceFromTopOfSection(getActiveSection());
            passDistanceFromTopOfSection(topDistance);

            // When already changing sections
            // - Don't run the clampToSection function if the user is at the top of the section
            //   because it spams it, causing some browser smooth scrolling to break, like Opera.
            // - If the user is at the top of the section, set isChangingSection to false
            if (isChangingSectionRef.current) {
                if (topDistance === 0) {
                    isChangingSectionRef.current = false;
                } else {
                    return;
                }
            }

            clampToSection(getActiveSection());

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
                        behavior: movementMode,
                    };

                    slideShowElement.scrollTo(scrollOptions);
                }
                else if (Math.round(remainingScrollFromTop) <= 0) {
                    const scrollOptions: ScrollToOptions = {
                        top: sectionTop,
                        behavior: movementMode,
                    };

                    slideShowElement.scrollTo(scrollOptions);
                }
            }
        };

        slideShowElement.addEventListener('scroll', clampScrolling);

        return () => {
            slideShowElement.removeEventListener('scroll', clampScrolling);
        };
    }, [sectionIndex]);

    // Handle section index changes
    useEffect(() => {
        scrollToSection(sectionIndex);
    }, [sectionIndex]);

    // Handle arrow key navigation
    useEffect(() => {
        if (!arrowKeysEnabled) return

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

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [sectionIndex]);

    // Handle mouse wheel navigation
    useEffect(() => {
        if (!mouseWheelEnabled) return;

        const wheelHandler = (e: WheelEvent) => {
            const topDistance = distanceFromTopOfSection(getActiveSection());
            const bottomDistance = distanceFromBottomOfSection(getActiveSection());

            if (e.deltaY > 0 && bottomDistance <= 0) {
                switchSectionInDirection('down');
            } else if (e.deltaY < 0 && topDistance <= 0) {
                switchSectionInDirection('up');
            } else if (isChangingSectionRef.current) {
                // Scroll to the current section when the user tries to scroll while changing sections
                scrollToSection(sectionIndex);
            }
        };

        slideShowRef.current?.addEventListener('wheel', wheelHandler);

        return () => {
            slideShowRef.current?.removeEventListener('wheel', wheelHandler);
        };
    }, [sectionIndex]);

    // Handle touch swipe navigation
    useEffect(() => {
        if (!touchSwipeEnabled) return;

        let topDistance = -1;
        let bottomDistance = -1;
        let touchStartY: number;
        let touchEndY: number;

        const touchStartHandler = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            topDistance = distanceFromTopOfSection(getActiveSection());
            bottomDistance = distanceFromBottomOfSection(getActiveSection());
        };

        const touchEndHandler = (e: TouchEvent) => {
            touchEndY = e.changedTouches[0].clientY;
            const distanceMoved = touchStartY - touchEndY;

            if (distanceMoved < -PHONE_SWIPE_THRESHOLD && topDistance == 0) {
                switchSectionInDirection('up');
            } else if (distanceMoved > PHONE_SWIPE_THRESHOLD && bottomDistance == 0) {
                switchSectionInDirection('down');
            }
        };

        slideShowRef.current?.addEventListener('touchstart', touchStartHandler);
        slideShowRef.current?.addEventListener('touchend', touchEndHandler);

        return () => {
            slideShowRef.current?.removeEventListener('touchstart', touchStartHandler);
            slideShowRef.current?.removeEventListener('touchend', touchEndHandler);
        };
    }, [sectionIndex]);

    function getActiveSection(): HTMLElement {
        const slideShowElement = slideShowRef.current as HTMLElement;
        const sectionElements: HTMLCollectionOf<Element> =
            slideShowElement.getElementsByClassName('section');
        return sectionElements[sectionIndex] as HTMLElement;
    }

    function scrollToSection(sectionIndex: number) {
        // Scroll to the active section when the section index changes
        const sectionElements: HTMLCollectionOf<Element> =
            document.getElementsByClassName('section');
        let activeSection: HTMLElement = sectionElements[sectionIndex] as HTMLElement;
        const scrollOptions: ScrollToOptions = {
            top: activeSection.offsetTop,
            behavior: movementMode,
        };
        isChangingSectionRef.current = true;

        // Scroll to the active section
        slideShowRef.current?.scrollTo(scrollOptions);
    }

    function distanceFromTopOfSection(sectionContainer: HTMLElement): number {
        const slideShowElement = slideShowRef.current as HTMLElement;
        const scrollPosition = slideShowElement.scrollTop;
        const sectionTop = sectionContainer.offsetTop;
        return scrollPosition - sectionTop;
    }

    function distanceFromBottomOfSection(sectionContainer: HTMLElement): number {
        const slideShowElement = slideShowRef.current as HTMLElement;
        const sectionBottom = sectionContainer.offsetTop + sectionContainer.offsetHeight;
        const bottomPostionOfView = slideShowElement.scrollTop + slideShowElement.clientHeight;
        return sectionBottom - bottomPostionOfView;
    }

    function switchSectionToIndex(index: number) {
        if (window.performance.now() - lastSectionChangeTime < minSectionInterval) return;

        if (index < 0 || index >= sections.length) return;
        setSectionIndex(index);
        setLastSectionChangeTime(window.performance.now());
        onSectionIndexChange(index);
    }

    function switchSectionInDirection(direction: 'up' | 'down') {
        if (isMoveSectionBtnDisabled(direction)) return;

        const directionNum = direction === 'up' ? -1 : 1;
        const newIndex = sectionIndex + directionNum;

        switchSectionToIndex(newIndex);
    }

    function isMoveSectionBtnDisabled(direction: 'up' | 'down') {
        const directionNum = direction === 'up' ? -1 : 1;
        const newIndex = sectionIndex + directionNum;
        return newIndex < 0 || newIndex >= sections.length;
    }

    const movementArrowsJSX = visibleMovementArrows ? (
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
    ) : null;

    return (
        <div
            className={`vertical-sections-slideshow-container fade-in-500ms`}
            ref={slideShowRef}
        >
            {movementArrowsJSX}
            <div className='sections-container'>
                {sections.map((section, index) => (
                    <div key={index}>{section.component}</div>
                ))}
            </div>
        </div>
    );
}

export default VerticalSectionsSlideshow;
