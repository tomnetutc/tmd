import "../../css/App.css";
import './HomeFeatures.scss';
import { useNavigate } from 'react-router-dom';
import FeaturesLogo from '../../images/HomePage/Features Logo.svg';
import HowItWorksLogo from '../../images/HomePage/How It Works Logo.svg';
import InstantInsightsLogo from '../../images/HomePage/Instant Insights Logo.svg';
import FocusedAnalysisLogo from '../../images/HomePage/Focused Analysis Logo.svg';
import UserDrivenCustomizationLogo from '../../images/HomePage/User-Driven Customization Logo.svg';


export function HomeFeatures(): JSX.Element {
    const navigate = useNavigate();
    const handleNavigate = (path: any) => {
        navigate(path);
    };

    return (
        <>
       </>)
}