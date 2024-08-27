import IGeneralSettings from './IGeneralSettings';
import IStylingSettings from './IStylingSettings';
import IProjectsSlideshowSettings from './IProjectsSlideshowSettings';

export default interface ISettings {
    general?: IGeneralSettings | null;
    styling?: IStylingSettings | null;
    projectsSlideshow?: IProjectsSlideshowSettings | null;
}