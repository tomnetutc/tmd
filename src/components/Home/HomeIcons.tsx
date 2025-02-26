import "../../css/App.css";
import './HomeIcons.scss';
import { Link } from 'react-router-dom';
import TravelModelogo from '../../images/HomePage/TravelModeLogo.svg';
import ZeroTripLogo from '../../images/HomePage/ZeroTripLogo.svg';
import DayPatternLogo from '../../images/HomePage/DayPatternLogo.svg';
import TripPurposeLogo from '../../images/HomePage/TripPurposeLogo.svg';

export function HomeIcons(): JSX.Element {

  return (
    <>
      <div className="HomeIconsDiv" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="spanText" style={{ fontSize: 18.5, paddingTop: '30px', paddingBottom: '50px' }}><b>Explore Mobility Trends and Patterns in the American Time Use Survey</b></span>
        </div>
      </div>

      <div style={{ display: "flex", gap: '5%', alignContent: 'center', marginBottom: '50px' }}>
        <div className="column">
            <div className="column">
              <Link to="/travelpurpose" style={{ textDecoration: 'none' }}>
                <img src={TripPurposeLogo} alt="Logo" style={{ maxWidth: '200px', height: '200px', padding: 10 }} />
                <p className="Header">Travel Purpose</p>
              </Link>
              <span className="spanDescText">Understand why people travel and how it shapes mobility trends.</span>
            </div>
          </div>
        <div className="column">
          <div className="column">
            <Link to="/travelmode" style={{ textDecoration: 'none' }}>
              <img src={TravelModelogo} alt="Logo" style={{ maxWidth: '200px', height: '200px', padding: 10 }} />
              <p className="Header">Travel Mode</p>
            </Link>
            <span className="spanDescText">Discover how people move—by car, transit, or other modes.</span>
          </div>
        </div>
        <div className="column">
          <Link to="/zerotripmaking" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={ZeroTripLogo} alt="Logo" style={{ maxWidth: '200px', height: '200px', padding: 10 }} />
            <p className="Header">Zero-Trip Making</p>
          </Link>
          <span className="spanDescText">Analyze the patterns of those who do not travel on a given day</span>
        </div>
        <div className="column">
          <Link to="/daypattern" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={DayPatternLogo} alt="Logo" style={{ maxWidth: '200px', height: '200px', padding: 10 }} />
            <p className="Header">Day Pattern</p>
          </Link>
          <span className="spanDescText">Uncover full-day trip sequences throughout the day.</span>
        </div>
      </div>
    </>
  );
}
