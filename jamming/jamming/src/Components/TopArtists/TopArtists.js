import React from 'react';

import './TopArtists.css';

import ArtistList from '../ArtistList/ArtistList';

class TopArtists extends React.Component {

    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {

        this.props.onNameChange(event.target.value);

    }

    render() {
        return (
            <div className="TopArtists">
                
                {/* <input defaultValue={"New Playlist"} onChange={this.handleNameChange} /> */}
                {/* <ArtistList items={this.props.ArtistList}
                    onRemove={this.props.onRemove}
                    isRemoval={true} /> */}
                <button className="TopArtists-save" onClick={this.props.onTopArtist} >SHOW YOUR TOP ARTISTS TOP SONGS</button>
            </div>
        )
    }
}

export default TopArtists;