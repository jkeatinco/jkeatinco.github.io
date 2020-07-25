import React from 'react';

import './ArtistList.css';

import Artist from '../Artist/Artist';

class ArtistList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
           
            items: [],
          
        };
    }

    render() {
        return (
            <div className="ArtistList">
                {
                    this.props.items.map(item => {
                        return <Artist item={item} key={item.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove}isRemoval={this.props.isRemoval} />
                    })
                }
            </div>
        )
    }
}

export default ArtistList;