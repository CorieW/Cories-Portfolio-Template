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
};

function VerticalSectionsSlideshow(props: Props) {
    const {
        sections,
        sectionIndex: passSectionIndex = 0,
        onSectionIndexChange = () => {},
        distanceFromTopOfSection: passDistanceFromTopOfSection = () => {}
    } = props;

    const [sectionIndex, setSectionIndex] = useState(0);
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
        };

        slideShowElement.addEventListener('scroll', clampScrolling);

        return () => {
            slideShowElement.removeEventListener('scroll', clampScrolling);
        };
    }, [sectionIndex]);

    // Handle section index changes and arrow key navigation
    useEffect(() => {
        // Scroll to the active section when the section index changes
        const sectionElements: HTMLCollectionOf<Element> =
            document.getElementsByClassName('section');
        let activeSection: HTMLElement = sectionElements[sectionIndex] as HTMLElement;
        const scrollOptions: ScrollToOptions = {
            top: activeSection.offsetTop,
            behavior: 'smooth',
        };

        // Scroll to the active section
        slideShowRef.current?.scrollTo(scrollOptions);

        // Handle arrow key navigation
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

    function getActiveSection(): HTMLElement {
        const slideShowElement = slideShowRef.current as HTMLElement;
        const sectionElements: HTMLCollectionOf<Element> =
            slideShowElement.getElementsByClassName('section');
        return sectionElements[sectionIndex] as HTMLElement;
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
        if (index < 0 || index >= sections.length) return;
        setSectionIndex(index);
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
