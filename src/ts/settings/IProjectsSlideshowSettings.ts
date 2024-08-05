/**
 * Interface for the settings of the projects slideshow.
 * @interface IProjectsSlideshowSettings
 * @property {boolean} [arrowKeysEnabled] - Whether the arrow keys should be enabled for navigating the slideshow.
 * @property {boolean} [autoTransition] - Whether the slideshow should automatically transition between slides.
 * @property {number} [transitionTime] - The time in milliseconds that it should take for the slideshow to transition between slides.
 * @property {number} [minSlideInterval] - The minimum time in milliseconds that should pass before the slideshow can transition to the next slide.
 */
export default interface IProjectsSlideshowSettings {
    arrowKeysEnabled?: boolean;
    autoTransition?: boolean;
    transitionTime?: number;
    minSlideInterval?: number;
}