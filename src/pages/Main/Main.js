import './styles/Main.scss';
import logo from '../../assets/signature512.png';
import selfie from '../../assets/profile_img.jpg';

function Main() {
  return (
    <div id='main-page-container'>
      <div id='main-nav-container'>
        <ul className=''>
          <li><a href='#about-me-container' className='active'>About Me</a></li>
          <li><a href='#skills-container'>Skills</a></li>
          <li><a href='#projects-container'>Projects</a></li>
          <li><a href='#contact-container'>Contact</a></li>
        </ul>
      </div>
      <div className='section'>
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
      </div>
      <div className='section'>
        <div id='skills-container'>
          <h2>Skills</h2>
        </div>
      </div>
      <div className='section'>
        <div id='projects-container'>
          <h2>Projects</h2>
        </div>
      </div>
      <div className='section'>
        <div id='contact-container'>
          <h2>Contact</h2>
        </div>
      </div>
    </div>
  );
}

export default Main;
