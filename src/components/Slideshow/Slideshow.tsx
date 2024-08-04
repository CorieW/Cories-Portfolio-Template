import { useState, useEffect, useRef } from 'react';
import './Slideshow.scss';
import CorrectedSVG from '../CorrectedSVG/CorrectedSVG';
import leftArrow from '../../assets/arrow-left.svg';
import rightArrow from '../../assets/arrow-right.svg';

export interface ISlide {
    element: JSX.Element;
}

type Props = {
    autoTransition?: boolean;
    transitionTime?: number | null;
    slides: ISlide[];
};

function Slideshow(props: Props) {
    const {
        autoTransition = true,
        transitionTime,
        slides
    } = props;

    const slideshowRef = useRef<HTMLDivElement>(null);

    const [autoTransitionEnabled, setAutoTransitionEnabled] = useState<boolean>(autoTransition);
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [nextSlideTimeout, setNextSlideTimeout] =
        useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setSlideIndex(0);
    }, []);

    useEffect(() => {
        if (typeof slideIndex !== 'number') return;
        if (nextSlideTimeout) clearTimeout(nextSlideTimeout);

        // When the slide index changes, update slideshow's background color
        // to match the slide's background color
        const slideshow = slideshowRef.current;

        if (!slideshow) return;

        // If autoTransition is false, do not automatically transition slides
        if (!autoTransitionEnabled) return;

        setNextSlideTimeout(
            setTimeout(() => {
                setSlideIndex((slideIndex + 1) % slides.length);
            }, transitionTime || 5000)
        );
    }, [slideIndex, slides]);

    function changeSlideIndex(newIndex: number) {
        const moddedIndex = (newIndex + slides.length) % slides.length;
        setSlideIndex(moddedIndex);
        // Turn off auto transition when the user manually changes slides
        setAutoTransitionEnabled(false);
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
    );
}

export default Slideshow;
