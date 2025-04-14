import { HeaderContent } from "../components/Home/HeaderContent";
import "../css/App.css";
import { HomepageNavbar } from "../HomepageNavbar";
import { DayPatternDataProvider, TravelDataProvider, TripLevelDataProvider, useDocumentTitle } from "../utils/Helpers";
import { useEffect } from "react";
import { HomeIcons } from "../components/Home/HomeIcons";
import { HomeFeatures } from "../components/Home/HomeFeatures";
import Footer from "../components/Footer";
import { Container, Nav } from "react-bootstrap";

export function Home(): JSX.Element {

    useDocumentTitle('Home');

    useEffect(() => {
        Promise.all([
            TravelDataProvider.getInstance().loadData(),
            TripLevelDataProvider.getInstance().loadData(),
            DayPatternDataProvider.getInstance().loadData()
        ]).catch(console.error);
    }, []); // Adding dependency array to avoid multiple calls

    return (
        <>
            <HomepageNavbar />
            <HeaderContent />
            <Container>
                <HomeIcons />
                <HomeFeatures />
            </Container>
            <Footer 
                
                footerBackgroundcolor="white" />
        </>
    );
}
