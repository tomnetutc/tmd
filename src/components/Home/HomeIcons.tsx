import "../../css/App.css";
import './HomeIcons.scss';
import { Link } from 'react-router-dom';

export function HomeIcons(): JSX.Element {

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "auto", width: "100vw" }}>
      <div
        className="HomeIconsDiv"
        style={{
          display: 'flex',
          alignItems: 'center', // Centers vertically
          justifyContent: 'center', // Centers horizontally
          flex: 1, // Fills available vertical space
        }}
      >
        <span
          className="spanText"
          style={{
            fontSize: 18.5,
            paddingTop: '30px',
            paddingBottom: '50px',
            textAlign: 'center',
          }}
        >
          <b>Coming Soon</b>
        </span>
      </div>
    </div>
  );
}
