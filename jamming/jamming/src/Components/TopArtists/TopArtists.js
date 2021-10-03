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
            <div id="topArtistsId" className="TopArtists" style={{ display: "none" }}>
                
                {/* <input defaultValue={"New Playlist"} onChange={this.handleNameChange} /> */}
                {/* <ArtistList items={this.props.ArtistList}
                    onRemove={this.props.onRemove}
                    isRemoval={true} /> */}
               
                {/* <button className="TopArtists-save" onClick={this.props.onMyGogginsRunningPlaylist} style={{ visibility: "hidden" }}>🏃‍♀️🏃‍♂️ GOGGINS CHALLENGE RUNNING PLAYLIST (1 SONG)</button> */}
                <button className="TopArtists-save" onClick={this.props.onTopHalloween} style={{ visibility: "hidden" }}>🎃 HALLOWEEN PLAYLIST</button>
                <button className="TopArtists-save" onClick={this.props.onTopArtistOld} style={{ visibility:"hidden" }}>50 X 2 PLAYLIST</button>
                <button className="TopArtists-save" onClick={this.props.onTopArtist} style={{ visibility: "hidden" }}>10 x 10 PLAYLIST</button>
                <button className="TopArtists-save" onClick={this.props.onMyRunningPlaylist} style={{ visibility: "hidden" }}>🏃‍♀️🏃‍♂️ SPOTTYPOTTY RUNNING PLAYLIST</button>
                <button className="TopArtists-save" onClick={this.props.onTopChristmas} style={{ visibility: "hidden" }}>🎅 CHRISTMAS PLAYLIST</button>
                
                
            </div>
        )
    }
}

export default TopArtists;