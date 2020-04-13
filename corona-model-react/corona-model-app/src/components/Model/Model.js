import React from 'react';
// import './SearchBar.css';

// const sortByOptions = {
//     'Best Match': 'best_match',
//     'Highest Rated': 'rating',
//     'Most Reviewed': 'review_count'

// }

class Model extends React.Component {
    // renderSortByOptions() {
    //     return Object.keys(sortByOptions).map(sortByOption => {
    //         let sortByOptionValue = sortByOptions[sortByOption];
    //         return <li key={sortByOptionValue}>{sortByOption}</li> 
    //     });
    // }

    render() {
        return (

            <div className="corona-model">
                <model-viewer style={{ margin: 'auto'}} src="coronavirus3d.glb" ios-src="coronavirus3d.usdz" ar auto-rotate camera-controls
                background-color="#70BCD1" shadow-intensity="1" alt="A 3D model of coronavirus" />
           </div>

        )
    }
}

export default Model;