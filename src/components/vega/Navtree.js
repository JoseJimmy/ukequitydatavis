import React, {Component, useEffect, useRef, useState} from 'react';
import {Vega} from 'react-vega';
import _ from "lodash";
import {mutate, tidy} from "@tidyjs/tidy";
 // {"events": "dblclick","markname":"nodes", "throttle":200,"update": "datum.id"},{"events": "@cell:dblclick", "throttle":200,"update": "datum.id"}
//



class Navtree extends Component {
    constructor(props) {
        super(props);
        this.state = {

            spectall:{
  "$schema": "https://vega.github.io/schema/vega/v5.json","title": "UK FTSE All Share Index(ex Inv Trusts)",

  "description": "An example of Cartesian layouts for a node-link diagram of hierarchical data.",
  "width": "container",
  "autosize": {"type": "pad", "resize": true},
  "padding": {"left": 5, "right": 15, "top": 15, "bottom":0},
  "signals": [
    {
      "name": "width",
      "update": "(containerSize()[0])",
      "on": [
        {
          "events": {"source": "window", "type": "resize"},
          "update": "containerSize()[0]"
        }
      ]
    },

{
      "name": "height",
      "update": "(containerSize()[1])",
      "on": [
        {
          "events": {"source": "window", "type": "resize"},
          "update": "containerSize()[1]"
        }
      ]
    },

    { "name": "treex", "update": "width*0.5" },
    { "name": "treey", "update": "height*0.9" },
            { "name": "voroni-x", "update": "width*0.8" },

        { "name": "voroni-y", "update":"height*0.8" },
                  { "name": "voroni-size", "update": "[width*0.9,height*0.9]" },

{
      "name": "NodeFocus",
      "description": "Node single click",
      "value": -1,
      "on": [{"events": "@cell:click","consume":"false", "throttle": 500, "update": "datum.id"}]
    },
    {
      "name": "nodeSel",
      "description": "Node double click",
      "on": [
        {"events": "@cell:dblclick","consume":"true","throttle": 10, "update": "datum.id"},
                  {"events": "dblclick","type":"symbol","consume":"true","throttle": 10, "update": "datum.id"}

      ]
    }


  ],
  "data": [
    {
      "name": "table"
    },
{"name":"colors",
"values": [{"id":1,"color":"#21f0b6"},{"id":2,"color":"#9f3b60"},{"id":3,"color":"#5fe12e"},{"id":4,"color":"#de19f7"},{"id":5,"color":"#6a9012"},{"id":6,"color":"#7771ff"},{"id":7,"color":"#afd35a"},{"id":8,"color":"#421ec8"},{"id":9,"color":"#eec052"},{"id":10,"color":"#2f4285"},{"id":11,"color":"#a0d1bc"},{"id":12,"color":"#cb2c17"},{"id":13,"color":"#255026"},{"id":14,"color":"#ea8cd0"},{"id":15,"color":"#754819"},{"id":16,"color":"#a6b6f9"},{"id":17,"color":"#fd8f2f"}]},

    {
      "name": "tree",
      "source": "table",
      "transform": [
            {
  "type": "window",
  "sort": {"field": "id", "order": "ascending"},
  "ops": ["row_number"],
  "fields": ["id"],
  "as": ["coloridx"]
},
 {
        "type": "lookup",
        "from": "colors",
        "key": "id",
        "fields": ["coloridx"],
        "values":["color"],
        "as":["coloridx1"]
      },
       {"type": "collect", "sort": {"field": "ret", "order": "descending"}},



        {"type": "stratify", "key": "id", "parentKey": "parent"},
        {
          "type": "tree",
          "method": "tidy",
          "size": [{"signal":"treey"},{"signal":"treex"}],
          "separation": true,
          "as": ["y", "x", "depth", "children"]
        },
        {"type": "formula", "as": "x", "expr": "datum.parent>0?datum.x-65:datum.x+30"}
,
        {
          "type": "voronoi",
          "size": [{"signal":"voroni-x"},{"signal":"voroni-y"}],
          // "size": [586,{"signal":"voroni-y"}],

          "x": "x",
          "y": "y",
          "as": "path"
        },
 {"type": "formula", "as": "Name", "expr": "indexof(datum.Name,'-')>0 ? split(datum.Name,'-')[1]:datum.Name"},
          {"type": "formula", "as": "Name", "expr": "split(datum.Name,'&')"}

      ]
    },    {
      "name":"cells",
      "source":"tree",
      "transform":[{"type":"project","fields":["id","path"],"as":["id","path"]}]
    },
    {
      "name": "links",
      "source": "tree",
      "transform": [
        {"type": "treelinks"},
        {"type": "linkpath", "orient": "horizontal", "shape": "diagonal"}
      ]
    }

,


        {
      "name": "categoryLookup",
      "values": [
        {"TicType": "ind", "text": "Industries","parent":"Market  "},
              {"TicType": "sec", "text": " Sectors ","parent":"Industy  "},
                            {"TicType": "stk", "text": " Stocks ","parent":"Sector "}

      ]

    },
        {
      "name": "category",
      "source": "tree",
      "transform":[
        {"type": "filter", "expr": "datum.children == 0"},
        {"type": "project", "fields": ["TicType"]},
        {"type": "project", "fields": ["TicType"]},
        {"type": "aggregate","groupby": ["TicType"]}        ,
      {
        "type": "lookup",
        "from": "categoryLookup",
        "key": "TicType",
        "fields": ["TicType"],
        "values":["text","parent"],
        "default":"  Stocks  "
      },
              {"type": "collect", "sort": {"field": "id", "order": "ascending"}}

            ]

    }


  ],
  "scales": [
 {
      "name": "color",
      "type": "ordinal",
      "range": [
        "#21f0b6",
        "#9f3b60",
        "#5fe12e",
        "#de19f7",
        "#6a9012",
        "#7771ff",
        "#afd35a",
        "#421ec8",
        "#eec052",
        "#2f4285",
        "#a0d1bc",
        "#cb2c17",
        "#255026",
        "#ea8cd0",
        "#754819",
        "#a6b6f9",
        "#fd8f2f"
      ],
      "domain": {"data":"tree","field":"coloridx"},
      "domainMax":17,
      "domainMin":1

    },

    {
      "name": "retColor",
      "type": "linear",
      "range": ["red", "white","green"],
      "domain": [-1,1],
      "domainMid":0,
      "interpolate": "hcl"
    }
  ],

  "marks": [

    {
      "type": "symbol",
      "name": "nodes",
      "zindex": 10,
      "from": {"data": "tree"},
       "tooltip": {"field": "Name"},
      "encode": {
        "enter": {
          "stroke": {"value": "#fff1e5"},
          "fillOpacity": {"value": 0.01},
          "size": {"value": 350},
          "fill": {"scale": "retColor", "field": "ret"}
        },
        "update": {
          "x": {"field": "x"},
          "y": {"field": "y"},
          "fill": {"scale": "retColor", "field": "ret"},
          "fillOpacity": [
                {"test": "datum.highlight==1", "value":0.3},
                {"value": 0.8}
              ],
          "opacity": {"value": 1},
          "stroke":{ "field": "color"},
          "strokeOpacity":  [
                {"test": "datum.highlight==1", "value":0.8},
                {"value": 0.1}
              ],
          "strokeWidth": [
                {"test": "datum.highlight==1", "value": 4},
                {"value": 1}
              ],
             "size": [
                {"test": "datum.parent>0", "value": 350},
                {"value": 600}
              ]

        },
        "hover": {"fillOpacity": {"value": 0.1}}
      }
    },
    {
      "type": "path",
      "interactive": false,
      "zindex": -1,
      "from": {"data": "links"},
      "encode": {
        "enter": {
          "path": {"field": "path"},
          "stroke": {"value": "#b3721e"},
          "strokeWidth": {"value": 0.4},
          "strokeOpacity": {"value": 0.5}
        }
      },
      "update": {
        "blend": "hard-light",
        "path": {"field": "path"},
        "stroke": {"value": "#b3721e"}
      }
    },
    {
      "name": "labels",
      "type": "text",
      "from": {"data": "tree"},
      "interactive": false,
      "zindex": -1,

      "encode": {
        "update": {
          "text": {"signal": "datum.Name"},
          "baseline": {"value": "alphabetic"},
          "opacity": {"value": 0.8},
           "fontSize": [{"test": "datum.parent>0","value":10},{"value":16}],
           "fontWeight": [{"test": "datum.parent>0","value":"normal"},{"value":"bold"}],
          "angle":[{"test": "datum.parent>0","value":0},{"value":-90}],
          "x": [{"test": "datum.parent>0","signal":"datum.x+15"},{"signal":"datum.x+5"}],
          "y": [{"test": "datum.parent>0","signal":"datum.y+5"},{"signal":"datum.y-15"}]
        }
      }
    },
        {
      "type": "text",
      "interactive": false,
      "zindex": -1,

      "from": {"data": "category"},
      "encode": {
        "update": {
          "text": {"field": "text"},
                       // "text": {"signal": "width"},

          "x": {"signal": "width - (width*0.695)"},
          "y": {"signal": "height - (height*0.595)"},
          "fill": {"value": "grey"},
          "fillOpacity": {"value": 0.25},
          "fontSize": {"value": 38},
          "angle":{"value": -90}
        }
      }
    },
    {
      "type": "text",
      "zindex": -1,

      "from": {"data": "category"},
      "encode": {
        "update": {
          "text": {"field": "parent"},

          "x": {"signal": "width - (width*0.90)"},
          "y": {"signal": "height-(height*0.23)"},
          "fill": {"value": "grey"},
                     "fontWeight": {"value":"bold"},

          "fillOpacity": {"value": 0.25},
          "fontSize": {"value": 40},
          "angle":{"value": -90}
        }
      }
    },
    { "name":"cell",
      "type": "path",
      "from": {"data": "tree"},
      "encode": {
        "enter": {
          // "stroke": {"value": "firebrick"},
          "fill": {"value": "transparent"}
        }
      },
      "transform": [
        {
          "type": "voronoi",
          "x": "datum.x", "y": "datum.y",
          "extent": [[15,10],{"signal":"voroni-size"}]
        }
      ]
    }
  ]
},
            filtset: [],
            view: [],
        }
    }
    handleNewView = view => {
        {
            this.setState({view: view});
            this.setState({selectedNode: this.props.selectedNode});
                    //console.log("Initial state view : ", this.state.view)
view.addSignalListener('nodeSel', function(name, value) {
  //console.log('########### Signal Listener nodeSel: ' + value);
  })
  // view.addSignalListener('Signal Listener  nodeFocus', function(name, value) {
  // //console.log('########### nodeFocus: ' + value);
  //   //
  // })
            view.preventDefault(true);

        this.setState({viewCreated: true});
        this.setState({readyforUpdate: true})


        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.dataUpdated !== prevProps.dataUpdated) {
            this.setState({filtset: this.props.data})
        }
    }

    render() {
     const  vconfig = {"events": {
  "defaults": {
    "prevent": true
  }
}}
console.log("data befor treenav ",this.props.data )
                return (this.props.isLoaded ? <Vega data={{table: this.props.data}} className={''} spec={this.state.spectall} renderer={'svg'}
                  signalListeners={{nodeSel: this.props.nodeSel,NodeFocus:this.props.nodeFocus}} onNewView={this.handleNewView}
                  actions={false} /> : []);

    }
}

export default Navtree;

//            specwide:{
//   "$schema": "https://vega.github.io/schema/vega/v5.json",
//   "description": "An example of Cartesian layouts for a node-link diagram of hierarchical data.",
//  "width": "container",
//   "padding": {"left": 15, "right":0, "top": 0 , "bottom":0},
//   "autosize": {"type": "pad", "resize": true},
//   "signals": [
//       {
//       "name": "width",
//        "update": "containerSize()[0]",
//       "on": [
//         {
//          "events": {"source": "window", "type": "resize"},
//            "update": "containerSize()[0]"
//        } ]
// },
//     {
//       "name": "height",
//       "update": "width*1.7",
//     },
//        { "name": "treex", "update": "width" },
//     { "name": "treey", "update": "height" },
//             { "name": "voroni-x", "update": "treex*1.35" },
//
//         { "name": "voroni-y", "update": "treey*1.25" },
//
//     {
//       "name": "nodeSel",
//       "description": "Node double click",
//       "value": -1,
//       "on": [
//
//         {
//           "events": "dblclick",
//           "markname": "nodes",
//           "throttle": 10,
//           "update": "datum.id"
//         },
//         {"events": "@cell:dblclick", "throttle": 10, "update": "datum.id"}
//       ]
//     },
//     {
//       "name": "NodeFocus",
//       "description": "Node single click",
//       "value": -1,
//       "on": [{"events": "@cell:click", "throttle": 50, "update": "datum.id"}]
//     }
//
//   ],
//   "data": [
//     {
//       "name": "table",
//       "values": [
//   {
//     "parent": 10000,
//     "id": 19000,
//     "Name": "Industry - Energy",
//     "TicType": "ind",
//     "Ticker": "IDX:FT60",
//     "ret_3M": 0.12404,
//     "ret": 0.12404
//   },
//   {
//     "parent": 10000,
//     "id": 12000,
//     "Name": "Industry - Telecommunications",
//     "TicType": "ind",
//     "Ticker": "IDX:FT15",
//     "ret_3M": 0.11551,
//     "ret": 0.11551
//   },
//   {
//     "parent": 10000,
//     "id": 18000,
//     "Name": "Industry - Basic Materials",
//     "TicType": "ind",
//     "Ticker": "IDX:FT55",
//     "ret_3M": 0.09453,
//     "ret": 0.09453
//   },
//   {
//     "parent": 10000,
//     "id": 21000,
//     "Name": "Industry - Real Estate ",
//     "TicType": "ind",
//     "Ticker": "IDX:AXX3510-GBP",
//     "ret_3M": 0.08344,
//     "ret": 0.08344
//   },
//   {
//     "parent": 10000,
//     "id": 15000,
//     "Name": "Industry - Consumer Discretionary",
//     "TicType": "ind",
//     "Ticker": "IDX:FT40",
//     "ret_3M": 0.07564,
//     "ret": 0.07564
//   },
//   {
//     "parent": 10000,
//     "id": 14000,
//     "Name": "Industry - Financials",
//     "TicType": "ind",
//     "Ticker": "IDX:FT30",
//     "ret_3M": 0.05912,
//     "ret": 0.05912
//   },
//   {
//     "parent": "",
//     "id": 10000,
//     "Name": "FTSE All-Share Index (ASX)",
//     "TicType": "mkt",
//     "Ticker": "IDX:ASX",
//     "ret_3M": 0.04746,
//     "ret": 0.04746
//   },
//   {
//     "parent": 10000,
//     "id": 17000,
//     "Name": "Industry - Industrials",
//     "TicType": "ind",
//     "Ticker": "IDX:FT50",
//     "ret_3M": 0.04739,
//     "ret": 0.04739
//   },
//   {
//     "parent": 10000,
//     "id": 11000,
//     "Name": "Industry - Technology",
//     "TicType": "ind",
//     "Ticker": "IDX:FT10",
//     "ret_3M": 0.03324,
//     "ret": 0.03324
//   },
//   {
//     "parent": 10000,
//     "id": 16000,
//     "Name": "Industry - Consumer Staples",
//     "TicType": "ind",
//     "Ticker": "IDX:FT45",
//     "ret_3M": 0.00554,
//     "ret": 0.00554
//   },
//   {
//     "parent": 10000,
//     "id": 20000,
//     "Name": "Industry - Utilities",
//     "TicType": "ind",
//     "Ticker": "IDX:FT65",
//     "ret_3M": -0.0027,
//     "ret": -0.0027
//   },
//   {
//     "parent": 10000,
//     "id": 13000,
//     "Name": "Industry - Health Care",
//     "TicType": "ind",
//     "Ticker": "IDX:FT20",
//     "ret_3M": -0.01706,
//     "ret": -0.01706
//   }
// ]
//     },
//     {
//       "name": "tree",
//       "source": "table",
//       "transform": [
//         {"type": "stratify", "key": "id", "parentKey": "parent"},
//         {
//           "type": "tree",
//           "method": "tidy",
//           "size": [{"signal":"treex"},{"signal":"treey"}],
//           "separation": true,
//           "as": ["x", "y", "depth", "children"]
//         },
//         {"type": "formula", "as": "y", "expr": "datum.parent>0?datum.x-15:datum.x"}
// ,
//         {
//           "type": "voronoi",
//           "size": [{"signal":"voroni-x"},{"signal":"voroni-y"}],
//           "x": "x",
//           "y": "y",
//           "as": "path"
//         },
//  {"type": "formula", "as": "Name", "expr": "indexof(datum.Name,'-')>0 ? split(datum.Name,'-')[1]:datum.Name"},
//           {"type": "formula", "as": "Name", "expr": "split(datum.Name,'&')"}
//
//       ]
//     },
//     {
//       "name": "links",
//       "source": "tree",
//       "transform": [
//         {"type": "treelinks"},
//         {"type": "linkpath", "orient": "vertical", "shape": "diagonal"}
//       ]
//     }
//
// ,
//
//
//         {
//       "name": "categoryLookup",
//       "values": [
//         {"TicType": "ind", "text": "Industries"},
//               {"TicType": "sec", "text": " Sectors "}
//       ]
//
//     },
//         {
//       "name": "category",
//       "source": "tree",
//       "transform":[
//         {"type": "filter", "expr": "datum.children == 0"},
//         {"type": "project", "fields": ["TicType"]},
//         {"type": "project", "fields": ["TicType"]},
//         {"type": "aggregate","groupby": ["TicType"]}        ,
//       {
//         "type": "lookup",
//         "from": "categoryLookup",
//         "key": "TicType",
//         "fields": ["TicType"],
//         "values":["text"],
//         "default":"  Stocks  "
//       }
//             ]
//
//     }
//
//
//   ],
//   "scales": [
//
//
//     {
//       "name": "retColor",
//       "type": "linear",
//       "range": ["red", "white","green"],
//       "domain": [-1,1],
//       "domainMid":0,
//       "interpolate": "hcl"
//     }
//   ],
//   "legends": [
//         {
//       "title": "Period Returns %",
//       "fill": "retColor",
//       "gradientLength": 30,
//       "gradientOpacity": 0.5,
//       "gradientThickness": 10,
//       "direction": "horizontal",
//       "orient": "bottom-left",
//       "labelFontSize": 8,
//       "titleBaseline": "line-top",
//       "titleOrient": "top",
//       "encode":
//       {"symbols":
//       {"fill": "retColor"}}
//     }
//   ],
//   "marks": [
//     {
//       "type": "path",
//       "name": "cell",
//       "zindex": 2,
//       "from": {"data": "tree"},
//       "encode": {
//         "enter": {
//           "fill": {"value": "transparent"},
//           "strokeWidth": {"value": 0.01}
//         },
//         "update": {"path": {"field": "path"}, "stroke": {"value": "green"}
//
//
//         }
//
//
//       }
//     },
//     {
//       "type": "symbol",
//       "name": "nodes",
//       "interactive": false,
//       "zindex": 3,
//       "from": {"data": "tree"},
//        "tooltip": {"content": "data"},
//       "encode": {
//         "enter": {
//           "stroke": {"value": "#fff1e5"},
//           "fillOpacity": {"value": 0.01},
//           "size": {"value": 350},
//           "fill": {"scale": "retColor", "field": "ret"}
//         },
//         "update": {
//           "x": {"field": "x"},
//           "y": {"field": "y"},
//           "stroke": {"value": "#b06c13"},
//           "fill": {"scale": "retColor", "field": "ret"},
//           "fillOpacity": {"value": 0.8},
//           "size": {"value": 350},
//           "opacity": {"value": 1},
//           "strokeOpacity": {"value": 0.5}
//         },
//         "hover": {"fillOpacity": {"value": 0.1}}
//       }
//     },
//     {
//       "type": "path",
//       "interactive": false,
//       "zindex": 0,
//       "from": {"data": "links"},
//       "encode": {
//         "enter": {
//           "path": {"field": "path"},
//           "stroke": {"value": "#b3721e"},
//           "strokeWidth": {"value": 0.4},
//           "strokeOpacity": {"value": 0.5}
//         }
//       },
//       "update": {
//         "blend": "hard-light",
//         "path": {"field": "path"},
//         "stroke": {"value": "#b3721e"}
//       }
//     },
//     {
//       "name": "labels",
//       "type": "text",
//       "from": {"data": "tree"},
//
//       "encode": {
//         "enter": {
//           "text": {"signal": "datum.Name"},
//           "baseline": {"value": "left"},
//           "opacity": {"value": 0.8},
//            "fontSize": [{"test": "datum.parent>0","value":10},{"value":14}],
//            "fontWeight": [{"test": "datum.parent>0","value":"normal"},{"value":"bold"}],
//
//           "angle":[{"test": "datum.parent>0","value":-45},{"value":0}],
//           "x": [{"test": "datum.parent>0","signal":"datum.x+3"},{"signal":"datum.x+15"}],
//           "y": [{"test": "datum.parent>0","signal":"datum.y-15"},{"signal":"datum.y+4"}]
//         },
//         "update": {
//
//         }
//       }
//     },
//         {
//       "type": "text",
//             "from": {"data": "category"},
//
//
//       "encode": {
//
//
//         "update": {
//           "text": {"field": "text"},
//           "x": {"signal": "width/2-85"},
//           "y": {"signal": "height/3.5"},
//           "fill": {"value": "grey"},
//           "fillOpacity": {"value": 0.25},
//           "fontSize": {"value": 50}
//         }
//       }
//     }
//   ]
// },





