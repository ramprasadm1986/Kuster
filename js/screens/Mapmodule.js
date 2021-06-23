import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, StyleSheet, PermissionsAndroid } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer, Body } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import MenuHeader from "../components/MenuHeader";

export default class Mapmodule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            region: {
                latitude: 20.258449,
                longitude: 85.7770765,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            }
        };
    }

    onRegionChange(lastLat, lastLong) {
        this.setState({
            region: {
                latitude: lastLat || this.state.region.latitude,
                longitude: lastLong || this.state.region.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            }
        });
        console.log(this.state.region);
    }

    componentDidMount() {
        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': 'Location Access Required',
                    'message': 'This App needs to Access your location'
                }
                )

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Permission granted");
                } else {
                    alert("Permission Denied");
                }
            } catch (err) {
                //alert("err", err);
                console.warn(err)
            }
        }
        requestLocationPermission();
        Geolocation.getCurrentPosition((position) => {
            this.onRegionChange(position.coords.latitude, position.coords.longitude);
        }, function (error) { console.log(error) });
    }

    componentDidUpdate() {
        Geolocation.clearWatch(this.watchID);
    }
    render() {
        return (
            <Container style={{ flex: 1 }}>
                
                <MenuHeader  title="Map module" navigation={this.props.navigation} />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MapView
                        style={styles.map}
                        initialRegion={this.state.region}
                        showsUserLocation={true}
                        onMapReady={this.onMapReady}
                    >
                        <MapView.Marker
                            coordinate={{
                                "latitude": this.state.region.latitude,
                                "longitude": this.state.region.longitude
                            }}
                            title={"Your Location"}
                            draggable />
                    </MapView>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%"
    }
});