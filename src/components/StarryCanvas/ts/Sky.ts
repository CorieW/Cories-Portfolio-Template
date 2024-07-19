import Star from './Star';

export default class Sky {
    stars: Star[];

    public constructor(stars: Star[]) {
        this.stars = stars;
    }

    public update(time: number): void {
        this.stars.forEach((star: Star) => {
            star.update(time);
        });
    }

    public static construct(stars: Star[]): Sky {
        let canvas: Sky = new Sky(stars);
        return canvas;
    }
}
