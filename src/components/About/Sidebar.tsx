import "../../App.css";
import { HashLink as Link } from "react-router-hash-link";

export function Sidebar(): JSX.Element {
  const LinkStyle = {
    textDecoration: "none",
    color: "#2B2F88",
    fontSize: "16px",
    // width: "50%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
  };
  return (
    <div className="col col-lg-3">
      <div className="sidediv">
        <nav className="sidenavbar">
        <ul className="sidenavbarlist">
            <li className="sidenavbarlistitem">
              <Link style={LinkStyle} to="/about#section1">
                About
              </Link>
            </li>

            <li className="sidenavbarlistitem">
              <Link style={LinkStyle} to="/about#section2">
                Data source
              </Link>
            </li>
            <li className="sidenavbarlistitem">
              <Link style={LinkStyle} to="/about#section3">
                Team
              </Link>
            </li>
            <li className="sidenavbarlistitem">
              <Link style={LinkStyle} to="/about#section4">
                Citations
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
