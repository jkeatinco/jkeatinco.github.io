import React from 'react';

import './LoginList.css';

import Login from '../Login/Login';

class LoginList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
           
            display_name: this.props.display_name,
          
        };
    }

    render() {
        return (
            <div className="LoginList">
                {
                   <Login display_name={this.props.display_name} />
                        // <Login items={display_name} key={items.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove}isRemoval={this.props.isRemoval} />
                   
                }
            </div>
        )
    }
}

export default LoginList;