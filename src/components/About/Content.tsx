import "../../App.css";
import { Col, Row } from "react-bootstrap";

export function Content(): JSX.Element {
  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center", // Centers horizontally
        alignItems: "center", // Centers vertically
        width: "100vw", // Takes the full viewport height
        margin: "0", // Removes any default margin
      }}
    >
      <Col lg={8} style={{ textAlign: "center" }}> {/* Adjust width as needed */}
        <section>
          <h3 id="section1" className="mt-4 fw-bold contenthead">
            About
          </h3>
          <p className="mt-4">
            Coming Soon
          </p>
        </section>
      </Col>
    </Row>
  );
}
