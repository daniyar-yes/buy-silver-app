// React component: is a JavaScript function, that takes exactly one input ('{props}') and returns 
import AccountSummary from "./AccountSummary/AccountSummary";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import { PriceContext } from "./PriceContext";
import { useContext } from "react";


function MainContainer({ orderCounter, coinCounter, budget, isLoading }) {

    const priceContextObj = useContext(PriceContext);
    const silverData = priceContextObj?.silverData;
    const processedDataPoints = priceContextObj?.processedDataPoints;
    const openingPrice = priceContextObj.processedDataPoints[0]?.price;
    const closingPrice = priceContextObj?.currentPrice;


    const recommendationMessage = processedDataPoints.length === 0 || openingPrice === closingPrice
        ? silverData.CTANeutral
        : openingPrice > closingPrice
            ? silverData.CTAPositive
            : silverData.CTANegative;
    return (
        <>
            <AccountSummary
                orderCounter={orderCounter}
                coinCounter={coinCounter}
                budget={budget}
                isLoading={isLoading}
            />
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {isLoading ? <LoadingSpinner /> : <p>Advice: {recommendationMessage}</p>}
            </div>
        </>
    )
}

export default MainContainer