import { useEffect, useRef } from 'react';
import './Portfolio.scss';
import Main from './components/Main';
import IPortfolio from '../../ts/data/IPortfolio';
import ISettings from '../../ts/settings/ISettings';

type Props = {
    settings?: ISettings | null;
    loadFunc: () => Promise<IPortfolio>;
};

function Portfolio(props: Props) {
    const { settings, loadFunc } = props;

    const portfolioContainerRef = useRef<HTMLDivElement>(null);

    // Set styling
    useEffect(() => {
        // No settings present
        if (!settings) return;

        const { styling } = settings;
        // No styling present
        if (!styling) return;

        const portfolioContainer = portfolioContainerRef.current;
        if (!portfolioContainer) return;

        // Get styling values with fallback to default CSS variables
        const themeColor =
            styling.themeColor ||
            portfolioContainer.style.getPropertyValue('--theme-color');
        const backgroundColor =
            styling.backgroundColor ||
            portfolioContainer.style.getPropertyValue('--background-color');
        const contrastColor =
            styling.contrastColor ||
            portfolioContainer.style.getPropertyValue('--contrast-color');
        const disabledColor =
            styling.disabledColor ||
            portfolioContainer.style.getPropertyValue('--disabled-color');
        const textColor =
            styling.textColor ||
            portfolioContainer.style.getPropertyValue('--text-color');
        const softTextColor =
            styling.softTextColor ||
            portfolioContainer.style.getPropertyValue('--soft-text-color');
        const borderColor =
            styling.borderColor ||
            portfolioContainer.style.getPropertyValue('--border-color');
        const errorColor =
            styling.errorColor ||
            portfolioContainer.style.getPropertyValue('--error-color');

        // Set CSS variables
        portfolioContainer.style.setProperty('--theme-color', themeColor);
        portfolioContainer.style.setProperty(
            '--background-color',
            backgroundColor
        );
        portfolioContainer.style.setProperty('--contrast-color', contrastColor);
        portfolioContainer.style.setProperty('--disabled-color', disabledColor);
        portfolioContainer.style.setProperty('--text-color', textColor);
        portfolioContainer.style.setProperty(
            '--soft-text-color',
            softTextColor
        );
        portfolioContainer.style.setProperty('--border-color', borderColor);
        portfolioContainer.style.setProperty('--error-color', errorColor);
    }, []);

    return (
        <div id='portfolio-container' ref={portfolioContainerRef}>
            <Main loadFunc={loadFunc} settings={settings ? settings : null} />
        </div>
    );
}

export default Portfolio;
