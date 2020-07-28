import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import TopArtists from '../TopArtists/TopArtists';
import TopSearchResults from '../TopSearchResults/TopSearchResults';
import Login from '../Login/Login';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'Your SpottyPotty Playlist',
      playlistTracks: [],
      items:[],
      topSearchResults: [],
      display_name:'🤠 Howdy! Looks like you still need to login 😊.'
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.topArtists = this.topArtists.bind(this);
    this.login = this.login.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState( {
        playlistName: 'Your SpottyPotty Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    })
  }

  

  topArtists() {
    Spotify.topArtists().then(playlistTracks => {
      this.setState({ playlistTracks: playlistTracks});
    });
  }

  login() {
    Spotify.login().then(display_name => {
      console.log(display_name);
      this.setState({
        display_name: "🤠 Howdy " + display_name + "! You can now show your top artists' tracks by pressing the button below. After that, your playlist will be full of 100 sweet songs that you can then save to Spotify if you want 😊. Feel free to rename the playlist to your ❤️s content as well."});
    });
  }

  componentDidMount() {
    if (window.location.href.indexOf("access_token") > -1) {
      Spotify.login().then(display_name => {
        console.log(display_name);
        this.setState({
          display_name: "🤠 Howdy " + display_name + "! You can now show your top artists' tracks by pressing the button below. After that, your playlist will be full of 100 sweet songs that you can then save to Spotify if you want 😊. Feel free to rename the playlist to your ❤️s content as well."
        });
      });
    }
  }

  render() {
    return (
      <div>
        <h1>🚽 Spotty<span className="highlight">Potty</span></h1>
        <div className="App">
          <Login playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onLogin={this.login}
            display_name={this.state.display_name} />
          {/* <SearchBar onSearch={this.search}/> */}
          <TopArtists playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onTopArtist={this.topArtists}
            onSave={this.savePlaylist} />
          <div className="App-playlist">
            {/* <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack} />
            <TopSearchResults topSearchResults={this.state.topSearchResults}
              onAdd={this.addTrack} /> */}
            <Playlist playlistName = {this.state.playlistName}
                      playlistTracks = {this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>
          <div className="footerdiv"><p>🤟 from the 🚽 by <a href="https://twitter.com/jkeatin" target="_blank">@jkeatin</a></p></div>

         
          <div id="myModal" className="modal">

                    
            <div id="spottyPottySaved" className="modal-content">
              <span className="close">&times;</span>
              <h2 className="modal-text"> Your SpottyPotty Playlist was Saved! 🙌</h2><br></br>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default App;
