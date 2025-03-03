import "../../css/App.css";
import './HomeFeatures.scss';
import { useNavigate } from 'react-router-dom';
import FeaturesLogo from '../../images/HomePage/FeaturesLogo.svg';
import HowItWorksLogo from '../../images/HomePage/HowItWorksLogo.svg';
import MultiLevelAnalysisLogo from '../../images/HomePage/MultiLevelAnalysisLogo.svg';
import ComprehensiveComparisonToolsLogo from '../../images/HomePage/ComprehensiveComparisonToolsLogo.svg';
import CustomizableInsightsLogo from '../../images/HomePage/CustomizableInsightsLogo.svg';


export function HomeFeatures(): JSX.Element {
    const navigate = useNavigate();
    const handleNavigate = (path: any) => {
        navigate(path);
    };

    return (
        <>
            <div className="HomeFeaturesDiv">
                <div className="FeaturesTitleHolder" style={{ paddingTop: '20px' }}>
                    <img src={FeaturesLogo} alt="Logo" style={{ maxWidth: '50px', height: '40px' }} />
                    <span className="SpanHeader" style={{ color: '#507dbc', fontSize: '23.5px' }}><b>Key Features</b></span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="FeatureHolder">
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px' }}>Multi-Level Analysis</span>
                        <span className="SpanContent">TMD supports both person-level and trip-level analyses, allowing users to explore mobility patterns from different perspectives. Whether analyzing individual trip-making behavior or aggregated trends, TMD provides a flexible framework for mobility research.</span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={MultiLevelAnalysisLogo} alt="MultiLevelAnalysisLogo" style={{ maxWidth: '100%', height: 'auto'}} />
                    </div>
                </div>
                <div className="FeatureHolder" style={{ backgroundColor: "white" }}>
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px' }}>Comprehensive Comparison Tools</span>
                        <span className="SpanContent">With within-year, between-year, and cross-segment analysis options, TMD enables users to track trends over time, compare different mobility attributes, and explore variations across population groups. This multi-dimensional approach helps uncover deep insights into travel behavior.
                        </span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={ComprehensiveComparisonToolsLogo} alt="ComprehensiveComparisonToolsLogo" style={{ maxWidth: '100%', height: '140px'}} />
                    </div>
                </div>
                <div className="FeatureHolder">
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px' }}>Customizable Insights</span>
                        <span className="SpanContent">Users can refine their analysis by selecting sociodemographic attributes, weekdays vs. weekends, excluding holiday periods, or filtering data from any year since 2003. This flexibility allows for highly targeted insights tailored to specific research needs.</span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={CustomizableInsightsLogo} alt="CustomizableInsightsLogo" style={{ maxWidth: '100%', width: '140px', height: '140px'}} />
                    </div>
                </div>
                <div className="FeatureHolder" style={{ backgroundColor: "white", height: 'auto', paddingBottom: '30px' }}>
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px', paddingTop: '30px' }}>How It Works</span>
                        <span className="SpanContent">
                            <ol style={{ paddingLeft: '20px', color: "#657383", listStylePosition: 'outside' }}>
                                <li className="mt-2">
                                <strong>Select Your Focus:</strong> Choose from the Trip Purpose, Travel Mode, Zero-Trip Making, or Day Pattern pages to begin your analysis
                                </li>
                                <li className="mt-2">
                                    <strong>Choose Analysis Type:</strong> Utilize within-year, between-year, and cross-segment comparisons to track changes over time and across different population groups
                                </li>
                                <li className="mt-2">
                                <strong>Customize the Data:</strong> Apply filters to define your analysis by demographic attributes, weekdays vs. weekends, and specific time periods
                                </li>
                                <li className="mt-2">
                                    <strong>Explore the Insights:</strong> Watch the dashboard update instantly as you refine your selections, revealing key mobility trends and patterns
                                </li>
                            </ol>

                        </span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={HowItWorksLogo} alt="Dashboard" style={{ maxWidth: '100%', width: '140px', height: '140px'}} />
                    </div>
                </div>

                <div className="FeatureHolder" style={{ flexDirection: 'column', paddingTop: '60px', paddingBottom: '60px', marginBottom: '100px', height: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="SpanContent" style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E2E2E' }}>Begin Your Journey into Mobility Insights</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="SpanContent" style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E2E2E' }}>Explore TMD to Uncover Travel Trends and Patterns for Data-Driven Decisions </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '30px' }}>
                        <button
                            className="dashboardButton"
                            style={{ backgroundColor: '#ebc823' }}
                            onClick={() => handleNavigate('/travelpurpose')}
                        >
                            GO TO DASHBOARD
                        </button>
                    </div>
                </div>
            </div>
        </>)
}