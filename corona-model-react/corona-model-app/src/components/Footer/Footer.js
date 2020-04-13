import React from 'react';
// import './Business.css';

// const business = {
//     imageSrc: 'https://s3.amazonaws.com/codecademy-content/programs/react/ravenous/pizza.jpg',
//     name: 'MarginOtto Pizzeria',
//     address: '1010 Paddington Way',
//     city: 'Flavortown',
//     state: 'NY',
//     zipCode: '10101',
//     category: 'Italian',
//     rating: 4.5,
//     reviewCount: 90
// };

class Footer extends React.Component {
    render() {
        return (
            
                <footer className="uk-text-small">
                    <a href="https://spline.design/coronavirus3d/" target="_blank">Used Model from project Made by @alelepd that was
                    Rendered in Spline with ThreeJS. Show that project some 💜</a>
                </footer>
        )
    }
};

export default Footer;