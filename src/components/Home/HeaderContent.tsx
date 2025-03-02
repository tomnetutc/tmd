import "../../css/App.css";
import './HeaderContent.scss';
import Logo from '../../images/HomePage/LogoSVG.svg';
import graphImage from '../../images/HomePage/Graph.png';
import YouTubeModal from './YouTubeModal';
import React, { useState } from 'react';


export function HeaderContent(): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="mainContainer">
      <div className="leftColumn" ></div> {/* Left section for future content or spacing */}
      <div className="centerColumn">
        <div className="HeaderContent">
          <div className="contentWrapper">
          <div className="logoContainer">
          <img src={Logo} alt="Logo" className="logo"/>
          </div>
            <div className="textContainer">
              <span className="title">The Mobility Dashboard</span>
              <span className="subtitle"><em>-- by TBD and TOMNET University Transportation Centers</em></span>
            </div>
          </div>
          <div className="demoButtonContainer">
              <button className="demoButton">WATCH DEMO</button>
          </div>
        </div>
      </div>
      <div className="rightColumn">
      </div>
    </div>
  );
}