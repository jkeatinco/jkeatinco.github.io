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
            <div className="Login">
                <div className="Login-information">
                    {/* <h3>{this.props.item.name}</h3>
                    <p>{this.props.item.id}</p> */}
                </div>
                <p>While on the Spotty<span className="highlight">Potty</span> 🚽, easily create a playlist on your Spotify with the top 10 most popular songs from each of your top 10 most listened to artists. That is 100 songs of pure bliss. Just don't forget the 🧻.</p>
                <button className="Login-login" onClick={this.props.onLogin} >LOGIN TO SPOTIFY</button>
                <p className="myNameDisplay">{this.props.display_name}</p>
            </div>
        )
    }
}

export default Login;