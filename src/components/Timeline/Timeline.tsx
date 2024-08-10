import { useState, useEffect, useRef } from 'react';
import './Timeline.scss';

export interface ITimelineItem {
    name: string;
    imageURL: string;
    timeframe: number;
    /** @deprecated Use timeframe instead */
    acquired?: number;
}

type Props = {
    items: ITimelineItem[];
};

function Timeline(props: Props) {
    const { items } = props;
    const [itemsPerRow, setItemsPerRow] = useState(3);

    const itemsContainerRef = useRef<HTMLDivElement>(null);

    let previousTimeframeStr: string = '';
    let timeframeIndex: number = 0;

    // Handle deprecated 'acquired' property
    for (const item of items) {
        if (item.acquired) {
            item.timeframe = item.acquired;
            delete item.acquired;
        }
    }

    useEffect(() => {
        setDisplaySettings();

        // On window resize, change how the items are displayed
        window.addEventListener('resize', () => {
            setDisplaySettings();
        });

        return () => {
            window.removeEventListener('resize', () => {
                setDisplaySettings();
            });
        };
    }, []);

    function setDisplaySettings() {
        const itemsContainer = itemsContainerRef.current;
        if (!itemsContainer) return;

        if (window.innerWidth <= 700) {
            setItemsPerRow(1);
            itemsContainer.style.setProperty(`--rowGap`, '10px');
        } else if (window.innerWidth <= 1250) {
            setItemsPerRow(2);
            itemsContainer.style.setProperty(`--rowGap`, '20px');
        } else {
            setItemsPerRow(3);
            itemsContainer.style.setProperty(`--rowGap`, '50px');
        }
    }

    function convertTimeframeNumberToSimpleString(timeframe: number): string {
        const decimal = timeframe % 1;
        const year = Math.floor(timeframe);

        if (decimal < 0.01) return `year-${year.toString()}`;
        if (decimal <= 0.33) return `early-${year}`;
        if (decimal <= 0.66) return `mid-${year}`;
        if (decimal <= 1) return `late-${year}`;
        else return `${year.toString()}`;
    }

    function convertTimeframeNumberToString(timeframe: number): string {
        const decimal = timeframe % 1;
        const year = Math.floor(timeframe);

        if (decimal < 0.01) return `${year.toString()}`;
        if (decimal <= 0.33) return `<span class='year-point'>Early </span>${year}`;
        if (decimal <= 0.66) return `<span class='year-point'>Mid </span>${year}`;
        if (decimal <= 1) return `<span class='year-point'>Late </span>${year}`;
        else return `${year.toString()}`;
    }

    function onTimelineBtn(hovered: boolean, timeframe: string) {
        const foundElements = document.querySelectorAll(`.${timeframe}`);
        console.log(foundElements);
        foundElements.forEach((element) => {
            if (hovered) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    function onItemBtn(hovered: boolean, item: ITimelineItem, key: number) {
        const simpleTimeframeStr: string = convertTimeframeNumberToSimpleString(item.timeframe);
        const foundBtn = document.querySelectorAll(`.timeline-item-btn.${simpleTimeframeStr}`)[key] as HTMLButtonElement;

        if (foundBtn) {
            if (hovered) {
                foundBtn.classList.add('active');
            } else {
                foundBtn.classList.remove('active');
            }
        }
    }

    function renderItemsTimeline() {
        // Order items by timeframe date
        const orderedItems = [...items].sort((a, b) => {
            if (a.timeframe < b.timeframe) return -1;
            if (a.timeframe > b.timeframe) return 1;
            return 0;
        });

        const elements = [];
        let rowElements: ITimelineItem[] = [];

        orderedItems.forEach((item, index) => {
            const isRowEnd = (index + 1) % itemsPerRow === 0;

            rowElements.push(item);

            if (isRowEnd) {
                elements.push(rowElements);
                rowElements = [];
            }
        });

        if (rowElements.length > 0) elements.push(rowElements);

        return (
            <div className='timeline'>
                {elements.map((row, index) => {
                    const isEven = index % 2 === 0;
                    const isFirst = index === 0;
                    const isLast = index === elements.length - 1;

                    return renderItemsRow(row, !isEven, isFirst, isLast, index);
                })}
            </div>
        );
    }

    function renderItemsRow(
        items: ITimelineItem[],
        reverse: boolean,
        isFirst: boolean,
        isLast: boolean,
        key: number
    ) {
        return (
            <div
                className={`timeline-row ${reverse ? 'reverse' : ''}`}
                key={key}
            >
                {items.map((item, index) => {
                    const isLastItem = item === items[items.length - 1];
                    const isVeryFirstItem = item === items[0] && isFirst;
                    const timeframe = item.timeframe;
                    const timeframeStr: string = convertTimeframeNumberToString(timeframe);
                    const simpleTimeframeStr: string = convertTimeframeNumberToSimpleString(timeframe);
                    const cachedPreviousTimeframeStr = previousTimeframeStr;

                    timeframeIndex++;
                    if (previousTimeframeStr !== simpleTimeframeStr) {
                        previousTimeframeStr = simpleTimeframeStr;
                        timeframeIndex = 0;
                    }

                    if (isLastItem && isLast) {
                        return (
                            <>
                                <div className={`timeline-row-line ${cachedPreviousTimeframeStr !== simpleTimeframeStr && cachedPreviousTimeframeStr} ${simpleTimeframeStr}`}>
                                    <button
                                        className={
                                            'timeframe ' +
                                            (cachedPreviousTimeframeStr ===
                                            simpleTimeframeStr
                                                ? 'hidden'
                                                : 'new-timeframe')
                                        }
                                        dangerouslySetInnerHTML={{__html: timeframeStr}}
                                        onMouseEnter={() => onTimelineBtn(true, simpleTimeframeStr)}
                                        onMouseLeave={() => onTimelineBtn(false, simpleTimeframeStr)}
                                        onTouchStart={() => onTimelineBtn(true, simpleTimeframeStr)}
                                        onTouchEnd={() => onTimelineBtn(false, simpleTimeframeStr)}
                                    />
                                </div>
                                {renderItem(item, timeframeIndex)}
                                <div className={`timeline-row-line final ${simpleTimeframeStr}`}>
                                    <span className='timeframe'>Today</span>
                                </div>
                                <div className='edge'></div>
                            </>
                        );
                    }

                    return (
                        <>
                            {isVeryFirstItem && index === 0 ? (
                                <div className='edge'></div>
                            ) : null}
                            <div
                                className={`timeline-row-line ${cachedPreviousTimeframeStr !== simpleTimeframeStr && cachedPreviousTimeframeStr} ${simpleTimeframeStr} ${isVeryFirstItem ? 'start' : ''}`}
                            >
                                <button
                                    className={
                                        'timeframe ' +
                                        (cachedPreviousTimeframeStr === simpleTimeframeStr
                                            ? 'hidden'
                                            : 'new-timeframe')
                                    }
                                    dangerouslySetInnerHTML={{__html: timeframeStr}}
                                    onMouseEnter={() => onTimelineBtn(true, simpleTimeframeStr)}
                                    onMouseLeave={() => onTimelineBtn(false, simpleTimeframeStr)}
                                    onTouchStart={() => onTimelineBtn(true, simpleTimeframeStr)}
                                    onTouchEnd={() => onTimelineBtn(false, simpleTimeframeStr)}
                                />
                            </div>
                            {renderItem(item, timeframeIndex)}
                            {isLastItem ? (<div className={`timeline-row-line ${simpleTimeframeStr}`}></div>) : null}
                        </>
                    );
                })}
            </div>
        );
    }

    function renderItem(item: ITimelineItem, key: number) {
        const { name, imageURL } = item;
        const simpleTimeframeStr: string = convertTimeframeNumberToSimpleString(item.timeframe);

        return (
            <button
                className={`timeline-item-btn ${simpleTimeframeStr}`}
                key={key}
                onMouseEnter={() => onItemBtn(true, item, key)}
                onMouseLeave={() => onItemBtn(false, item, key)}
            >
                <img src={imageURL} alt={name} draggable={false} />
                <span>{name}</span>
            </button>
        );
    }

    return (
        <div className='timeline-container' ref={itemsContainerRef}>
            {renderItemsTimeline()}
        </div>
    );
}

export default Timeline;
