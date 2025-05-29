import "../../App.css";
import { Col, Row } from "react-bootstrap";
import ibatur from '../../images/Head Shots/ibatur.jpg';
import rvarghese from '../../images/Head Shots/rvarghese.jpeg';
import rpendyala from '../../images/Head Shots/rpendyala.png';
import cbhat from '../../images/Head Shots/cbhat.jpg';
import plmokhtarian from '../../images/Head Shots/plmokhtarian.webp';
import spolzin from '../../images/Head Shots/spolzin.png';
import cchen from '../../images/Head Shots/cchen.jpeg';
import mohammed from '../../images/Head Shots/mohammed.jpg';


export function Content(): JSX.Element {
  return (
    <Row>
      <Col lg={2}></Col>
      <Col lg={10}>
        <section style={{ textAlign: "justify" }}>
          <h3 id="section1" className="mt-4 fw-bold contenthead">
            About
          </h3>
          <p className="mt-4">
          The Mobility Dashboard (TMD) is an open-source platform designed to provide data-driven insights into mobility trends and patterns in the United States. 
          Developed with support from the National Center for Understanding Future Travel Behavior and Demand (TBD) and the Center for Teaching Old Models New Tricks
          (
            <a href="https://tomnet-utc.engineering.asu.edu/" target="_blank">
              TOMNET
            </a>
            )
          both funded by the U.S. Department of Transportation, TMD offers a comprehensive analysis of travel behaviors using data from the American Time Use Survey  
          (
            <a href="https://www.bls.gov/tus/" target="_blank">
              ATUS
            </a>
            ).
          {/* and the Center for Understanding Future Travel Behavior
            and Demand (
            <a href="https://tbd.ctr.utexas.edu/" target="_blank">
              TBD
            </a>
            ), both of which are University Transportation Centers
            funded by the US Department of Transportation. */}
          </p>

          <p>
          TMD enables researchers, planners, and policymakers to explore mobility trends through four key topical areas: Trip Purpose, Travel Mode, Zero-Trip Making, and Day Patterns. The dashboard supports both person-level and trip-level analyses, allowing users to gain a deeper understanding of mobility behaviors across different population segments. </p>
            <p>
              TMD features advanced tools for exploring within-year, between-year, and cross-segment analyses, offering users the ability to:
            </p>
            <ul style={{ listStyleType: 'disc'}}>
              <li className="mt-2">Compare trends over time by selecting any year since 2003</li>
              <li className="mt-2">Examine mobility behaviors across population groups based on a host of socio-economic, demographic, mobility, and other characteristics</li>
              <li className="mt-2">Customize insights by refining analyses based on weekdays vs. weekends, excluding holiday seasons, or focusing on specific time frames</li>
            </ul>
        </section>
        <section style={{ textAlign: "justify" }}>
          <h3 className="mt-4 fw-bold contenthead">
          Key concepts
          </h3>
          <p className="mt-4 mb-4">
            While each page of the dashboard — Trip Purpose, Travel Mode, Zero-Trip Making, and Day Patterns — is designed to be self-explanatory, with all charts and graphs featuring an information button to explain the presented data. Some concepts, however, may require further explanations as listed below.
          </p>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
            Zero-trip making
          </h5>
          <p className="mt-4 mb-4">
          Zero-trip making refers to individuals who do not travel outside the home on a given day. This phenomenon can have significant implications for mobility equity and societal wellbeing, potentially leading to reduced physical activity, increased isolation, and lower access to essential services. TMD allows users to track how zero-trip rates change over time and compare them across different population segments using cross-segment analysis.
          </p>

          <p className="mt-4">
          More details about the notion of zero-trip making can be found in the following sources:
          </p>
          <ul>
            <li className="mt-4">
              Batur, I., Dirks, A. C., Bhat, C. R., Polzin, S. E., Chen, C., and Pendyala, R. M. (2023).
              Analysis of Changes in Time Use and Activity Participation in Response to the COVID-19 Pandemic in the United States: Implications for well-being.
              Transportation Research Record, 03611981231165020.&nbsp;
              <a href="https://doi.org/10.1177/03611981231165020" target="_blank" rel="noopener noreferrer">https://doi.org/10.1177/03611981231165020</a>
            </li>
            <li className="mt-4">
              Batur, I. (2023). Understanding and Modeling the Nexus of Mobility, Time Poverty, and Wellbeing (Doctoral dissertation, Arizona State University).&nbsp;
              <a href="https://hdl.handle.net/2286/R.2.N.189319" target="_blank" rel="noopener noreferrer">https://hdl.handle.net/2286/R.2.N.189319</a>
            </li>
          </ul>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
          Day patterns and trip chains
          </h5>
          <p className="mt-4 mb-4">
          TMD provides insights into how people structure their daily travel, capturing sequences of trip purposes and identifying the most common travel day patterns. Users can:
          </p>
          <ul style={{ listStyleType: 'disc'}}>
              <li className="mt-2">Analyze the top 15 most common travel day patterns for any given year</li>
              <li className="mt-2">Compare specific day patterns over time to track evolving mobility behaviors</li>
              <li className="mt-2">Examine trip chain structures, including the number of stops and purpose sequences, to understand how people organize their travel throughout a day</li>
            </ul>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h3 className="mt-4 fw-bold contenthead">
          Segment attributes & customization
          </h3>
          <p className="mt-4 mb-4">
          TMD allows users to define custom market segments by selecting up to three socio-demographic attributes, such as age, employment status, household income, or travel behavior characteristics. These segmentation options provide a nuanced view of how different groups experience and adapt their mobility over time.
          </p>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
            Work arrangement groups
          </h5>
          <p className="mt-4 mb-4">
          TMD classifies respondents in the ATUS data series into distinct groups based on their employment status and the location and presence of their work activities as recorded in their time use diaries:
          </p>
          <ol>
            <li className="mt-2">
              <strong>Non-workers</strong>: This group includes individuals who have indicated that they are not participating in the labor force.
            </li>
            <li className="mt-2">
              <strong>Workers with zero Work</strong>: This category comprises respondents who reported no work activity in their time use diary.
            </li>
            <li className="mt-2">
              <strong>In-home only workers</strong>: These individuals are those who reported working exclusively from home, with no reported out-of-home work activity.
            </li>
            <li className="mt-2">
              <strong>Commuters only</strong>: Respondents in this group reported engaging in at least some out-of-home work activity in their time use diary, without any in-home work activity.
            </li>
            <li className="mt-2">
              <strong>Multi-site workers</strong>: This category encompasses those who reported both out-of-home and in-home work activity in their time use diary.
            </li>
          </ol>
        </section>

        {/* <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
            Segment attributes
          </h5>
          <p className="mt-4 mb-4">
            Each page offers users the ability to tailor their analysis to specific market segments (subpopulation groups). Users can define these segments by choosing up to three attributes from a range of socio-demographic, household, travel, and other variables.
          </p>
          <p className="mt-4">
            Detailed explanations of these attributes are available in this <a href="data_dictionary.xlsx" target="_blank" download>
              data dictionary
            </a>.
          </p>
          <p>
            <em>
              More details about T3D may be found in this&nbsp;
              <a href="https://www.youtube.com/watch?v=eDY0rcXDm2A&t=3876s" target="_blank" rel="noopener noreferrer">webinar</a>.
            </em>
          </p>
        </section> */}
        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
          Time poverty
          </h5>
          <p className="mt-4 mb-4">
          TMD leverages the concept of time poverty to classify individuals as time poor or non-time poor based on their available time for discretionary activities during the survey day. Under this framework, a person is considered time poor if their discretionary time falls below a defined threshold. In TMD, this threshold follows the "60% of median" criterion. Specifically, total necessary and committed activity time of individuals is subtracted from 1,440 minutes (24 hours) to determine their available discretionary time. The median discretionary time across the population is then multiplied by 0.6 to establish the threshold. Individuals with discretionary time below this threshold are classified as time poor, while those with more are non-time poor. More details about time poverty can be found in the following dissertation:
          </p>
          <ul>
          <li className="mt-4">
              Batur, I. (2023). Understanding and Modeling the Nexus of Mobility, Time Poverty, and Wellbeing (Doctoral dissertation, Arizona State University).&nbsp;
              <a href="https://hdl.handle.net/2286/R.2.N.189319" target="_blank" rel="noopener noreferrer">https://hdl.handle.net/2286/R.2.N.189319</a>
          </li>
          </ul>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h3 id="section2" className="mt-4 fw-bold contenthead">
            Data source
          </h3>
          <p className="mt-4">
            The primary data source for these analyses is the American Time Use
            Survey (
            <a href="https://www.bls.gov/tus/" target="_blank">
              ATUS
            </a>
            ). It collects detailed activity and time use data from randomly selected individuals (15+) who are interviewed only once for their time-use diary on the previous day (4 am to 4 am), resulting in nationally representative estimates of how people spend their time. The survey, which is sponsored by the Bureau of Labor Statistics (BLS), has been conducted by the U.S. Census Bureau every year since 2003 and consists of a sample of approximately 10,000 respondents per year.
          </p>
          <p className="mt-4">
            Respondents in ATUS provide information on the time, location, and type of activities pursued, as well as who they were with during each activity, when reporting their time use data. Furthermore, respondents report their socio-demographic information, such as gender, race, age, educational attainment, occupation, income, marital status, and the presence of children in the household.
          </p>
          <p className="mt-4">
            For more information on ATUS, please visit this
            <a className="ps-1" href="https://www.bls.gov/tus/" target="_blank">
              link
            </a>.
          </p>
          <p className="mt-4">
            For details on variable definitions and coding, refer to the <a href="tmd_data_dictionary.xlsx" target="_blank" download>
              data dictionary
            </a> associated with the datasets used in TMD.
          </p>
          <p>
            <em>
              If you would like access to the full data set used in the TMD platform and/or seek collaboration opportunities, please contact Dr. Irfan Batur at<a className="ms-1">ibatur@asu.edu</a>.
            </em>
          </p>
        </section>


        <section className="text-justify" style={{ marginTop: '2rem' }}>
          <h3 id="section3" className="mt-4 fw-bold contenthead">
            Team
          </h3>
          <div className="row text-center">
            <div className="col">
              <a href="https://search.asu.edu/profile/3243599" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={ibatur} className="figure-img img-fluid rounded-circle" alt="Irfan Batur, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Irfan Batur, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Principal Investigator</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://www.linkedin.com/in/roshan--varghese/" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={rvarghese} className="figure-img img-fluid rounded-circle" alt="Roshan Varghese" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Roshan Varghese</figcaption>
                  <figcaption className="figure-caption">Role: Lead Developer</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://www.linkedin.com/in/mohammedzaid1609/" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={mohammed} className="figure-img img-fluid rounded-circle" alt="Mohammed Zaid" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }} >Mohammed Zaid</figcaption>
                  <figcaption className="figure-caption">Role: Developer</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://search.asu.edu/profile/980477" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={rpendyala} className="figure-img img-fluid rounded-circle" alt="Ram M. Pendyala, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Ram M. Pendyala, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Chief Science Officer</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
          </div>
          <div className="row text-center">
            <div className="col">
              <a href="https://www.caee.utexas.edu/prof/bhat/home.html" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={cbhat} className="figure-img img-fluid rounded-circle" alt="Chandra R. Bhat, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Chandra R. Bhat, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Co-Principal Investigator</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >The University of Texas at Austin</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://ce.gatech.edu/directory/person/patricia-l-mokhtarian" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={plmokhtarian} className="figure-img img-fluid rounded-circle" alt="Patricia L. Mokhtarian, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Patricia L. Mokhtarian, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Senior Advisor</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Georgia Institute of Technology</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://search.asu.edu/profile/3993044" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={spolzin} className="figure-img img-fluid rounded-circle" alt="Steven E. Polzin, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Steven E. Polzin, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Senior Advisor</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://www.ce.washington.edu/facultyfinder/cynthia-chen" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={cchen} className="figure-img img-fluid rounded-circle" alt="Cynthia Chen, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Cynthia Chen, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Senior Advisor</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >University of Washington</figcaption>
                </figure>
              </a>
            </div>
          </div>
        </section>


        <section style={{ textAlign: "justify" }}>
          <h3 id="section4" className="mt-4 fw-bold contenthead">
            Citations
          </h3>
          <p className="mt-4">
            <strong>Note:</strong> When using any material from this website, please consider citing
            the relevant sources listed below.
          </p>
          <ul>
            <li className="mt-4">
              Batur, I., Varghese, R., Mohammed Zaid, Bhat, C. R., Mokhtarian, P. L., Polzin, S. E., Chen, C. and Pendyala, R. M. The Mobility Dashboard (TMD). TOMNET and TBD University Transportation Centers, {new Date().getFullYear()}.&nbsp;
              <a href="https://tomnetutc.github.io/tmd/" target="_blank" rel="noopener noreferrer">https://tomnetutc.github.io/tmd/</a>
            </li>
            <li className="mt-4">
              Batur, I., Dirks, A. C., Bhat, C. R., Polzin, S. E., Chen, C., and Pendyala, R. M. (2023). Analysis of Changes in Time Use and Activity Participation in Response to the COVID-19 Pandemic in the United States: Implications for well-being. Transportation Research Record, 03611981231165020.&nbsp;
              <a href="https://doi.org/10.1177/03611981231165020" target="_blank" rel="noopener noreferrer">https://doi.org/10.1177/03611981231165020</a>
            </li>
            <li className="mt-4">
              Batur, I. (2023). Understanding and Modeling the Nexus of Mobility, Time Poverty, and Wellbeing (Doctoral dissertation, Arizona State University).&nbsp;
              <a href="https://hdl.handle.net/2286/R.2.N.189319" target="_blank" rel="noopener noreferrer">https://hdl.handle.net/2286/R.2.N.189319</a>
            </li>
          </ul>
          <br></br>
        </section>

        <div style={{ padding: '15px 0' }} />

      </Col>
    </Row>
  );
}
