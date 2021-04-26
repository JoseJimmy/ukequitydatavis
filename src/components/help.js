import {Col, Container, Row} from "react-bootstrap";

export const Team = () => {

    const Team = [{
        "img": "img/team/01.jpg",
        "name": "Jose",
    },
        {
            "img": "img/team/02.jpg",
            "name": "Vivek",
        }
    ]

    const img_style = {
        "border": "5px solid #944822",
        "border-radius": "15px",
        "padding": "5px",
        "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        "filter": "hue-rotate(20deg)"
    }


    return (
        <>
            <div  className='text-center'>
                <div className='container'>
                    <div id='guide' className='col-md-8 col-md-offset-2 section-title'>
                        <h2>User Guide</h2>
                        <p>
                            This is an interactive data vis model built to navigate UK stock market data (of around 410 stocks).All user interactions
                            are handled in the React state system, charts are implemented in Vega.js. Uk stock market data is sourced from a retail
                            investor data platform, ETL process implemented in python.
                        </p>
                    </div>
                </div>
            </div>
            <Container>
                <Row style={{paddingBottom: "50px"}}>
                    <Col lg={4} md={4}>
                        <img src={"img/g1.gif"} style={img_style} alt='...'/>
                    </Col>
                    <Col lg={7} md={7}>
                        <h4>Navigation </h4>
                        <p>
                            <ul>
                                <li>Double click on any Sector or Industry node to show it's components.</li>
                                <li>Single click on any node to highlight its performance on price charts, highlighted nodes are 'ringed' with its color from other charts </li>
                                <li>Click 'back' button to navigate back up</li>
                            </ul>
                        </p>
                    </Col>
                </Row>
                 <Row style={{paddingBottom: "50px"}}>
                    <Col lg={4} md={4}>
                        <img src={"img/g2.gif"} style={img_style} alt='...'/>
                    </Col>
                    <Col lg={7} md={7}>
                        <h4>Price Chart </h4>
                        <p>
                            <ul>
                                <li>The price chart show baselined return of selected stocks, sectors or industries</li>
                                <li>Hover over any line to highlight it and show its weekly return </li>
                            </ul>
                        </p>
                    </Col>
                </Row>
                 <Row style={{paddingBottom: "50px"}}>
                    <Col lg={4} md={4}>
                        <img src={"img/g3.gif"} style={img_style} alt='...'/>
                    </Col>
                    <Col lg={7} md={7}>
                        <h4>Return/Volatility/Volume chart </h4>
                        <p>
                            <ul>
                                <li>The instruments performance is shown as it's return and volatility for selected time period </li>
                                <li>Weekly volume is encoded as arc-sectors. Each arc-sector is a cap-weighted dollar volume.</li>
                                <li> i.e. for example, a value of 2 indicates weekly turnover of twice its market cap</li>
                            </ul>
                        </p>
                    </Col>
                </Row>
                    <Row>
                          <div id='guide' className='col-md-8 col-md-offset-2 section-title'>
                                            <h3>Thanks for Visiting this site</h3>
                                            <p>
                                            For more info please contact me at <a href={"mailto:jose.jimmy@gmail.com"}>jose.jimmy@gmail.com</a>
                                                  </p>
                              <p>
                                                Linkedin : <a href={"https://linkedin.com/in/jjimmy"}>linkedin.com/in/jjimmy</a>
                                 </p>
                                        </div>

                    </Row>
            </Container>
        </>

    )
}
