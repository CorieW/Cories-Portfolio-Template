import './Nav.scss';
import logo from '../../assets/signature512.png';

function Nav() {
  return (
    <div id='nav-container'>
      <a href='/'>
        <div id='logo'>
          <img src={logo} alt="Logo" />
        </div>
        <h1>Corie Watson</h1>
      </a>
    </div>
  );
}

export default Nav;
