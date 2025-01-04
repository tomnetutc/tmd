import { Content } from "../components/DayPattern/DayPattern";
import "../App.css";
import { Container, Nav } from "react-bootstrap";
import { Navbar } from "../Navbar";
import { DataProvider, TravelDataProvider, useDocumentTitle } from "../utils/Helpers";
import { useEffect } from "react";

export function DayPattern(): JSX.Element {

    useDocumentTitle('daypattern');

    useEffect(() => {
        Promise.all([
            DataProvider.getInstance().loadData(),
            TravelDataProvider.getInstance().loadData()
        ]).catch(console.error);
    });

    return (
        <>
            <Navbar/>
                <Content />
        </>
    );
}
