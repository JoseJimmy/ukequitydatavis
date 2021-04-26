import React, {Component, useEffect, useRef, useState} from 'react';
import {Vega, VegaLite, View} from 'react-vega';
import _ from "lodash";
import {mutate, tidy} from "@tidyjs/tidy";

class PriceChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filtset: [{"id":10000,"show":1,"highlight":0},
                {"id":12205,"show":1,"highlight":1},
                {"id":12000,"show":1,"highlight":0},
                {"id":13000,"show":1,"highlight":0},
                {"id":14000,"show":1,"highlight":0},
                {"id":15000,"show":1,"highlight":0},
                {"id":16000,"show":1,"highlight":0},
                {"id":17000,"show":1,"highlight":0}],
            view: [],
            spec:{
  "$schema": "https://vega.github.io/schema/vega/v5.json","title": "Baselined Index/Sector/Market/Stocks Performance",
  "description": "A basic line chart example.",
  "width": "container",
  "padding": {"left": 0, "right":0, "top": 5  , "bottom": 0},
  "autosize": {"type": "pad", "resize": true},
  "signals": [
{
      "name": "width",
       "update": "0.9*containerSize()[0]",
      "on": [
        {
         "events": {"source": "window", "type": "resize"},
           "update": "0.9*containerSize()[0]"
       } ]
},
    {
      "name": "height",
      "update": "width*0.25",
    },

    {
      "name": "NodeFocus",
      "description": "Node focus",
      "value": -1,
      "on": [
        {
          "events": [{"type": "click", "marktype": "line"}],
          "update": "datum.id "
        }
      ]
    },


  ],
  "data": [
    {
      "name": "priceData",
      "format": {"parse": {"Date": "date"}},

    },


    {
      "name": "displaySet",
      "source": "priceData"
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "time",
      "range": "width",
      "domain": {"data": "displaySet", "field": "Date"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "round": true,
      "domain": {"data": "displaySet", "field": "cumChange"}
    },
    {
      "name": "color",
      "type": "ordinal",
      "range":{"data": "displaySet", "field": "color"},
      "domain": {"data": "displaySet", "field": "Name"}
    }
  ],"legends": [{"stroke": "color", "type": "symbol","columns":2}],
  "axes": [
    {"orient": "bottom", "scale": "x", "title": "Date", "grid": true},
    {
      "orient": "left",
      "scale": "y",
      "grid": true,
      "title": "Baselined Price Returns(%)"
    }
  ],
  // "legends": [{"stroke": "color", "type": "symbol"}],
  "marks": [
    {
      "type": "group",
      "from": {
        "facet": {
          "name": "selectedGrpd",
          "data": "displaySet",
          "groupby": "Name"
        }
      },
      "marks": [
        {
          "name": "priceline",
          "type": "line",
          "from": {"data": "selectedGrpd"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "Date"},
              "y": {"scale": "y", "field": "cumChange"},
              "strokeWidth": {"value": 2.5},
                  "tooltip": {
                "signal": "{title: datum.Ticker,Name:datum.Name,Date:timeFormat(datum.Date, '%b %d %Y  '),Change:datum.Change+'%'}"
              }
            },
            "update": {
                      "x": {"scale": "x", "field": "Date"},
              "y": {"scale": "y", "field": "cumChange"},
              "interpolate": {"value": "natural"},
              "stroke": {"field": "color"},
              "strokeOpacity": [
                {"test": "datum.highlight!=1", "value": 0.1},
                {"value": 0.8}
              ]
            },
            "hover": {"strokeOpacity": {"value": 0.8}}
          }
        },
        {
          "type": "symbol",
          "from": {"data": "selectedGrpd"},
          "encode": {
            "enter": {

              "size": {"value": 10},
              "tooltip": {
                "signal": "{title: datum.Ticker,Name:datum.Name,Date:timeFormat(datum.Date, '%b %d %Y  '),Change:datum.Change+'%'}"
              },
            },
            "update": {
              "size": {"value": 35},
              "interpolate": {"value": "natural"},
              "fillOpacity": [
                {"test": "datum.highlight==1", "value": 0.3},
                {"value": 0}
              ],
              "fill": [{"value": "grey"}],
                            "x": {"scale": "x", "field": "Date"},
              "y": {"scale": "y", "field": "cumChange"}

            },
            "hover": {"strokeOpacity": {"value": 1}}
          }
        }
      ]
    }
  ]
},
            focusNodesList:[],
            priceData:{
  "id": 10000,
  "Change": -0.02094,
  "Close": 2958.4,
  "Date": "2020-04-03T00:00:00.000Z",
  "DollarVolume": 2943619.2,
  "mktCap": 1778544.8,
  "DollarVolume_wt": 1.655,
  "show": 1,
  "highlight": 0,
  "cumChange": 0
},
          navtreeData:{}

        }
    }


    componentDidUpdate(prevProps) {

        if ((this.props.dataUpdated !== prevProps.dataUpdated) ) {

            this.setState({priceData:this.props.priceData,navtreeData: this.props.navtreeData})

        }
    }


    handleNewView = view => {
 {   this.setState({view: view});

 view.addSignalListener('width', function(name, value) {
  // console.log('########### Signal Listener chartwidth: ' + value);
   })
  view.addSignalListener('height', function(name, value) {
  // console.log('########### chartheight: ' + value);
    })

 }
        // console.log("Initial state view Price : ", this.state.view)
    };


    render() {
        // let data  = {pricedata: this.state.pricedata,show: this.state.filtset}

            // console.log("Data to  Price Chart , before Vega Call  1. Price Data ",this.props.priceData,"2. Navtree ",this.props.navtreeData)
           // const ele = ( <Vega data={{priceData:this.props.priceData,navtreeData:this.props.navtreeData}} spec={this.state.spec} renderer={'svg'} onNewView={this.handleNewView} signalListeners={{NodeFocus:this.props.nodeFocusPrice}}   actions={false} /> );
           return (this.props.isPriceLoaded && this.props.isLoaded ?
               ( <Vega data={{priceData:this.props.priceData}}
                       spec={this.state.spec} renderer={'svg'} onNewView={this.handleNewView}
                       signalListeners={{NodeFocus:this.props.nodeFocusPrice}}
                       actions={false} /> ) : []) }
}

export default  PriceChart;
                //
                // return (this.props.isLoaded ? <Vega data={{table: this.props.data}} className={'NavTree'} spec={this.state.spectall} renderer={'svg'}
                //   signalListeners={{nodeSel: this.props.nodeSel,NodeFocus:this.props.nodeFocus}} onNewView={this.handleNewView}
                //   actions={false}/> : []);