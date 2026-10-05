import { useContext, useState } from 'react'
import { PriceContext } from '../PriceContext';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const AddressInfo = ({ addressHistory, isLoading, isError }) => {
    const todaysPrice = useContext(PriceContext).currentPrice;


    // In order to add a search of the list items
    // we can take the array from addressHistory prop:

    // [
    //     { streetName: 'First Street', streetNumber: 1, id: crypto.randomUUID() },
    //     { streetName: 'Second Road', streetNumber: 2, id: crypto.randomUUID() },
    //     { streetName: '3rd avenue', streetNumber: 3, id: crypto.randomUUID() },
    //     { streetName: 'Fourth forrest lane', streetNumber: 4, id: crypto.randomUUID() },
    // ]

    // and we can filter it before passing to `addressListItems`

    // i.e. first .FILTER() -> then .MAP()
    // initially, filter is empty
    // then filter is the current value of the input field

    const [searchFilter, setSearchFilter] = useState('');
    const filteredAddressHistory = addressHistory.filter(x =>
        x.streetName.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const addressListItems = filteredAddressHistory.map(address => {
        return (

                <div key={`container-${address.id}`} style={{display: 'flex', flexDirection: "row"}}>
                    <li key={address.id}>{`${address.streetName} ${address.streetNumber}`}</li>
                    {/* <button key={`btn-delete-${address.id}` onClick={() => setAddressPayload(addressPayload.filter(this address id))}}>X</button> */}
                </div>

        )
    }
    );
    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '24px' }}>

            {isError
                ?
                'Failed to load data'
                :
                isLoading ? <LoadingSpinner /> : `Today's price is:  $${todaysPrice}`
            }

            <input type="text" onChange={(e) => setSearchFilter(e.target.value)}></input>
            <ul>{!!addressHistory.length && addressListItems}</ul>
        </div>

    )
}

export default AddressInfo