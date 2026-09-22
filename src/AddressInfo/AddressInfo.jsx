import { useContext } from 'react'
import { PriceContext } from '../PriceContext';

const AddressInfo = ({ addressHistory }) => {
    const todaysPrice = useContext(PriceContext).currentPrice;

    const addressListItems = addressHistory.map(address => <li key={address.id}>{`${address.streetName} ${address.streetNumber}`}</li>);
    return (

        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '24px' }}>
        {todaysPrice}
            <ul>{addressHistory.length && addressListItems}</ul>
            </div>

    )
}

export default AddressInfo