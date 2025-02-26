import "../../App.css";
import React from 'react';

export function Sidebar(): JSX.Element {
  const LinkStyle = {
    textDecoration: "none",
    color: "#2B2F88",
    fontSize: "16px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
  };

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="col col-lg-3">
      <div className="sidediv">
        <nav className="sidenavbar">
          <ul className="sidenavbarlist">
            <li className="sidenavbarlistitem">
              <a 
                style={LinkStyle} 
                href="/about#section1" 
                onClick={(event) => scrollToSection(event, "section1")}
              >
                About
              </a>
            </li>

            <li className="sidenavbarlistitem">
              <a 
                style={LinkStyle} 
                href="/about#section2" 
                onClick={(event) => scrollToSection(event, "section2")}
              >
                Data source
              </a>
            </li>
            <li className="sidenavbarlistitem">
              <a 
                style={LinkStyle} 
                href="/about#section3" 
                onClick={(event) => scrollToSection(event, "section3")}
              >
                Team
              </a>
            </li>
            <li className="sidenavbarlistitem">
              <a 
                style={LinkStyle} 
                href="/about#section4" 
                onClick={(event) => scrollToSection(event, "section4")}
              >
                Citations
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
