import React, {Component} from "react";
import Fab from '@material-ui/core/Fab';
import _ from "lodash";

import {arrange, cumsum, filter, groupBy, mutate, mutateWithSummary, sum, summarize, tidy} from "@tidyjs/tidy";
import {
    ButtonToolbar, Col, Row, Container,

    ToggleButton,
    ToggleButtonGroup, Button
} from "react-bootstrap";
import Navtree from "./vega/Navtree";
import PriceChart from "./vega/PriceChart";
import RetVol from "./vega/RetVol";
// import {Button, Grid} from "@material-ui/core";
//style={{color: "white",fontSize:35,fontWeight:"bold",fontFamily: "Playfair Display"}}


export default class Chart extends Component {
    constructor(props) {
        super(props);
        // this.b_handleMarketSel = this.b_handleMarketSel.bind(this);
        this.vegaSelNode = this.vegaSelNode.bind(this);
        // this.vegaFocusNode = this.vegaFocusNode.bind(this);
        this.timeframeBtnHandler = this.timeframeBtnHandler.bind(this);
        this.backButton = this.backButton.bind(this);
        this.state = {
            error: null,
            isLoaded: false,

            dataupdated: false,
            dispupdated: false,
            nodeDataRaw: {},
            nodeDataAim: {},
            nodeDataFull: {},
            nodeDataDisp: {},
            nodeDataDispUnfilt: {},
            rootToDisplay: 10000,
            selectedNode: 10000,
            currMareketRoot: 10000,
            allowBackButton: false,
            focusNodesList: [],
            focusNodesListUpdated: false,
            priceFullDataSet: [],
            isPriceLoaded: false,
            priceDispDataSet: [],
            chartTimePeriod: '2Y',
            market: "Full",
            urlNavTreeFull: "https://raw.githubusercontent.com/JoseJimmy/equvis/main/treeNavFull.Json",
            urlNavTreeAim: "https://raw.githubusercontent.com/JoseJimmy/equvis/main/treeNavAim.Json",
            urlRetTsFull: "https://raw.githubusercontent.com/JoseJimmy/equvis/main/retTsDataFull5Y.Json",
            urlRretTsAim: "https://raw.githubusercontent.com/JoseJimmy/equvis/main/retTsDataAim5Y.Json"
        };
    };


    filterCombined = (rootNode, fullNodeData, fullPriceData, focusNodesList, period = '2Y') => {
        console.log("From filter price data - focusNodesList ", focusNodesList)
        // let period = this.state.chartTimePeriod;
        const coloroptions = ["#069668", "#ff4d82", "#91da4d", "#5920af", "#5cd6f4", "#2c4a5e", "#b6c5f5", "#334aab", "#edb1ff", "#a1085c", "#39eec0", "#683c00", "#c2cba1", "#02531d", "#09f54c", "#d003d6", "#deda52", "#298cc0", "#68374f", "#b55edb", "#798a58", "#9f2114", "#fab899", "#af7662", "#fd5917"];

        let retKey = "ret_" + period;
        let volKey = "vol_" + period
        let fields = ["parent", "id", "Name", "mktCap", "Brokers", "TicType", "Ticker", retKey, volKey]
        let f = _.cloneDeep(tidy(fullNodeData, filter((d) => (d.parent == rootNode) || (d.id == rootNode))))
        const rooIdx = f.findIndex((d => d.id == rootNode));
        f[rooIdx].parent = ""
        f = _.map(f, _.partialRight(_.pick, fields));
        f.map(d => {
            d['ret'] = d[retKey]
        })
        f = _.reverse(_.sortBy(f, ['ret']))
        f.map(d => {
            d['vol'] = d[volKey]
        })
        f = _.reverse(_.sortBy(f, ['vol']))
        let dateLookup = {  "3M": "2021-01-01","6M": "2020-10-03","1Y": "2020-04-01","2Y": "2019-04-02","3Y": "2018-04-02","5Y": "2016-03-28" }
        // let dateLookup = {
        //     "6M": "2020-10-03",
        //     "1Y": "2020-04-01",
        //     "2Y": "2019-04-02",
        //     "3Y": "2018-04-02",
        //     "5Y": "2016-03-28"
        // }

        let startdate = new Date(dateLookup[period]).getTime();
        console.log("tIME PERIOD SELECTED ", period);
        let showList = [...new Set([...focusNodesList, ...f.map(d => d.id)])];
        let filtresult = fullPriceData.filter(d => {
            var time = new Date(d.Date).getTime();
            return (time >= startdate);
        });
        let priceDispDataSet = filtresult.filter((d) => showList.map((id) => id).includes(d.id),)
        priceDispDataSet = tidy(priceDispDataSet, mutate({show: (d) => 1, highlight: (d) => 0,}));
        priceDispDataSet.forEach(d => {
            d.highlight = focusNodesList.includes(d.id) ? 1 : 0;
        })
        f = tidy(f, mutate({show: (d) => 1, highlight: (d) => 0,}));
        f.forEach(d => {
            d.highlight = focusNodesList.includes(d.id) ? 1 : 0;
        });

        let p = priceDispDataSet;
        p = p.map(function (d) {
            d['Date'] = new Date(d['Date']);
            return d
        })
        let startDate = p.reduce((min, p) => p['Date'] < min ? p['Date'] : min, p[0].Date)
        p.forEach(function (d) {
            d['cumChange'] = d['Date'] > startDate ? Math.log(1 + d['Change']) : 0;
            return d
        })
        p = tidy(p, groupBy('id', [arrange(['id', 'Date']), mutateWithSummary({cumChange: cumsum('cumChange')})]));
        p.forEach(function (d) {
            d['cumChange'] = Math.exp(d['cumChange']) - 1;
            return d
        });
        p.forEach(function (dest) {
            dest['Name'] = fullNodeData[fullNodeData.findIndex((src => src.id == dest['id']))]['Name']
        })
        p.forEach(function (dest) {
            dest['Ticker'] = fullNodeData[fullNodeData.findIndex((src => src.id == dest['id']))]['Ticker']
        })
        let ids = [...new Set([...p.map(d => d.id), ...f.map(d => d.id)])];
        let colorMap = ids.map((d, i) => ({"id": d, "color": coloroptions[i]}))
        p.forEach(function (dest) {
            dest['color'] = colorMap[colorMap.findIndex((src => src.id == dest['id']))]['color']
        })
        f.forEach(function (dest) {
            dest['color'] = colorMap[colorMap.findIndex((src => src.id == dest['id']))]['color']
        })


        p.forEach(function (dest) {
            dest['ret'] = fullNodeData[fullNodeData.findIndex((src => src.id == dest['id']))][retKey]
        })
        p.forEach(function (dest) {
            dest['vol'] = fullNodeData[fullNodeData.findIndex((src => src.id == dest['id']))][volKey]
        })


        let dataupdated_flag = this.state.dataupdated;
        this.setState({
            focusNodesList: focusNodesList,
            nodeDataDisp: f,
            rootToDisplay: rootNode,
            dataupdated: !dataupdated_flag,
            priceDispDataSet: p,
            isLoaded: true,
            isPriceLoaded: true
        })
        console.log("from fetch data CombinedFDilter - proces filtere ", p, "  navdata filtered", f, " roottodisp ", rootNode, "focuslist", focusNodesList);

    }

    findParentNode = (currMareketRoot, rootToDisplay, nodeDataDispUnfilt) => {

        const idx = nodeDataDispUnfilt.findIndex((d => d.id == rootToDisplay));
        let parent = _.cloneDeep(nodeDataDispUnfilt[idx].parent);
        //console.log("back pressed, founc parent ", parent, " child  ", rootToDisplay, "idx ", idx, "searched tis => ", nodeDataDispUnfilt)
        if (parent == "" || parent == null) {
            return currMareketRoot
        } else {
            return parent
        }
    }

    fetchNavDataset() {
        let urlNavTree = (this.state.market === 'Full') ? this.state.urlNavTreeFull : this.state.urlNavTreeAim;
        let urlRetTs = (this.state.market === 'Full') ? this.state.urlRetTsFull : this.state.urlRretTsAim;
        fetch(urlRetTs).then(res => res.json()).then(priceDataFull => {
            fetch(urlNavTree).then(p => p.json()).then(navDataFull => {
                priceDataFull.map(d => {
                    d['Date'] = new Date(d['Date'])
                });
                let rootToDisplay = this.state.currMareketRoot;
                let focusNodeList = [rootToDisplay];
                console.log("from fetch data pricedata ", priceDataFull, "  navdata", navDataFull, " roottodisp ", rootToDisplay, "focuslist", focusNodeList);
                this.setState({priceFullDataSet: priceDataFull, nodeDataDispUnfilt: navDataFull});
                this.filterCombined(rootToDisplay, navDataFull, priceDataFull, focusNodeList)


            })
        })
    }


    componentDidMount() {
        this.fetchNavDataset();
    }


    vegaSelNode = _.debounce((...args) => {
            let focusNodesList = _.cloneDeep(this.state.focusNodesList)
            let userSelNode = this.state.rootToDisplay;
            let x = this.state.nodeDataDispUnfilt;
            console.log("Entry Select Node args", args, "usr sele node", userSelNode, " focusNodesList", focusNodesList)
            if (args[0] == 'nodeSel') {

                userSelNode = args[1];
                // console.log("user sel tictype", (x[x.findIndex((d => d.id == userSelNode))]['TicType']))

                if ((this.state.currMareketRoot == this.state.rootToDisplay && userSelNode == this.state.currMareketRoot)) {
                    return;
                }
                if (x[x.findIndex((d => d.id == userSelNode))]['TicType'] == 'stk') {
                    console.log('stock Node return');
                    return;
                }
                if (userSelNode == this.state.rootToDisplay) {
                    userSelNode = this.findParentNode(this.state.currMareketRoot, this.state.rootToDisplay, this.state.nodeDataDispUnfilt);
                }
                console.log("Exit  node Select (option 1)", args, " User selec ", userSelNode, "NodeFoocusList", focusNodesList)

            }
            // else { // node focus action
            //
            //     let focusNode = args[1];
            //     if (focusNodesList.includes(focusNode)) {
            //         focusNodesList = focusNodesList.filter(item => item !== focusNode)
            //     } else {
            //         focusNodesList.push(focusNode)
            //     }
            //     console.log("Exit  focus Select (option 2)",args," User selec ",userSelNode,"NodeFocusList",focusNodesList)
            //
            // }
            //

            this.filterCombined(userSelNode, this.state.nodeDataDispUnfilt, this.state.priceFullDataSet, focusNodesList);
            console.log("Exit  Vegaselnode Select (option 2)", args, " User selec ", userSelNode, "NodeFoocusList", focusNodesList)

            return;
        }
        , 0)

    backButton = () => {
        console.log("back button prssed")
        let focusNodesList = _.cloneDeep(this.state.focusNodesList)
        let userSelNode = this.state.rootToDisplay;
        if (userSelNode == this.state.currMareketRoot) {
            return;
        }
        userSelNode = this.findParentNode(this.state.currMareketRoot, this.state.rootToDisplay, this.state.nodeDataDispUnfilt);
        console.log("Exit  node Select (option 1)", " User selec ", userSelNode, "NodeFoocusList", focusNodesList)
        this.filterCombined(userSelNode, this.state.nodeDataDispUnfilt, this.state.priceFullDataSet, focusNodesList);
        console.log("Exit  Back Button Pressed Select (option 2)", " User selec ", userSelNode, "NodeFoocusList", focusNodesList)
        return;
    }


    vegaFocusNode = _.debounce((...args) => {
            let focusNodesList = _.cloneDeep(this.state.focusNodesList)
            let userSelNode = this.state.rootToDisplay;
            let x = this.state.nodeDataDispUnfilt;
            console.log("Entry Select Node args", args, "usr sele node", userSelNode, " focusNodesList", focusNodesList)
            if (args[0] == 'nodeSel') {
                return
            }

            {



                let focusNode = args[1];
                if (focusNodesList.includes(focusNode)) {
                    focusNodesList = focusNodesList.filter(item => item !== focusNode)
                } else {
                    focusNodesList.push(focusNode)
                }
                console.log("Exit  focus Select (option 2)", args, " User selec ", userSelNode, "NodeFocusList", focusNodesList)

            }


            this.filterCombined(userSelNode, this.state.nodeDataDispUnfilt, this.state.priceFullDataSet, focusNodesList);
            console.log("Exit  Vegaselnode Select (option 2)", args, " User selec ", userSelNode, "NodeFoocusList", focusNodesList)

            return;
        }
        , 250)


    timeframeBtnHandler = (period) => {
        this.setState({chartTimePeriod: period}, function () {
            let userSelNode = this.state.selectedNode,
                focusNodesList = this.state.focusNodesList;
            this.filterCombined(userSelNode, this.state.nodeDataDispUnfilt, this.state.priceFullDataSet, focusNodesList, period);
        })
    }


    render() {
        const style = {
            margin: 0,
            top: 'auto',
            right: 15,
            bottom: 20,
            left: 10,
            position: 'fixed',
            backgroundColor: 'red',
            fontSize: "18px",
            color: "white",
            fontFamily: 'Playfair Display',
            fontWeight: 'Bold'
        }

        const styles = {
            container: {},
            left: {
                height: "80vh", // I want to change this
                padding: 5,
                margin: 0,
                // backgroundColor: 'yellow'
            },
            right: {
                height: "80vh", // I want to change this
                padding: 5,
                margin: 0,
                // backgroundColor: 'red'
            },

            buttons: {
                padding: 0,
                height: "5%",
                paddingBottom: '5px',
                // backgroundColor: 'green'
            },
            button_style: {
                padding: 0,
                height: "5%",
                paddingBottom: '5px',
                "background-color": "blue !important"
            },
            priceCharts: {
                // backgroundColor: 'white',
                height: "25%",


            },
            retVolChart: {
                // backgroundColor: 'yellow',
                height: "50%",


            },

            navtree: {},
        }

//https://medium.com/@julianajlk/grids-rows-and-columns-in-react-bootstrap-c36a703c3c45
        return (<React.Fragment>
                <div id='charts-grid'>
                    <Container fluid>
                        <Row style={{height: '100%'}}>
                            <Col md={4} lg={4} style={{height: '100%', paddingLeft: "35px"}} id={"Left"}>
                                <Row style={{height: '70%'}}>
                                    <Container style={{height: '100%'}}>
                                        <Navtree data={this.state.nodeDataDisp}
                                                 isLoaded={this.state.isLoaded}
                                                 market={this.state.market}
                                                 dataUpdated={this.state.dataupdated}
                                                 nodeSel={(...args) => this.vegaSelNode(...args)}
                                                 nodeFocus={(...args) => this.vegaFocusNode(...args)}/>
                                    </Container>
                                </Row>
                                <Row style={{height: '5%', paddingTop: "-40px", paddingBottom: "75px"}}>
                                    <Col md={4} lg={4}></Col>
                                    <Col md={2} lg={2}><Button className={'button'} style={{
                                        background: "none",
                                        textAlign: "center",
                                        width: "75px",
                                        border: "2px solid #d46313",
                                        color: "#d46313"
                                    }} variant="outline" onClick={this.backButton}>back</Button></Col>
                                    <Col md={6} lg={6}></Col>
                                </Row>
                                <Row>
                                    <ButtonToolbar>
                                        <ToggleButtonGroup id='time-btn-style' size="xsmall" type="radio" name="options"
                                                           defaultValue={"2Y"}
                                                           onChange={this.timeframeBtnHandler} className={"btn-group"}>
                                            <ToggleButton className="button" value={"3M"}>3M</ToggleButton>
                                            <ToggleButton className="button" value={"6M"}>6M</ToggleButton>
                                            <ToggleButton className="button" value={"1Y"}>1Y</ToggleButton>
                                            <ToggleButton className="button" value={"2Y"}>2Y</ToggleButton>
                                            <ToggleButton className="button" value={"3Y"}>3Y</ToggleButton>
                                            <ToggleButton className="button" value={"5Y"}>5Y</ToggleButton>
                                        </ToggleButtonGroup>
                                        <Button className="button">Help</Button>

                                    </ButtonToolbar>
                                </Row>
                            </Col>


                            <Col md={8} lg={8} style={{height: '100%', paddingLeft: "0px"}}>
                                <Row style={{height: '30%', width: '100%'}} id={"price"}>
                                    <PriceChart priceData={this.state.priceDispDataSet}
                                                navtreeData={this.state.nodeDataDispUnfilt}
                                                isPriceLoaded={this.state.isPriceLoaded}
                                                isLoaded={this.state.isLoaded}
                                                dataUpdated={this.state.dataupdated}
                                                nodeFocusPrice={(...args) => this.vegaSelNode(...args)}/>
                                </Row>
                                <Row style={{height: '64%', width: '100%'}} id={"retvol"}>
                                    <RetVol navtreeData={this.state.nodeDataDisp}
                                            priceData={this.state.priceDispDataSet}
                                            isLoaded={this.state.isLoaded}
                                            isPriceLoaded={this.state.isPriceLoaded}
                                            dataUpdated={this.state.dataupdated}/>
                                </Row>
                            </Col>

                        </Row>


                    </Container>
                </div>


            </React.Fragment>
        )
    }
}

// export default Chart;