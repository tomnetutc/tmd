import "./ProfileCards.scss";
import { Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded if needed
import { ProfileCardProps } from "../../Types";
import { useEffect } from "react";

export default function ProfileCards({
    profileList,
    removeProfile,
    title,
}: ProfileCardProps): JSX.Element {
    return (
        <>
            <div className="profile-container">
                <div className="title-container">
                    <span className="title">{title}</span>
                </div>
                <div className="profilecards">
                    <Col md="auto" style={{ display: "flex", justifyContent: "center", paddingBottom: "1rem"}} >
                        <div className="all-button">All</div>
                    </Col>
                    {profileList.map((profile, index) => {
                        return (
                            <Col
                                md="auto"
                                style={{ display: "flex", justifyContent: "space-evenly" }}
                                key={index}
                            >
                                <div className="profiles" id="closeablecard">
                                    <span
                                        style={{
                                            fontSize: "17px",
                                            fontWeight: "600",
                                            paddingBottom: "0.5rem",
                                        }}
                                    >
                                        Segment {index + 1}
                                    </span>
                                    <button
                                        data-dismiss="alert"
                                        data-target="#closeablecard"
                                        onClick={() => removeProfile(index)}
                                        className="btn-close profile-close-x"
                                    ></button>
                                    <div className="profile-values-container"> {/* Flex container for values */}
                                        {Object.values(profile)[0].map(({ label }, idx) => {
                                            return (
                                                <span key={idx} className="profile-value"> {/* Use span for inline elements */}
                                                    {label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </div>
            </div>
        </>
    );
}