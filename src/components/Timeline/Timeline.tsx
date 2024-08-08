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

    function convertTimeframeNumberToString(timeframe: number): string {
        const decimal = timeframe % 1;
        const year = Math.floor(timeframe);

        if (decimal < 0.01) return `${year.toString()}`;
        if (decimal <= 0.33) return `<span class='year-point'>Early </span>${year}`;
        if (decimal <= 0.66) return `<span class='year-point'>Mid </span>${year}`;
        if (decimal <= 1) return `<span class='year-point'>Late </span>${year}`;
        else return `${year.toString()}`;
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
                    const cachedPreviousTimeframeStr = previousTimeframeStr;

                    previousTimeframeStr = timeframeStr;

                    if (isLastItem && isLast) {
                        return (
                            <>
                                <div className='timeline-row-line'>
                                    <span
                                        className={
                                            'timeframe ' +
                                            (cachedPreviousTimeframeStr ===
                                            timeframeStr
                                                ? 'hidden'
                                                : '')
                                        }
                                        dangerouslySetInnerHTML={{__html: timeframeStr}}
                                    />
                                </div>
                                {renderItem(item, index)}
                                <div className='timeline-row-line final'>
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
                                className={`timeline-row-line ${isVeryFirstItem ? 'start' : ''}`}
                            >
                                <span
                                    className={
                                        'timeframe ' +
                                        (cachedPreviousTimeframeStr === timeframeStr
                                            ? 'hidden'
                                            : '')
                                    }
                                    dangerouslySetInnerHTML={{__html: timeframeStr}}
                                />
                            </div>
                            {renderItem(item, index)}
                            {isLastItem ? (<div className='timeline-row-line'></div>) : null}
                        </>
                    );
                })}
            </div>
        );
    }

    function renderItem(item: ITimelineItem, key: number) {
        const { name, imageURL } = item;

        return (
            <button className='timeline-item-btn' key={key}>
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
