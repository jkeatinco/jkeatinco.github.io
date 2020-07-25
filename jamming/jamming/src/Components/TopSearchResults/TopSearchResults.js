import React from 'react';

import './TopSearchResults.css';

import ArtistList from '../ArtistList/ArtistList';

class TopSearchResults extends React.Component {

    render() {
        return (
            <div className="TopSearchResults">
                <h2>Your Top Artists</h2>
                <ArtistList  items={this.props.topSearchResults}
                            onAdd={this.props.onAdd}
                            isRemoval={false}/>
            </div>
        )
    }
}

export default TopSearchResults;