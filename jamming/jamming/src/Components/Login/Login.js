import React from 'react';

import './Login.css';

import LoginList from '../LoginList/LoginList';

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            display_name: this.props.display_name
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    handleNameChange(event) {

        this.props.onNameChange(event.target.value);

    }
    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        }
        else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        return (
            <div id="Login-div" className="Login">
                <div className="Login-information">
                    {/* <h3>{this.props.item.name}</h3>
                    <p>{this.props.item.id}</p> */}
                </div>
                <p id="Login-p">While on the Spotty<span className="highlight">Potty</span> 🚽, easily create a custom playlist on your Spotify with your top artists. Choose from either the NEW Goggins Running Playlist, NEW SpottyPotty Running Playlist, 10 (Top Artists) x 10 (Top Artists Tracks) Playlist, 50 (Top Artists) x 2 (Top Artists Tracks) Playlist, or the seasonal Christmas Playlist. Just don't forget the 🧻.</p>
                
                <button id="Login-Btn" className="Login-login" onClick={this.props.onLogin} >LOGIN TO SPOTIFY <i className="fas fa-sign-in-alt"></i></button>

                <p id="Login-pp" className="LoginP-Padding">P.S. I created the Goggins Running Playlist because I am going to torture myself and raise money for charity. The Goggins Challenge is a 4X4X48 Run (4 Miles every 4 hours for 48 hours) and it is kicking off March 5th @ 8pm PST. If you feel like checking out the charity I'm raising money for visit this <a href="https://www.facebook.com/donate/2812440489084919/" target="_blank">nifty 🔗 link on Facebook</a>. Thanks everyone and hope you enjoy the playlists!</p>
                <p className="myNameDisplay">{this.props.display_name}</p>
            </div>
        )
    }
}

export default Login;