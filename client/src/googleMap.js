import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import CurrentLocation from './CurrentLocation';
const credentials = require("./googleMapsApi");

import './googleMap.css';

const mapStyles = {
    width: '100%',
    height: '800px',
    position: "relative",
};

export class MapContainer extends Component {
    state = { userLocation: { lat: 32, lng: 32 }, loading: true };

    componentDidMount(props) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                this.setState({
                    userLocation: { lat: latitude, lng: longitude },
                    loading: false
                });
            },
            () => {
                this.setState({ loading: false });
            }
        );
    }
    render() {
        const { loading, userLocation } = this.state;
        if (loading) {
            return null;
        }
        return (
            <div id="mapBox">
                <Map
                    google={this.props.google}
                    zoom={14}
                    style={mapStyles}
                    initialCenter={userLocation}
                >
                    <Marker
                        title={'The marker`s title will appear as a tooltip.'}
                        position={userLocation}
                    />
                </Map>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: credentials.apiKey
})(MapContainer);