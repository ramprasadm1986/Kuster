import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Container} from 'native-base';

export default class Logout extends Component {

    UNSAFE_componentWillMount(){
        AsyncStorage.multiRemove(['userDetails']);
        this.props.navigation.navigate('Login')
    }
    render() {
        return (
            <Container>  
            </Container>
        );
    }
}