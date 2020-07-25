import React from 'react';

import './Login.css';

import LoginList from '../LoginList/LoginList';

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {

        this.props.onNameChange(event.target.value);

    }

    render() {
        return (
            <div className="Login">
                
                <p>While on the Spotty<span className="highlight">Potty</span> 🚽, easily create a playlist on your Spotify with the top 10 most popular songs from your top 10 most listened to artists. Just don't forget the 🧻.</p>
                <button className="Login-login" onClick={this.props.onTopArtist} >LOGIN TO SPOTIFY</button>
            </div>
        )
    }
}

export default Login;