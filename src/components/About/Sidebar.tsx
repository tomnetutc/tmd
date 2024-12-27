import "../../App.css";

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
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
