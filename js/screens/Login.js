import React, { Component, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { validateEmail } from '../config/validate';
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import { CommonActions } from '@react-navigation/native';
import { Base64 } from 'js-base64';
import SplashScreen from 'react-native-splash-screen';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            icon: 'eye-slash',
            passwordi: true
        };
    }
    datesAreOnSameDay = (first,second) =>{
        
        if (first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate())
        
            return true;
        else 
            return false;
        
    }
    authenticate = () => {
        if (this.state.email == '') {
            alert('Please enter user name !');
        } else if (this.state.password == '') {
            alert('Please enter password !');
        } else {
            this.setState({ loading: true });
            const email = this.state.email;
            const password = this.state.password;
            fetch(api.user + '&username=' + email + '&password=' + password + '&imei=&V=1.9&token=ecct_XF1L8Q:APA91bHKoYhlCLAYf_PB_oVAGJkMldaNsGDRfgFo9tnu59PGhcbCBHeb_Q68-Yzvj1Tq3C4HuXr1-XzTaI5zINEPClv7NXCKb1C4L2LMUlzOQK3MIJiu0P6J9JSCPGx9j7ZwvZdilGaC&staging=true', {
                method: "GET"
            })
                .then(response => response.json())
                .then(response => {
                    if (response.status === 'success') {
                        this.setState({ loading: false });
                        alert(response.message);
                        var user = [];
                        user.push({ username: email, authorisation: response.authorisation });
                        AsyncStorage.setItem('username', email);
                        AsyncStorage.setItem('authorisation', response.authorisation);
                        AsyncStorage.setItem('lastdate', new Date()); 
                        this.props.navigation.navigate('Home');
                    } else {
                        this.setState({ loading: false });
                        alert("Login Failed. Please check your credentials");
                    }
                })
                .catch(error => {
                    this.setState({ loading: false });
                    alert("There is some problem with the server : " + error + " Please contact the administrator");
                });
        }
    };

    changeIcon() {
        this.setState(prevState => ({
            icon: prevState.icon === 'eye' ? 'eye-slash' : 'eye',
            passwordi: !prevState.passwordi
        }));
    }

    componentDidMount() {
        SplashScreen.hide();
        AsyncStorage.getItem("authorisation").then((value) => {
            if (value != null || value != undefined || value == "") {
                
                AsyncStorage.getItem("lastdate").then((value) => {
                    
                    if (value != null || value != undefined || value == "") {
                        
                        if(this.datesAreOnSameDay(value,new Date())){
                            
                            this.props.navigation.navigate('Drawer', { screen: 'TodayCallList' })
                        }
                        else{
                            
                            this.props.navigation.navigate('Home');
                        }
                        
                    }
                    else{
                        
                        this.props.navigation.navigate('Home');
                    }
                    
                })
                
                
                
               
                
               
            }
        })
    }


    render() {
        return (
            <Container>
               
                <MenuHeader noleft={true} title="Login" navigation={this.props.navigation} />
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
                    <Image source={require('../assets/logo.png')}></Image>
                    <Text style={{ color: '#fff' }}>Welcome Back !</Text>

                    <View style={{ marginTop: '10%' }}>
                        <Item regular style={{ width: screenWidth - 60, alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 40, marginTop: 10, }}>
                            <Icon type="Zocial" name='email' style={{ color: '#ccc' }} />
                            <Input style={{ fontSize: 16, color: '#333' }} placeholder='UserName' placeholderTextColor='#b3b3b3' autoCorrect={false} onChangeText={(email) => this.setState({ email: email })} keyboardType={"email-address"} autoCapitalize="none" />
                        </Item>

                        <Item regular style={{ width: screenWidth - 60, alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 40, marginTop: 10, }}>
                            <Icon type="FontAwesome" name='lock' style={{ color: '#ccc' }} />
                            <Input style={{ fontSize: 16, color: '#333' }} placeholder='Password' onChangeText={(password) => this.setState({ password: password })} placeholderTextColor='#b3b3b3' autoCapitalize="none" secureTextEntry={this.state.passwordi} />
                            <Icon type="FontAwesome" name={this.state.icon} onPress={() => this.changeIcon()} style={{ color: '#ccc' }} />

                        </Item>
                    </View>

                    <TouchableOpacity onPress={() => this.authenticate()} style={{
                        backgroundColor: '#3f51b5', width: screenWidth - 60, height: 45, alignItems: 'center', justifyContent: 'center',
                        borderRadius: 20, marginBottom: 20, marginTop: 20
                    }}>
                        <Text style={{ color: '#ffffff' }}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }
}
