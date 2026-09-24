import MainContainer from "./MainContainer";
import { StrictMode, useState, useEffect } from "react";
import { PriceContext } from "./PriceContext";
import { NavLink, Route, Routes } from "react-router";
import OrderForm from "./OrderForm/OrderForm";
import AccountSummary from "./AccountSummary/AccountSummary";
import SilverPriceChart from "./SilverPriceChart/SilverPriceChart";
import AddressInfo from "./AddressInfo/AddressInfo"
// What lives where?
// useState states:
// App - all the global states: orderCounter, coinCounter, addressHistory, budget, currentPrice
// OrderForm:     counter, streetName, streetNumber, finalFormData, isOrderComplete
// SilverPriceChart: silverData (from API fetch)
// 
// useEffects:

// OrderForm: 1: sets final address; 2: sets counters, budget, on isOrderComplete
// SilverPriceChart: 1 that sets fetchSilverData and calls it, 2 that sets the chart with chartData


// What is consumed from which component?
// App: provides PriceContext provider to own children
// MainContainer:  accepts as Props:
// orderCounter,
// coinCounter,
// setCoinCounter,
// addressHistory,
// setAddressHistory,
// budget,
// setBudget,
// setCurrentPrice


// OrderForm:
// Price via PriceContext:

//orderCounter={orderCounter}
// setOrderCounter={setOrderCounter}
// coinCounter={coinCounter}
// setCoinCounter={setCoinCounter}
// addressHistory={addressHistory}
// setAddressHistory={setAddressHistory}
// budget={budget}
// setBudget={setBudget}


// AccountSummary:
// Price via PriceContext
// orderCounter, 
// coinCounter, 
// budget


// SilverPriceChart:
//setCurrentPrice as a prop
// fetch API to external source that is then stored it its own silverData useState


// OrderHistory (AddressInfo):
// addressHistory as prop
// price (todaysPrice) => via PriceContext


// Parent-child tree
// App -> Routes -> Route -> MainContainer, OrderForm, AccountSummary, OrderHistory (AddressInfo), SilverPriceChart
// MainContainer -> OrderForm, AccountSummary, OrderHistory (AddressInfo), SilverPriceChart



// questions: 
// if we remove MainContainer as a wrapper / layout org component for 4 other components,
// then what do we show on the `/` home route?
// answer: possibly shortened form of AccountSummary and Price chart? or just a recommendation from PriceChart

// what should be on Account path then? What is the Expanded version of AccountSummary component?
// it kinda duplcate `/` home route path. For now - I'll duplicate, then maybe delete the whole
// Account URL path / route

function App() {

  const [orderCounter, setOrderCounter] = useState(0);
  const [coinCounter, setCoinCounter] = useState(0);
  const [addressHistory, setAddressHistory] = useState([]);

  const [budget, setBudget] = useState(50000);
  // a simplified case assuming we either are loading or not (not means finished succesfully)
  const [isLoading, setIsLoading] = useState(false);
  // when working with isLoading, usually it's used in collocation with
  // hasStartedLoading / isFinished loading or smth like is isInitialLoad / isFirstLoad

  const [silverData, setSilverData] = useState({
    month: '',
    dataPoints: [],
    CTAPositive: '',
    CTANegative: '',
    CTANeutral: ''
  });

  useEffect(() => {
    const fetchSilverData = async function () {
      try {
        setIsLoading(true);
        // register your bin at https://jsonbin.io and get your own bin URL and master key
        const binUrl = "https://api.jsonbin.io/v3/b/";

        const response = await fetch(binUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': ''
          }
        });

        const data = await response.json();
        setSilverData(data.record);
        setIsLoading(false);
      }
      catch (error) {
        console.error('Error fetching silver data:', error);
      }
    }
    fetchSilverData();
  }, []);


  const processedDataPoints = (Array.isArray(silverData.dataPoints) ? silverData.dataPoints : [])
    .map((point) => ({
      date: new Date(point.date),
      price: Number(point.price)
    }))
    .filter((point) => !Number.isNaN(point.date.getTime()) && Number.isFinite(point.price))
    .sort((firstPoint, secondPoint) => firstPoint.date - secondPoint.date);

  const closingPrice = processedDataPoints.at(-1)?.price;

  const contextValueObject = {
    currentPrice: closingPrice,
    processedDataPoints: processedDataPoints,
    silverData: silverData
  }


  return (
    <>
      <StrictMode>
        {isLoading ? <p>Loading...</p> : <p>Your Component here</p>}
        <PriceContext value={contextValueObject}>

          <nav style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-around' }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/order">Place Order</NavLink>
            <NavLink to="/account">Account Summary</NavLink>
            <NavLink to="/history">Order History</NavLink>
            <NavLink to="/chart">Chart</NavLink>
          </nav>

          <Routes>
            <Route path="/" element={
              <MainContainer
                orderCounter={orderCounter}
                setOrderCounter={setOrderCounter}
                coinCounter={coinCounter}
                setCoinCounter={setCoinCounter}
                addressHistory={addressHistory}
                setAddressHistory={setAddressHistory}
                budget={budget}
                setBudget={setBudget}
                isLoading={isLoading}
              />
            } />
            <Route path="/order" element={
              <OrderForm
                orderCounter={orderCounter}
                setOrderCounter={setOrderCounter}
                coinCounter={coinCounter}
                setCoinCounter={setCoinCounter}
                addressHistory={addressHistory}
                setAddressHistory={setAddressHistory}
                setBudget={setBudget}
                budget={budget}
              />
            } />
            <Route path="/account" element={
               <AccountSummary
                orderCounter={orderCounter}
                coinCounter={coinCounter}
                budget={budget}
                isLoading={isLoading}
            />
            } />
            <Route path="/history" element={
              <AddressInfo addressHistory={addressHistory} isLoading={isLoading}/>
            }/>
            <Route path="/chart" element={<SilverPriceChart isLoading={isLoading}/>} />

          </Routes>
        </PriceContext>
      </StrictMode >
    </>
  )
}

export default App





// React component: is a JavaScript function, that takes exactly one input ('{props}') and returns 
// exactly one output - one JSX element.

// after the break:

// Conditional Rendering
// reading props
// Multi-component app (have some components RENDER other components)
// styles in JSX (literal style property, external style module)

// React State (?)



//            //indexes:0      1     2   3     4   5     6     7     8   9   10
// let arr = new Array(1, 4, 9, 16);

// const itemToFind = 'asda';

// // array manipulation methods
// // push, pop, shift, unshift

// console.log('Original arr Before: ', arr)

// console.log(arr.map((item) => item ** 2))

// console.log('original arr After: ', arr)



// for (let i = 0; i < arr.length; i++) {
//   console.log(arr[i])
// }



// Array methods:

// forEach
// map
// filter

// 1 - higher level (higher voltage) 1.5 V

// if (level > threshold) then it's 1

// ~ threshold for 0 or 1, let's say:    ~1V

// if (level < threshold) then it's 0

// 0 - lower level of signal (lower voltage) 0.5 V

// signal - electric current

// hex - hexadecimal - 16 based system (hex - 6, dec - 10)
// 0123456789ABCDEF
// 0 - 0 (min)
// 16 - F (max)

// color: #RGB
// color: #RRGGBB
// color: #14760a
// color #1da147

// STATE: object that describes the current state of the UI
