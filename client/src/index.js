import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import Header from './Header';


import * as serviceWorker from './serviceWorker';



ReactDOM.render(<Header />, document.getElementById('header'));

//ReactDOM.render(<Filters />, document.getElementById('filters'));


ReactDOM.render(<Home />, document.getElementById('root'));
//ReactDOM.render(<TableTest />, document.getElementById('tabletest'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
