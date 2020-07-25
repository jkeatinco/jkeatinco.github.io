import React from 'react';

import './LoginList.css';

import Login from '../Login/Login';

class LoginList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
           
            items: [],
          
        };
    }

    render() {
        return (
            <div className="LoginList">
                {
                    this.props.items.map(item => {
                        return <Login item={item} key={item.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove}isRemoval={this.props.isRemoval} />
                    })
                }
            </div>
        )
    }
}

export default LoginList;