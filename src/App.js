import { Component } from 'react'
import React from "react";
import { Navigation } from './components/navigation'
import SmoothScroll from 'smooth-scroll'
import Chart from './components/charts.js'
import {Help} from "./components/help";
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 700,
  speedAsDuration: true,
})


class App extends Component{
  constructor(props) {
    super(props);
 }


  render(){

    const style = {
      margin: 10,
      top:'auto' ,
      right: -25,
      bottom: 70,
      left: 'auto',
      position: 'fixed',
      backgroundColor:'red',
      fontSize:"18px",
      color:"white",
      fontFamily: 'Playfair Display sans-serif',
      fontWeight:'Bold',
  
      
  }
  

  return (
      <React.Fragment>
        <Navigation/>
        <Chart/>
        <Help/>
      </React.Fragment>)


  }


}

  export default App




