import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { PriceContext } from "../PriceContext";
import { useContext } from "react";

const AccountSummary = ({ orderCounter, coinCounter, budget, isLoading, isError }) => {

    const currentPrice = useContext(PriceContext).currentPrice;

    return (
        <div data-testid="account-summary" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '24px' }}>
            <div data-testid="total-orders">Total orders: {orderCounter}</div>
            <div data-testid="coin-counter">🪙 {coinCounter}</div>
            <div data-testid="budget">💲 {budget}</div>


            {isError
                ?
                'Failed to load data'
                :
                isLoading ? <LoadingSpinner /> : <div data-testid="current-price">Current price: ${currentPrice}</div>
            }
        </div>
    )
}

export default AccountSummary