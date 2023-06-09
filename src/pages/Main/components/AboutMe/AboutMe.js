import './AboutMe.scss';
import selfie from '../../../../assets/profile_img.jpg';

function AboutMe() {
    return (
        <div id='about-me-container'>
            <div id='upper-container'>
                <div id='img-container'>
                    <img src={selfie} alt='Profile image' />
                </div>
                <h2>Hello, I am <br/><strong>Corie Watson</strong>. <br/>I am a Developer</h2>
            </div>
            <div id='info-container'>
                <p>Sed eget sagittis lacus, ac hendrerit enim. Curabitur quis tellus et odio scelerisque rhoncus at eget magna. Sed mattis sapien lacus, at auctor mauris tempor eget. Donec velit ipsum, blandit sed arcu eu, volutpat placerat massa. Fusce volutpat leo ut turpis mattis lobortis. Duis aliquam urna et ex hendrerit, sed lacinia leo volutpat. Aliquam et placerat metus. Duis tincidunt posuere mi, vel posuere magna vehicula at. Vestibulum ullamcorper justo massa, at maximus nisl dapibus eu. Cras eu odio vitae dolor maximus bibendum. Phasellus laoreet nulla quis pharetra eleifend. Nunc ac vestibulum dolor. </p>
            </div>
        </div>
    )
}

export default AboutMe;