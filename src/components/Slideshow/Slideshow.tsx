import { useState, useEffect, useRef } from 'react';
import './Slideshow.scss';

export interface ISlide {
    element: JSX.Element;
    backgroundColor: string;
}

type Props = {
    autoTransition?: boolean;
    transitionTime?: number | null;
    slides: ISlide[];
};

function Slideshow(props: Props) {
    const { autoTransition, transitionTime, slides } = props;

    const slideshowRef = useRef<HTMLDivElement>(null);

    const [slideIndex, setSlideIndex] = useState<number | null>(null);
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
        const slide = slides[slideIndex];

        if (!slideshow) return;

        if (slide) {
            slideshow.style.backgroundColor = slide.backgroundColor;
        }

        // If autoTransition is false, do not automatically transition slides
        if (!autoTransition) return;

        setNextSlideTimeout(
            setTimeout(() => {
                setSlideIndex((slideIndex + 1) % slides.length);
            }, transitionTime || 7500)
        );
    }, [slideIndex, slides]);

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
            <a
                className={
                    'slide-indicator' + (i == slideIndex ? ' active' : '')
                }
                onClick={() => setSlideIndex(i)}
                key={i}
            ></a>
        );
    });

    return (
        <div className='slideshow' ref={slideshowRef}>
            <ul className='slide-list'>
                <div className='encompassing-shadow-box'></div>
                {displaySlides()}
            </ul>
            <ul className='slide-indicators'>{displayIndicatorsJSX}</ul>
        </div>
    );
}

export default Slideshow;
