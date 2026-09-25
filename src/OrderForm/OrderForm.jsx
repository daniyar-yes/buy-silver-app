import { useState, useEffect, useContext } from 'react';
import { PriceContext } from '../PriceContext';

const OrderForm = (
    {
        orderCounter,
        setOrderCounter,
        coinCounter,
        setCoinCounter,
        addressHistory,
        setAddressHistory,
        setBudget,
        budget,
        isDataReady
    }) => {

    const [counter, setCounter] = useState(0);
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState(null);
    const [finalFormData, setFinalFormData] = useState({});
    const [isOrderComplete, setIsOrderComplete] = useState(false);

    const price = useContext(PriceContext).currentPrice;

    // FE state often has a problem of Dirty, In-progress changes
    // You don't need to capture every incremental step of the user's inputs
    // you only want the final, confirmed state capture
    // Dirty vs Pristine state
    // IN-progress vs. Commit

    useEffect(() => {
        setFinalFormData({
            counterValue: counter,
            streetNameValue: streetName,
            streetNumberValue: streetNumber
        })
        console.log('from streetName useEffect', JSON.stringify(finalFormData))

    }, [streetName, streetNumber, counter]);

    useEffect(() => {
        if (isOrderComplete === true) {
            setOrderCounter(c => c + 1);
            setCoinCounter(coinCounter + counter);
            setAddressHistory(prevAddressHistory => 
                                [
                                    ...prevAddressHistory,
                                    { streetName: streetName, streetNumber: streetNumber, id: crypto.randomUUID() }
                                ]
                            );
            setBudget(budget - price * counter);
            return
        }; // safeguard from resetting values when order is complete
        // resetting the values that I need to reset

        // but exclude the first render (mount)
        if (orderCounter !== 0) {
            setCounter(0);
            setStreetName('');
            setStreetNumber(null);
        }

        // setAddressHistory([{streetName: streetName, streetNumber: streetNumber}])

        console.log('Address-DEBUG', addressHistory)

        console.log('From isOrderComplete useEffect', JSON.stringify(finalFormData))

    }, [isOrderComplete])


    function additionButtonHandler() {
        setCounter(counter + 1)
    };

    console.log('re-rendered', `value of street name is ${streetName}`)


    function subtractionButtonHandler() {
        setCounter(counter - 1)
    };

    function submissionHandler() {
        setIsOrderComplete(!isOrderComplete)
    }
//  { streetName: streetName, streetNumber: streetNumber, id: crypto.randomUUID() }
    const addressListItems = addressHistory.map(address => <li key={address.id}>{`${address.streetName} ${address.streetNumber}` }</li>);
    // condition ? outcome : fallback
    return (
        <>
            <h4>Place your order:</h4>
            {isOrderComplete
                ?
                <div>
                    <h4>Order complete</h4>
                    <p>You have ordered {counter} pieces of silver. Delivered to {streetNumber} {streetName} in 3 business days</p>
                    <button onClick={() => setIsOrderComplete(!isOrderComplete)}>Order again</button>

                    <h6>Saved Address History:</h6>
                    <ul>{addressHistory.length && addressListItems}</ul>
                </div>
                :
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100px' }}>
                        {/* placeholder counter */}
                        <div style={{ margin: 'auto' }}>{counter}</div>
                        <button disabled={!isDataReady} onClick={additionButtonHandler}>Buy silver coin</button>
                        <button disabled={!isDataReady} onClick={subtractionButtonHandler}>Sell silver coin</button>
                    </div>
                    <h3>Delivery address:</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100px' }}>
                        <div style={{ margin: 'auto' }}>{streetNumber}</div>
                        <div style={{ margin: 'auto' }}>{streetName}</div>
                        <input disabled={!isDataReady} type="text" id='street-name' onChange={(e) => setStreetName(e.target.value)}></input>
                        <input disabled={!isDataReady} type="number" id='street-number' onChange={(e) => setStreetNumber(e.target.value)}></input>
                    </div>
                    <button onClick={submissionHandler} disabled={!isDataReady}>Submit</button>
                </div>}

        </>
    )
}

export default OrderForm;




// React component lifecycle
// mounting (initial call / showing / of your component)
// lives - some user Inputs, handler run, other side effects
// re-renders (this one is part of 'lives' stage)
// components are re-rendered by React as a response
// to certain triggers / events
// re-render is a synonim to re-paint on screen, but not exactly
// repaint - only visual changes
// re-render - all the computations / function re-run
// not all computations insde your component
// are meant to be visual