import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator,Alert } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { CommonActions } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';
import MenuHeader from "../components/MenuHeader";
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendance: 'ATTENDANCE'
        };
    }

    attendance = () => {
        console.log(this.state.attendance);
        
        if(this.state.attendance == 'ATTENDANCE'){
            Alert.alert("Kusters","Please Select Your Attendance Type",[{ text: "OK"}]);
        }        
        else if (this.state.attendance == 'Leave') {
            AsyncStorage.multiRemove(['username']);
            AsyncStorage.multiRemove(['authorisation']);
            this.props.navigation.navigate('Login');
        }
            
            
            
        else {
            AsyncStorage.setItem('attendance', this.state.attendance);
            AsyncStorage.setItem('lastdate', new Date()); 
            this.props.navigation.navigate('Opencall');
        }
    };

    render() {
        return (
            <Container>
                <MenuHeader noleft={true} title="Attendance" navigation={this.props.navigation} />
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
                    <View style={{ marginTop: '10%', backgroundColor: '#f2f2f2' }}>
                        <Picker
                            selectedValue={this.state.attendance}
                            style={{ height: 50, width: screenWidth - 60, alignItems: 'center' }}
                            mode={'dropdown'}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ attendance: itemValue })
                            }>
                            <Picker.Item label="ATTENDANCE" value="ATTENDANCE" />
                            <Picker.Item label="Leave" value="Leave" />
                            <Picker.Item label="Half day" value="Half day" />
                            <Picker.Item label="Working" value="WKG" />
                            <Picker.Item label="Regional Holiday" value="Regional Holiday" />
                        </Picker>
                    </View>

                    <TouchableOpacity onPress={() => this.attendance()} style={{
                        backgroundColor: '#3f51b5', width: screenWidth - 60, height: 45, alignItems: 'center', justifyContent: 'center',
                        borderRadius: 20, marginBottom: 20, marginTop: 20
                    }}>
                        <Text style={{ color: '#ffffff' }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }
}
