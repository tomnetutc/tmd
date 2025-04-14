import { Content } from "../components/About/Content";
import "../App.css";
import { Container, Nav } from "react-bootstrap";
import { HomepageNavbar } from "../HomepageNavbar";
import { DayPatternDataProvider,TripLevelDataProvider, TravelDataProvider, useDocumentTitle } from "../utils/Helpers";
import { useEffect } from "react";
import { Sidebar } from "../components/About/Sidebar"
import Footer from "../components/Footer"



export function About(): JSX.Element {

    useDocumentTitle('About');

    useEffect(() => {
        Promise.all([
            TravelDataProvider.getInstance().loadData(),
            TripLevelDataProvider.getInstance().loadData(),
            DayPatternDataProvider.getInstance().loadData()
        ]).catch(console.error);
    });

    return (
        <>
            <HomepageNavbar />
            <Container>
                <Sidebar />
                <Content />
            </Container>
            <Footer 
                
                footerBackgroundcolor="white" />
            
        </>
    );
}
