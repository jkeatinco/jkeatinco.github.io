import React from 'react';

import './Playlist.css';

import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {

    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {

        this.props.onNameChange(event.target.value);

    }

    render() {
        return (
            <div className="Playlist">
                <input defaultValue={"Your SpottyPotty Playlist"} onChange={this.handleNameChange}/>
                <div className="buttonPlaylist"><button className="Playlist-save" onClick={this.props.onSave} style={{ paddingTop: ".77rem", paddingRight: ".77rem", paddingLeft: ".77rem", paddingBottom: ".77rem", minHeight: "45px", marginBottom:"1.27rem" }}>SAVE TO SPOTIFY</button></div><br></br><br></br>
                <TrackList tracks={this.props.playlistTracks}
                            onRemove={this.props.onRemove} 
                            isRemoval={true} />
                <div className="buttonPlaylist"><button className="Playlist-save" onClick={this.props.onSave} style={{ paddingTop: ".77rem", paddingRight: ".77rem", paddingLeft: ".77rem", paddingBottom: ".77rem", minHeight: "45px", marginBottom: "1.27rem" }}>SAVE TO SPOTIFY</button></div><br></br><br></br>
            </div>
        )
    }
}

export default Playlist;