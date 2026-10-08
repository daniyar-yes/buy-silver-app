import { useState, useEffect, useContext } from 'react';
import { PriceContext } from '../PriceContext';
import SignatureForm from '../SignatureForm/SignatureForm';

const OrderForm = (
    {
        orderCounter,
        setOrderCounter,
        coinCounter,
        setCoinCounter,
        addressHistory,
        setAddressPayload,
        setBudget,
        budget,
        isDataReady,
        isError
    }) => {

    const [counter, setCounter] = useState(0);
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState(null);
    const [finalFormData, setFinalFormData] = useState({});
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [isSignatureComplete, setIsSignatureComplete] = useState(false);
    const [shouldShowSignatureForm, setShouldShowSignatureForm] = useState(false);

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

    }, [streetName, streetNumber, counter]);

    useEffect(() => {
        if (isOrderComplete === true) {
            setOrderCounter(c => c + 1);
            setCoinCounter(coinCounter + counter);
            setAddressPayload(
                [
                    ...addressHistory,
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

    }, [isOrderComplete])


    function additionButtonHandler() {
        setCounter(counter + 1)
    };

    function subtractionButtonHandler() {
        setCounter(counter - 1)
    };

    function submissionHandler() {
        setShouldShowSignatureForm(true)
    }


    //     function submissionHandler() {
    //     setIsOrderComplete(!isOrderComplete)
    // }
    //  { streetName: streetName, streetNumber: streetNumber, id: crypto.randomUUID() }
    const addressListItems = addressHistory.map(address => <li key={address.id}>{`${address.streetName} ${address.streetNumber}`}</li>);
    // condition ? outcome : fallback

    // Given:
    // existing logic for conditional rendering:
    // if order is complete, show success message UI
    // else show the counters, text inputs, and submit button

    // what I need to add:
    // render DrawingTool from a correct place in terms of steps on screen
    // after the user hits submit (for address), but before sending the 
    // address data to the BE, being like last verification step before
    // completing the order, and before showing the final success message

    // show the success message when the user clicks on the confirm signature button
    // from SignatureForm component
    // this requires passing down the setter as a prop


    return (
        <>
            <h4>Place your order:</h4>
            {isOrderComplete
                ?
                <div>
                    <h4>Order complete</h4>
                    <p>You have ordered {counter} pieces of silver. Delivered to {streetNumber} {streetName} in 3 business days</p>
                    <button onClick={() => {setIsOrderComplete(!isOrderComplete); setShouldShowSignatureForm(!shouldShowSignatureForm)}}>Order again</button>

                    <h6>Saved Address History:</h6>
                    <ul>{addressHistory.length && addressListItems}</ul>
                </div>
                :
                shouldShowSignatureForm
                    ?
                    <SignatureForm setIsOrderComplete={setIsOrderComplete} />
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
                    </div>
            }
            {isError && <p>Failed to load data</p>}
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