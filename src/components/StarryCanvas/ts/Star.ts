import IStar from './IStar';

export default class Star implements IStar {
    x: number;
    y: number;
    radius: number;
    color: string;
    opacity: number;
    private minOpacity: number;
    private maxOpacity: number;
    private opacityVelocity: number;

    constructor(
        x: number,
        y: number,
        radius: number,
        color: string,
        opacity: number,
        minOpacity: number,
        maxOpacity: number,
        opacityVelocity: number
    ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.opacity = opacity;
        this.minOpacity = minOpacity;
        this.maxOpacity = maxOpacity;
        this.opacityVelocity = opacityVelocity;
    }

    public update(time: number): void {
        if (this.minOpacity === this.maxOpacity) return;

        this.opacity += this.opacityVelocity * time;

        if (this.opacity > this.maxOpacity) {
            let difference: number = this.opacity - this.maxOpacity;

            this.opacity = this.maxOpacity - difference;
            this.opacityVelocity *= -1;
        } else if (this.opacity < this.minOpacity) {
            let difference: number = this.minOpacity - this.opacity;

            this.opacity = this.minOpacity + difference;
            this.opacityVelocity *= -1;
        }
    }
}
