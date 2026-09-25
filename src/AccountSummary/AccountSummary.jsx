import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { PriceContext } from "../PriceContext";
import { useContext } from "react";

const AccountSummary = ({ orderCounter, coinCounter, budget, isLoading, isError }) => {

    const currentPrice = useContext(PriceContext).currentPrice;

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '24px' }}>
            <div>Total orders: {orderCounter}</div>
            <div>🪙 {coinCounter}</div>
            <div>💲 {budget}</div>


            {isError
                ?
                'Failed to load data'
                :
                isLoading ? <LoadingSpinner /> : <div>Current price: ${currentPrice}</div>
            }
        </div>
    )
}

export default AccountSummary