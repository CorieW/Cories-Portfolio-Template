import IStyling from './IStyling';
import IProjectsSlideshowSettings from './IProjectsSlideshowSettings';

export default interface ISettings {
    styling?: IStyling | null;
    projectsSlideshow?: IProjectsSlideshowSettings | null;
}