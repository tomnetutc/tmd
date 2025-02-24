import { useEffect } from 'react';
import "../App.css";
// import { tracking } from "../utils/Helpers";
// import { FooterProps } from './Types';
import asuLogo from '../images/Logo/asu.png';
import tbdLogo from '../images/Logo/tbd.png';
import utAustinLogo from '../images/Logo/utaustin.png';
import usDotLogo from '../images/Logo/us-dot.png';
import tomnetLogo from '../images/Logo/tomnet.png';

// export default function Footer({ docRefID, page, expiry, footerBackgroundcolor = '' }: FooterProps): JSX.Element {
//     useEffect(() => {
//         tracking(docRefID, page, expiry);
//     }, []);
export default function Footer(): JSX.Element{
    return (
        <div style={{ 
            zIndex: 1000, 
            position: 'relative',
            backgroundColor: 'white',
            marginTop: '-30px',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ 
                padding: '0 20px', 
                textAlign: 'center', 
            }}>
                <hr className="hr-spec" />
                <div style={{ 
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{
                            width: '60%',
                            paddingRight: '10px',
                            position: 'relative'
                        }}>
                            <span className="d-block mb-2 mt-2" > {/* Reduced margin */}
                                <h5 style={{ margin: '0' }}> Have Questions or Feedback?</h5> {/* Removed margin */}
                            </span>
                            <span className="d-block mb-2"> {/* Reduced margin */}
                                For any inquiries or feedback, please contact Dr. Irfan Batur at
                                <a href="mailto:ibatur@asu.edu" className="ms-1">ibatur@asu.edu</a>
                            </span>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                right: 0,
                                transform: 'translateY(-50%)',
                                height: '30px', 
                                width: '2px',
                                backgroundColor: '#352c26',
                                opacity: 0.2
                            }}></div>
                        </div>

                        <div style={{
                            width: '40%',
                            paddingLeft: '10px',
                        }}>
                            <span className="d-block mb-2 mt-2"> {/* Reduced margin */}
                                <h5 style={{ margin: '0' }}>Visitor Statistics</h5> {/* Removed margin */}
                            </span>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '20px',
                                height: '20px',
                            }}>
                                <span id="visit-count">Visit Count</span>

                                <div style={{
                                    width: '1px',
                                    height: '100%',
                                    backgroundColor: '#352c26',
                                    opacity: 0.2,
                                }}></div>

                                <span id="total-count">Total Count</span>
                            </div>
                        </div>
                    </div>
                </div>


                <hr className="hr-spec"></hr>

                <div className='d-block mt-1'> 
                    <div style={{ paddingTop: '5px' }}> 
                        <span style={{ marginRight: "15px", fontWeight: "700" }}>
                            <h3 style={{ margin: '0' }}>Our Sponsors</h3> 
                        </span>
                    </div>
                </div>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0px 10px', 
                    flexWrap: 'wrap', 
                    marginTop: '-30px' 
                }}>
                    <a href='https://www.transportation.gov/' target='_blank' rel='noreferrer'>
                        <img src={usDotLogo} alt="USDOT Logo" style={{ width: "270px", margin: "10px" }} /> 
                    </a>
                    <a href="https://www.utexas.edu/" target='_blank' rel="noreferrer">
                        <img src={utAustinLogo} alt="UT Austin Logo" style={{ width: "180px", margin: "10px" }} /> 
                    </a>
                    <a href="https://tbd.ctr.utexas.edu/" target='_blank' rel="noreferrer">
                        <img src={tbdLogo} alt="UT CTR Logo" style={{ width: "220px", margin: "5px" }} /> 
                    </a>
                    <a href='https://tomnet-utc.engineering.asu.edu/' target='_blank' rel='noreferrer'>
                        <img src={tomnetLogo} alt="TOMNET Logo" style={{ width: "310px", margin: "10px" }} /> 
                    </a>
                    <a href="https://www.asu.edu/" target="_blank" rel="noreferrer">
                        <img src={asuLogo} alt="ASU Logo" style={{ width: "210px", margin: "10px" }} /> 
                    </a>
                </div>

                <hr className="hr-spec"></hr>

                <span
                    style={{
                        fontSize: "15px",
                        padding: "10px 0", 
                        display: "block",
                        width: "100%",
                    }}
                >
                    &copy; 2024 TBD National Center
                </span>
            </div>
        </div>
    );
}