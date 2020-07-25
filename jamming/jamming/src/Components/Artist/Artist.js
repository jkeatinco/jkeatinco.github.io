import React from 'react';

import './Artist.css';

import ArtistList from '../ArtistList/ArtistList';

class Artist extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.item.id
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
            <div className="Artist">
                <div className="Aritst-information">
                    <h3>{this.props.item.name}</h3>
                    <p>{this.props.item.id}</p>
                </div>
                {this.renderAction()}
            </div>
        )
    }
}


export default Artist;