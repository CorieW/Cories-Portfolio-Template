import IStylingSettings from './IStylingSettings';
import IProjectsSlideshowSettings from './IProjectsSlideshowSettings';

export default interface ISettings {
    styling?: IStylingSettings | null;
    projectsSlideshow?: IProjectsSlideshowSettings | null;
}