import { useRef, useEffect} from 'react'
import './StarryCanvas.scss'
import paper from 'paper'
import Star from './js/Star.ts'
import ShootingStar from './js/ShootingStar.ts'
import Sky from './js/Sky.ts'

function StarryCanvas() {
    const canvasRef = useRef(null);

    const sky = useRef(null);
    const timeUntilNextShootingStar = useRef(Date.now); // in seconds
    const shootingStars = useRef([]);

    const skySettings = {
        starColor: "white",
    }

    const starSettings = {
        starsPerPixel: 0.0002,
        minStarRadius: 0.2,
        maxStarRadius: 1,
        minMinStarOpacity: 0.1,
        maxMinStarOpacity: 0.5,
        minMaxStarOpacity: 0.5,
        maxMaxStarOpacity: 1,
        minStarOpacityVelocity: 0.1,
        maxStarOpacityVelocity: 1
    }

    const shootingStarSettings = {
        shootingStarScale: 1,
        minTimeUntilNextShootingStar: 1, // seconds
        maxTimeUntilNextShootingStar: 3, // seconds
        minOpacity: 0.2,
        maxOpacity: 1,
        maxVelocityX: 500,
        maxVelocityY: 500,
        minSpeed: 1.2,
        maxAdditionalSpeed: 0.5,
        minDurability: 0.1,
        maxAdditionalDurability: 0.5,
        minTailLength: 10,
        maxAdditionalTailLength: 10
    }

    useEffect(() => {
        timeUntilNextShootingStar.current = 0;
        shootingStars.current = [];

        paper.setup(canvasRef.current);

        setupSky();

        const onFrame = (e) => {
            const { minTimeUntilNextShootingStar, maxTimeUntilNextShootingStar } = shootingStarSettings;

            sky.current.update(e.delta);

            // create shooting star when time is right
            if (Date.now() > timeUntilNextShootingStar.current) {
                let shootingStar = createShootingStar();
                timeUntilNextShootingStar.current = Date.now() + Math.random() * ((maxTimeUntilNextShootingStar * 1000) - (minTimeUntilNextShootingStar * 1000)) + (minTimeUntilNextShootingStar * 1000);

                shootingStars.current.push(shootingStar);
            }

            // update shooting stars
            for (let i = 0; i < shootingStars.current.length; i++) {
                shootingStars.current[i].update(e.delta);

                if (shootingStars.current[i].isDead()) {
                    shootingStars.current.splice(i, 1);
                    i--;
                }
            }

            drawCanvas();
        }

        const onResize = () => {
            setupSky();
        }

        paper.view.onFrame = onFrame;
        paper.view.onResize = onResize;

        window.addEventListener('resize', () => {
            paper.view.viewSize.width = window.innerWidth;
            paper.view.viewSize.height = window.innerHeight;
        });

        return () => {
            paper.view.onFrame = null;
            paper.view.onResize = null;
        }
    }, [])

    function setupSky() {
        // set up stars
        const stars = [];
        const numStars = paper.view.size.width * paper.view.size.height * starSettings.starsPerPixel;
        for (let i = 0; i < numStars; i++) {
            let star = createStar();

            stars.push(star);
        }

        sky.current = new Sky(stars);
    }

    function createStar() {
        const {
            minStarRadius,
            maxStarRadius,
            minMinStarOpacity,
            maxMinStarOpacity,
            minMaxStarOpacity,
            maxMaxStarOpacity,
            minStarOpacityVelocity,
            maxStarOpacityVelocity
        } = starSettings;

        const x = Math.random() * paper.view.size.width;
        const y = Math.random() * paper.view.size.height;

        const minStarOpacity = Math.random() * (maxMinStarOpacity - minMinStarOpacity) + minMinStarOpacity;
        const maxStarOpacity = Math.random() * (maxMaxStarOpacity - minMaxStarOpacity) + minMaxStarOpacity;

        const opacityVelocity = Math.random() * (maxStarOpacityVelocity - minStarOpacityVelocity) + minStarOpacityVelocity;

        return new Star(
            x,
            y,
            Math.random() * (maxStarRadius - minStarRadius) + minStarRadius,
            skySettings.starColor,
            minStarOpacity,
            minStarOpacity,
            maxStarOpacity,
            opacityVelocity
        );
    }

    function createShootingStar() {
        const {
            shootingStarScale,
            minOpacity,
            maxOpacity,
            maxVelocityX,
            maxVelocityY,
            minSpeed,
            maxAdditionalSpeed,
            minDurability,
            maxAdditionalDurability,
            minTailLength,
            maxAdditionalTailLength
        } = shootingStarSettings;

        const direction = Math.random() > 0.5 ? 1 : -1;

        const x = Math.random() * (paper.view.size.width);
        const y = Math.random() * (paper.view.size.height);

        const opacity = Math.max(Math.min(Math.random(), minOpacity), maxOpacity);

        const velocityYMagnitude = maxVelocityY;
        const velocityY = ((Math.random() - 0.5) * 2) * velocityYMagnitude;

        const speedIncrease = maxAdditionalSpeed;
        const speed = (Math.random() * speedIncrease) + minSpeed;

        const durability = (Math.random() * maxAdditionalDurability) + minDurability;

        const tailLength = Math.random() * maxAdditionalTailLength + minTailLength;

        return new ShootingStar(
            x,
            y,
            shootingStarScale,
            skySettings.starColor,
            opacity,
            direction * (maxVelocityX * speed),
            velocityY * speed,
            durability,
            tailLength
        );
    }

    function drawCanvas() {
        // clear canvas
        paper.project.activeLayer.removeChildren();

        // draw stars
        drawStars();

        // draw shooting stars
        drawShootingStars();

        paper.view.draw();
    }

    function drawStars() {
        let stars = sky.current.stars;
        for (let i = 0; i < stars.length; i++) {
            const { x, y, radius, color, opacity } = stars[i];

            new paper.Path.Circle({
                center: [x, y],
                radius: radius,
                fillColor: color,
                opacity: opacity
            });
        }
    }

    function drawShootingStars() {
        let shootingStars2 = shootingStars.current;
        for (let i = 0; i < shootingStars2.length; i++) {
            const { x, y, radius, color, opacity } = shootingStars2[i];

            // draw tail
            shootingStars2[i].getTailPoints().forEach((point, index) => {
                const indexDifference = shootingStars2[i].getTailPoints().length - index;
                const radius2 = radius * (1 - (indexDifference / shootingStars2[i].tailLength));
                const opacity2 = opacity * (1 - (indexDifference / shootingStars2[i].tailLength));
                const durabilityOpacityMultiplier = shootingStars2[i].getCurrentDurability() / shootingStars2[i].durability;

                new paper.Path.Circle({
                    center: [point.x, point.y],
                    radius: radius2,
                    fillColor: color,
                    opacity: opacity2 * durabilityOpacityMultiplier
                });
            });
        }
    }

    return (
        <div>
            <canvas id='starry-canvas' ref={canvasRef}></canvas>
        </div>
    )
}

export default StarryCanvas