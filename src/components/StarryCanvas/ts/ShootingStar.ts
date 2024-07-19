import Star from './Star';

export default class ShootingStar extends Star {
    public velocityX: number;
    public velocityY: number;
    public durability: number;
    public tailLength: number;

    private currentDurability: number = 0;
    private tailPoints: Array<{ x: number; y: number }>;

    constructor(
        x: number,
        y: number,
        radius: number,
        color: string,
        opacity: number,
        velocityX: number,
        velocityY: number,
        durability: number,
        tailLength: number
    ) {
        super(x, y, radius, color, opacity, 1, 1, 1);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.durability = durability;
        this.tailLength = tailLength;

        this.currentDurability = durability;
        this.tailPoints = [];
    }

    public update(time: number): void {
        super.update(time);

        this.x += this.velocityX * time;
        this.y += this.velocityY * time;

        if (this.currentDurability <= 0) {
            this.tailPoints.shift();
            // destroy end of tail points
            this.tailPoints.splice(0, this.tailPoints.length - this.tailLength);
            return;
        }

        this.currentDurability -= time;
        this.tailPoints.push({ x: this.x, y: this.y });

        if (this.tailPoints.length > this.tailLength) {
            this.tailPoints.shift();
        }
    }

    public getCurrentDurability(): number {
        return this.currentDurability;
    }

    public getTailPoints(): Array<{ x: number; y: number }> {
        return this.tailPoints;
    }

    public isDead(): boolean {
        return this.currentDurability <= 0 && this.tailPoints.length === 0;
    }
}
