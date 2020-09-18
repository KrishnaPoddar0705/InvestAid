import React, {Component} from 'react';
import axios from 'axios'

import Plot from 'react-plotly.js';

class App extends Component{
  constructor(props) {
    super(props);    
    this.state = {
      value: '',
      stocks1:[],
      isSubmitted: false,
      realData:[],
      candle:[],
      volume:[],
      logReturns: [],
      equalLogReturns: [],
      portfolioModel :[],


  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.historicalPrices = this.historicalPrices.bind(this);
    this.difflog = this.difflog.bind(this);
    this.timeSeriesForecast = this.timeSeriesForecast.bind(this);
this.markowitz = this.markowitz.bind(this);
  }



onSubmit(e) {
    // Do something
    this.setState({isSubmitted: true})
}

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    var cov = require( 'compute-covariance' );
    var ss = require('simple-statistics');
    var qp = require('quadprog');
    this.setState({stocks1: []});
    this.setState({realData: []});
    this.setState({candle: []});
var self = this;
    var stock1 = this.state.value;

    var stock = stock1.split(',');
    
    event.preventDefault();
var i;
//stock.push("%5EGSPC");
var price;
var arr2;
var arr;
var sp500;
async function async(){
for(i =0;i<stock.length;i++){
var tp = stock[i].trim().toUpperCase();
  
async function async1(){
  let arr1 = await self.historicalPrices(5, 7, 2000, tp, '1d')
   return arr1;
}

 arr2= await async1();
}
}
arr = async();
// async function asyncSP500(){
//   var tp = stock[i].trim().toUpperCase();
    
//   async function async(){
//     let arr1 = await self.historicalPrices(5, 7, 2000, "%5EGSPC", '1d')
//      return arr1;
//   }
  
//    sp500= await async();
  
//   }
//   sp500 =  asyncSP500();
//this.state.logReturns
Promise.all([arr]).then((response)=>{
  if(self.state.logReturns.length != self.state.stocks1.length){return;}
  var names = [];
  var r = [];
  names.push(self.state.logReturns.map((result)=>result.name))
  r.push(self.state.logReturns.map((result)=>result.returns))

let m = self.state.logReturns.length
let min = Number.MAX_SAFE_INTEGER;
var mean_vect = [];

r.map(function(result){
result.map(function(response){
  min = Math.min(response.length,min)
  return min;})
})
let n = min
return r.map(function(result){
result.map(function(response){
  //console.log(response)
  const data = { 
    log : response.slice(response.length-min,response.length-1)
  }
  self.setState({equalLogReturns: self.state.equalLogReturns.concat(data)})})
//the covariance matrix with the multiple of 2
if(self.state.equalLogReturns.length !=m){return;}
const Dmat = [];
const dmat = [];
let mean_vect = [];
let bvec;
let sd_vect;
let dvec;
let muP;
let sdP;
let weights;
let Amat = [];


mean_vect = self.state.equalLogReturns.map((result)=>{ return ss.mean(result.log);})
sd_vect = self.state.equalLogReturns.map((result)=>{ return ss.standardDeviation(result.log);})



for(var i=0;i<m;i++){
  let trial = new Array(m);
  let trial1 = new Array(m);
  for(var j =0;j<m;j++){
    
    trial[j] = 2*ss.sampleCovariance(self.state.equalLogReturns[i].log,self.state.equalLogReturns[j].log)
  }
  var iterator = trial.values(); 
  
// Here all the elements of the array is being printed. 
for (let elements of iterator) { 
  trial1.push(elements);
}

Dmat.push(trial1.slice(m,trial1.length))
dmat.push(trial1.slice(m,trial1.length))


}
//console.log(ss.sampleCovariance(self.state.equalLogReturns[1].log,self.state.equalLogReturns[1].log));
// let halfDmat = cov(self.state.equalLogReturns.map((result)=>{ return result.log;}))

// Dmat = (halfDmat.map((result)=>{return result.map((response)=>{return response*2})}))

//risk free rate
dvec = new Array(m).fill(0);
 muP = [];
 //muP[0] = 0;
function * range ( start, end, step ) {
  let state = start;
  while ( state <= end ) {
    yield state;
    state += step;
  }
  return;
};
const generate_array = (start,end,step) => Array.from( range(start,end,step) );
 muP = generate_array(0.00005,0.0015,0.00145/300.0);
 
 sdP = generate_array(0.00005,0.0015,0.00145/300.0);
 weights = [];
for(var i=0; i<301; i++) {
    weights[i] = new Array(m);
}
 Amat = [];

for(var i=0; i<m; i++) {
  let tp = new Array(2);
  tp[0] = 1;
  tp[1] = mean_vect[i];
    Amat[i] = tp;
}

 bvec = new Array(2);;
 [Dmat, Amat,dmat].forEach(m => m.forEach(r => r.unshift(0)));
  [Dmat, dvec, Amat, bvec,dmat].forEach(v => v.unshift([]));


const forQuadProg = {
  Dmat: Dmat,
  dmat:dmat,
  Amat: Amat,
  dvec: dvec,
  bvec:bvec,
  muP: muP,
  weights: weights,
  sdP: sdP,
}

  //Dmat = dmat
  //console.log(Dmat)
 



  return forQuadProg;
})
}).then(function(response){
  self.setState({portfolioModel: self.state.portfolioModel.concat(self.markowitz(response,qp))})

//self.markowitz(response,qp);

})



}
difflog(event,arr,ticker){  
  var self = this;
  arr.then(
    function(response)
      {return response.map((result)=>Math.log(result));}
        ).then((response)=>{
          var returns =[];
          var j;
          
          for(j =1;j<response.length;j++){
            returns.push(response[j]-response[j-1])
            //returns.push()
            
          }
          const data = {
            
            name: ticker,
            returns : returns,
            


          }
          self.setState({logReturns: self.state.logReturns.concat(data)})
          
          return data;
        });
  
}


timeSeriesForecast(logReturns,){
  var timeseries = require("timeseries-analysis");
let data = [];
for(var i =0;i<logReturns.length;i++){
  let tp = new Array(2);
  tp[0] = logReturns[i].date
  tp[1] = logReturns[i].value
  data.push(tp)
}
  var t = new timeseries.main(data);
  t.sliding_regression_forecast({sample:20, degree: 5});
  console.log(t.ma().output())
  var chart_url = t.chart({main:true,points:[{color:'ff0000',point:20,serie:0}]});

//var chart_url = t.ma({period: 14}).chart({main:true});

  //console.log(chart_url)

}
markowitz(response,qp){

  for(var i=1;i<=response[0].muP.length;i++){
  
  const tp = response[0].dmat;
  response[0].Dmat = tp;
  response[0].bvec[1] =1;
  response[0].bvec[2] = response[0].muP[i-1];
  let meq = 2;
  let factorized = false;
  //console.log(i)
  let answer = qp.solveQP(response[0].Dmat.map(r => r.slice()),response[0].dvec.slice(),response[0].Amat.map(r => r.slice()),response[0].bvec.slice(),meq);
response[0].sdP[i-1] = Math.sqrt(answer.value[1]);
response[0].weights[i-1] = answer.solution.slice(1,answer.solution.length)
   //console.log(solved)
  }
  let finalsdP = response[0].sdP;
  let finalmuP = response[0].muP;
let sharpe = [];
let index1;
let index2;
let maxSharpe = 0;
let minSDP = Number.MAX_SAFE_INTEGER;
var muf = 0.02/253;
for(var j = 0;j<finalmuP.length;j++){
  sharpe[j] = (response[0].muP[j]-muf)/response[0].sdP[j]
if(sharpe[j]>maxSharpe){
  index1 = j;
  maxSharpe = sharpe[j];
}
if(response[0].sdP[j]<minSDP){
  index2 = j;
  minSDP = response[0].sdP[j];
}
}
console.log(response[0].weights[index1])
console.log(response[0].weights[index2])

    const portfolio = [{

            x: finalsdP,
            y: finalmuP,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'red'},
            name: 'Efficient Frontier'
            
  },
  {
            x: [0,0.03],
            y: [muf,muf+maxSharpe*0.03],
            type: 'scatter',
            mode: 'line',
            marker: {color: 'black'},
            name: 'Line of optimal portfolios'
            
  },
  {
            x: [response[0].sdP[index1]],
            y: [response[0].muP[index1]],
            type: 'scatter',
            mode: 'marker',
            marker: {color: 'blue', size: 12},
            name: 'Tangency portfolio'
  },
   {
            x: [response[0].sdP[index2]],
            y: [response[0].muP[index2]],
            type: 'scatter',
            mode: 'marker',
            marker: {color: 'green', size: 12},
            name: 'Minimum variance portfolio'
  }

  ]
  return portfolio;

}

  historicalPrices(startMonth, startDay, startYear, ticker, frequency) {
    var arr = [];
 var time = [];
 var close = [];
 var open = [];
 var high = [];  
 var low = [];
 var volume = [];
  var self = this;
  var request = require('request'); 
  var startDate = Math.floor(Date.UTC(startYear, startMonth, startDay, 0, 0, 0) / 1000);
  var endDate = Math.floor((new Date()).getTime() / 1000);
  

  async function async(){
    let prices;
let date;
let data1;
  await axios.get("https://finance.yahoo.com/quote/" + ticker + "/history?period1=" + startDate + "&period2=" + endDate + "&interval=" + frequency + "&filter=history&frequency=" + frequency).then(
    function(response){

     //console.log(JSON.parse(response.data.split('HistoricalPriceStore\":{\"prices\":')[1].split(",\"isPending")[0]));
      return JSON.parse(response.data.split('HistoricalPriceStore\":{\"prices\":')[1].split(",\"isPending")[0]);
       
    
  })
.catch(function(error){
  console.log("Error has occured in the GET method using axios" + error);
}).then(function(response) {
  //for the stock price plot and the candlestick plot. Data stored in the states
  console.log(ticker)
 var j;
 
  for(j=response.length-1;j>=0;j--){  
  if(response[j].adjclose !== undefined){ 

     arr.push(response[j].adjclose);
     time.push(response[j].date*1000);
     
   }
   // else{
   //  arr[j] = -1;
   // }
  }
for(j=response.length-1;j>=0;j--){  
  if(response[j].adjclose !== undefined){ 
close.push(response[j].close);
     open.push(response[j].open);
     high.push(response[j].high);
     low.push(response[j].low);
     volume.push(response[j].volume)
  }
}

  prices = arr;
  date = time;

  const data ={
    name: ticker,
    stock: prices,
    date: time

  }
  const mydata = {
            x: time,
            y: prices,
            type: 'scatter',
            mode: 'lines',
            marker: {color: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)},
            name: ticker
  }
  const candleData = {
    x: time.splice(0.99*time.length,time.length),
    type:'candlestick',
    name: ticker,
    close: close.splice(0.99*close.length,close.length),
    open: open.splice(0.99*open.length,open.length),
    high: high.splice(0.99*high.length,high.length),
    low: low.splice(0.99*low.length,low.length)

  }
  const volume1 = {
type: 'bar',
x:time,
y: volume
  }

  self.setState({stocks1: self.state.stocks1.concat(data)})
  //self.setState({stocks1: data})
  self.setState({realData: self.state.realData.concat(mydata)})
  // self.setState({time1: date})
  self.setState({candle: self.state.candle.concat(candleData)})
  self.setState({volume: self.state.candle.concat(candleData)})

  self.setState({volume: self.state.volume.concat(volume1)})

return prices;
}).then(function(response){
//making the log function in javascript

self.timeSeriesForecast(response.map((result,a)=>{
  const data = {
  date: time[a],
  value :Math.log(result)
}
return data
}));
return response.map((result)=>Math.log(result));
}).then((response)=>{

  //making the diff function in javascript
          var returns =[];
          var j;
          for(j =1;j<response.length;j++){
            returns.push(response[j]-response[j-1])
            //returns.push()
            
          }
          const data = {
            type:'scatter',
            name: ticker,
            y : returns,
            x:self.state.stocks1.date *1000

          }
          const data1 = {
            name: ticker,
            returns : returns,
            

          }
          self.setState({logReturns: self.state.logReturns.concat(data1)})
          return data1;
});
return data1;
}
let prices = async();
prices.then(function(result){return result})

return prices;

}


capmBuilder(){
  
}

  render() {
    // var i;
    // for(i=0;i<this.state.stocks.length;i++){}
    var self = this;
    // const data =[{"name":"test1"},{"name":"test2"}];
    // console.log(data)
    return (
      <form onSubmit={this.handleSubmit}>


        <label>

          Prefered Stocks:
          <input type="text" value={this.state.value} onChange={this.handleChange} /> 
          <input type="submit" value="Submit" />
        </label>



<div >
        <Plot 
        data={
self.state.realData
      }
        layout={{width: "100%", height: "100%", title: 'Stock price performance', xaxis: {type:"date"}}} 
      />

      <Plot 
        data={
self.state.candle
      }

        layout={{width: "100%", height: "100%", title: 'Candlestick graph', xaxis: {type:"date"}}} 
      />
      <div>
      <h1> What Is Modern Portfolio Theory </h1>
        <p> Modern portfolio theory is a theory on how risk-averse investors can construct portfolios 
        to optimize or maximize expected return based on a given level of market risk, emphasizing that risk 
        is an inherent part of higher reward. According to the theory, 
        its possible to construct an efficient frontier of optimal portfolios offering the maximum possible expected 
        return for a given level of risk. This theory was pioneered by Harry Markowitz in his paper Portfolio Selection, 
        published in 1952 by the Journal of Finance. He was later awarded a Nobel prize for developing the MPT. </p> 
</div>
      <Plot 
        data={
self.state.portfolioModel
      }

        layout={{width: "100%", height: "100%", title: 'Markowitz Portfolio Theory'}} 
      />
            <div>
      <h1> Time Series Analysis ARIMA </h1>
        <p> ARIMA is auto regressive integrated moving average model. This is widely used in the finance inductry to forecast security reuturns </p> 
</div>


</div>
        
      </form>
    );
  }

}
export default App;











