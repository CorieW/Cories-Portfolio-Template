import { useState, useEffect, useRef } from 'react';
import './Slideshow.scss';
import CorrectedSVG from '../CorrectedSVG/CorrectedSVG';
import leftArrow from '../../assets/arrow-left.svg';
import rightArrow from '../../assets/arrow-right.svg';

export interface ISlide {
    element: JSX.Element;
}

type Props = {
    arrowKeysEnabled?: boolean;
    autoTransition?: boolean;
    transitionTime?: number;
    minSlideInterval?: number;
    slides: ISlide[];
};

function Slideshow(props: Props) {
    const {
        arrowKeysEnabled = true,
        autoTransition = true,
        transitionTime = 5000,
        minSlideInterval = 200,
        slides
    } = props;

    const slideshowRef = useRef<HTMLDivElement>(null);

    const [autoTransitionEnabled, setAutoTransitionEnabled] = useState<boolean>(autoTransition);
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [lastSlideChangeTime, setLastSlideChangeTime] = useState<number>(0);
    const [nextSlideTimeout, setNextSlideTimeout] =
        useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setSlideIndex(0);
    }, []);

    // Auto transition slides
    useEffect(() => {
        if (typeof slideIndex !== 'number') return;
        if (nextSlideTimeout) clearTimeout(nextSlideTimeout);

        const slideshow = slideshowRef.current;
        if (!slideshow) return;

        // If autoTransition is false, do not automatically transition slides
        if (!autoTransitionEnabled) return;

        setNextSlideTimeout(
            setTimeout(() => {
                if (!autoTransitionEnabled) return;
                changeSlideIndex(slideIndex + 1, false);
            }, transitionTime)
        );
    }, [slideIndex, autoTransitionEnabled]);

    // Handle arrow key navigation
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') {
                changeSlideIndex(slideIndex - 1);
            } else if (e.key === 'ArrowRight') {
                changeSlideIndex(slideIndex + 1);
            }
        }

        if (arrowKeysEnabled) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [slideIndex, arrowKeysEnabled]);

    function changeSlideIndex(newIndex: number, manual = true) {
        if (window.performance.now() - lastSlideChangeTime < minSlideInterval) {
            return;
        }

        const moddedIndex = (newIndex + slides.length) % slides.length;
        setSlideIndex(moddedIndex);
        setLastSlideChangeTime(window.performance.now());
        // Turn off auto transition when the user manually changes slides
        if (manual) setAutoTransitionEnabled(false);
    }

    function displaySlides() {
        return slides.map((slide, i) => {
            const className = 'slide' + (i == slideIndex ? ' active' : '');

            return (
                <li className={className} key={i}>
                    {slide.element}
                </li>
            );
        });
    }

    const displayIndicatorsJSX = slides.map((_, i) => {
        return (
            <button
                className={
                    'slide-indicator' + (i == slideIndex ? ' active' : '')
                }
                onClick={() => changeSlideIndex(i)}
                key={i}
            ></button>
        );
    });

    return (
        <div className='slideshow' ref={slideshowRef}>
            <ul className='slide-list'>
                <div className='encompassing-shadow-box'></div>
                {displaySlides()}
            </ul>
            <div className='bottom-bar'>
                <div className='auto-transition-info'>
                    <button
                        id='toggle-transition-btn'
                        className={autoTransitionEnabled ? 'on' : ''}
                        onClick={() => setAutoTransitionEnabled(!autoTransitionEnabled)}
                        aria-label='Toggle auto transition'
                    >
                        <div className='background'></div>
                        <i className="fa-regular fa-clock"></i>
                        <span>Auto-transition:</span>
                        <span className='toggled-text'>{autoTransitionEnabled ? 'On' : 'Off'}</span>
                    </button>
                </div>

                <ul className='slide-indicators'>
                    <button
                        className='slide-indicator move-btn'
                        onClick={() => changeSlideIndex(slideIndex - 1)}
                    >
                        <CorrectedSVG src={leftArrow} />
                    </button>
                    {displayIndicatorsJSX}
                    <button
                        className='slide-indicator move-btn'
                        onClick={() => changeSlideIndex(slideIndex + 1)}
                    >
                        <CorrectedSVG src={rightArrow} />
                    </button>
                </ul>
            </div>
        </div>
    );
}

export default Slideshow;
