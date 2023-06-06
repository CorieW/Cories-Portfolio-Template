import './Nav.scss';
import logo from '../../assets/signature512.png';

function Nav(props) {
  const linksComponent = props.linksComponent;

  return (
    <div id='nav-container' className=''>
      <a href='/'>
        <div id='logo'>
          <img src={logo} alt="Logo" />
        </div>
        <h1>Corie Watson</h1>
      </a>
      <ul className=''>
        {linksComponent}
      </ul>
    </div>
  );
}

export default Nav;
