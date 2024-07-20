import './LoadingScreen.scss';
import spinner from '../../../../../assets/spinner.svg';
import CorrectedSVG from '../../../../CorrectedSVG/CorrectedSVG';

type Props = {
    enabled: boolean;
};

function LoadingScreen(props: Props) {
    const { enabled } = props;

    return (
        <div id='loading-screen' className={!enabled ? 'disabled' : ''}>
            <CorrectedSVG src={spinner} />
        </div>
    );
}

export default LoadingScreen;
