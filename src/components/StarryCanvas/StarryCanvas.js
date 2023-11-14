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

    const starsPerPixel = 0.0002;

    const minStarRadius = 0.2;
    const maxStarRadius = 1;

    const minMinStarOpacity = 0.1;
    const maxMinStarOpacity = 0.5;

    const minMaxStarOpacity = 0.5;
    const maxMaxStarOpacity = 1;

    const minStarOpacityVelocity = 0.1;
    const maxStarOpacityVelocity = 1;

    const minTimeUntilNextShootingStar = 1; // seconds
    const maxTimeUntilNextShootingStar = 3; // seconds

    const viewportPadding = 10;

    useEffect(() => {
        timeUntilNextShootingStar.current = 0;
        shootingStars.current = [];

        paper.setup(canvasRef.current);

        setupSky();

        const onFrame = (e) => {
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

                let isOutOfXBounds = shootingStars.current[i].x < -viewportPadding || shootingStars.current[i].x > paper.view.size.width + viewportPadding;
                let isOutOfYBounds = shootingStars.current[i].y < -viewportPadding || shootingStars.current[i].y > paper.view.size.height + viewportPadding;

                if (isOutOfXBounds || isOutOfYBounds) {
                    shootingStars.current.splice(i, 1);
                    i--;
                }
            }

            console.log(shootingStars.current.length);

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
        const numStars = paper.view.size.width * paper.view.size.height * starsPerPixel;
        for (let i = 0; i < numStars; i++) {
            let star = createStar();

            stars.push(star);
        }

        sky.current = new Sky(stars);
    }

    function drawCanvas() {
        // clear canvas
        paper.project.activeLayer.removeChildren();

        // draw stars
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

        // draw shooting stars
        let shootingStars2 = shootingStars.current;
        for (let i = 0; i < shootingStars2.length; i++) {
            const { x, y, radius, color, opacity } = shootingStars2[i];

            new paper.Path.Circle({
                center: [x, y],
                radius: radius,
                fillColor: color,
                opacity: opacity
            });

            // draw tail
            shootingStars2[i].getTailPoints().forEach((point, index) => {
                const indexDifference = shootingStars2[i].getTailPoints().length - index;
                const radius2 = radius * (1 - (indexDifference / shootingStars2[i].tailLength));
                const opacity2 = opacity * (1 - (indexDifference / shootingStars2[i].tailLength));

                new paper.Path.Circle({
                    center: [point.x, point.y],
                    radius: radius2,
                    fillColor: color,
                    opacity: opacity2
                });
            });
        }

        paper.view.draw();
    }

    function createStar() {
        const x = Math.random() * paper.view.size.width;
        const y = Math.random() * paper.view.size.height;

        const minStarOpacity = Math.random() * (maxMinStarOpacity - minMinStarOpacity) + minMinStarOpacity;
        const maxStarOpacity = Math.random() * (maxMaxStarOpacity - minMaxStarOpacity) + minMaxStarOpacity;

        const opacityVelocity = Math.random() * (maxStarOpacityVelocity - minStarOpacityVelocity) + minStarOpacityVelocity;

        return new Star(
            x,
            y,
            Math.random() * (maxStarRadius - minStarRadius) + minStarRadius,
            "white",
            minStarOpacity,
            minStarOpacity,
            maxStarOpacity,
            opacityVelocity
        );
    }

    function createShootingStar() {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const x = direction == -1 ? paper.view.size.width + viewportPadding : -viewportPadding;
        const y = Math.random() * (paper.view.size.height);

        const opacity = Math.max(Math.min(Math.random(), 0.5), 0.2);

        const velocityYMagnitude = 500;
        const velocityY = ((Math.random() - 0.5) * 2) * velocityYMagnitude;

        const speedIncrease = 0.5;
        const speed = (Math.random() * speedIncrease) + 1.2;

        const tailLength = Math.random() * 10 + 10;

        return new ShootingStar(
            x,
            y,
            1,
            "white",
            opacity,
            1,
            1,
            1,
            direction * (500 * speed),
            velocityY * speed,
            1,
            tailLength
        );
    }

    return (
        <div>
            <canvas id='starry-canvas' ref={canvasRef}></canvas>
        </div>
    )
}

export default StarryCanvas