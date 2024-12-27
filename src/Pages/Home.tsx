import { HeaderContent } from "../components/Home/HeaderContent";
import "../css/App.css";
import { Container } from "react-bootstrap";
import { Navbar } from "../Navbar";
import { DataProvider, TravelDataProvider,TripLevelDataProvider, useDocumentTitle } from "../utils/Helpers";
import { useEffect } from "react";
import { HomeIcons } from "../components/Home/HomeIcons";
import { HomeFeatures } from "../components/Home/HomeFeatures";

export function Home(): JSX.Element {

    useDocumentTitle('Home');

    useEffect(() => {
        Promise.all([
            DataProvider.getInstance().loadData(),
            TravelDataProvider.getInstance().loadData(),
            TripLevelDataProvider.getInstance().loadData()
        ]).catch(console.error);
    });

    return (
        <>
            <Navbar />
            <HeaderContent />
            <Container>
                <HomeFeatures />
                <HomeIcons />
            </Container>
        </>
    );
}