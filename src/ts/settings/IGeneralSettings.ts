/**
 * Interface for the general settings of the portfolio.
 * @interface IGeneralSettings
 * @property {boolean} [arrowKeysEnabled] - Whether the arrow keys should be enabled for navigating the portfolio.
 * @property {boolean} [mouseWheelEnabled] - Whether the mouse wheel should be enabled for navigating the portfolio.
 * @property {boolean} [touchSwipeEnabled] - Whether touch swipe should be enabled for navigating the portfolio.
 * @property {boolean} [visibleMovementArrows] - Whether the movement arrows should be visible.
 * @property {'instant' | 'smooth'} [movementMode] - The mode of movement for the portfolio. 'instant' will move the section instantly, while 'smooth' will animate the movement.
 * @property {number} [minSectionInterval] - The minimum time in milliseconds that should pass before the portfolio can transition to the next section.
 */
export default interface IVerticalSectionsportfolioSettings {
    arrowKeysEnabled?: boolean;
    mouseWheelEnabled?: boolean;
    touchSwipeEnabled?: boolean;
    visibleMovementArrows?: boolean;
    movementMode?: 'instant' | 'smooth';
    minSectionInterval?: number;
}