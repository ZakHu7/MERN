// /client/Controller.js
import React, { Component } from 'react';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Table from './Table.js';

import './Controller.css';

//const API_PORT = process.env.PORT || 'localhost:3001';

const API = 'http://192.168.23.114:3001/api';
// const API = 'http://localhost:3001/api';

class Controller extends Component {
  // initialize our state
  state = {
    //data: [],
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };


  
  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    //alert(JSON.stringify(this.props.filters));

    axios.get(API + '/getData', {
      params: this.props.filters,
    })
      .then((res) => this.props.dataChange(res.data.data));

      //.then((res) => this.setState({ data: res.data.data }));
      //alert(JSON.stringify(res.data.data)));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (name) => {
    //let currentIds = this.state.data.map((data) => data.id);
    let currentIds = [];
    if (this.props.data != undefined) {
      currentIds = this.props.data.map((data) => data.id);
    }
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post(API + '/putData', {
      id: idToBeAdded,
      name: name,
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    //console.log(this.props.data);
    
    this.props.data.forEach((dat) => {
      //eslint-disable-next-line
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete(API + '/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.props.data.forEach((dat) => {
      //eslint-disable-next-line
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post(API + '/updateData', {
      id: objIdToUpdate,
      update: { name: updateToApply },
    });
  };

  // our put method that uses our backend api
  // to create new query into our data base
  initializeData = () => {
    let currentIds = [];
    if (this.props.data != undefined) {
      currentIds = this.props.data.map((data) => data.id);
    }
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post(API + '/initializeData', {
      id: idToBeAdded,
      name: "test",
    });
  };


  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {


    //const { data } = this.state;

    return (
      <div>
        
        {this.props.data != undefined &&
          <Table
            data={this.props.data}
            page={this.props.page}
            pageChange={this.props.pageChange}
          />
        }
        
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              this.initializeData()
            }
          >
            REFRESH DATA
          </Button>
        </div>
     
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </div>



    );
  }
}

export default Controller;