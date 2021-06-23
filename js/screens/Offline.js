import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView, StyleSheet, Animated } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer, Body } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import { Picker } from '@react-native-community/picker';

export default class Offline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            loading: false,
            calls: [],
            calls_data: [],
            authorisation: '',
            animation: new Animated.Value(0)
        };
    }

    getuserGetails() {
        AsyncStorage.getItem("authorisation").then((value) => {
            if (value != null || value != undefined || value == "") {
                this.setState({
                    authorisation: value
                })
            } else {
                this.props.navigation.navigate({ screen: 'Login' })
            }
            this.getoffline();
        });
    }

    getoffline() {
        var token = this.state.authorisation;
        //this.setState({ loading: true });
        // fetch(api.opencall + '?&staging=true', {
        //     method: "GET",
        //     headers: {
        //         'Authorization': 'Basic ' + token
        //     },
        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         if (response.status === 'success') {
        //             const todayCallList = [];
        //             response.data.map((data) => {
        //                 if(todayCall.indexOf(data.callid) !== -1){
        //                     todayCallList.push(data);
        //                 }
        //             });
        //             console.log(todayCallList);
        //             this.setState({ calls_data: todayCallList, calls: todayCallList, loading: false })
        //         } else {
        //             this.setState({ loading: false });
        //             alert("There is some error, please try again");
        //         }
        //     })
        //     .catch(error => {
        //         this.setState({ loading: false });
        //         alert("There is some problem with the server : " + error + " Please contact the administrator");
        //     });
    }

    UNSAFE_componentWillMount() {
        this.getuserGetails();
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                
                <MenuHeader  title="Offline" navigation={this.props.navigation} />
               
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
                    <View style={styles.tableview}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.tablehead}>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>ID</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Type</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Remark</Text>
                                </View>
                            </View>
                        </ScrollView>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.tablebody}>
                                <ScrollView style={{ height: screenHeight - 50 }}>
                                    {this.state.calls.map((row, index) => (
                                        <View style={[styles.tbody, { backgroundColor: (index % 2 == 0) ? '#efefef' : '#fff' }]} key={index}>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.customercode}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.customer}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.keserialno}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity onPress={this.handleOpen}
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.6)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        height: 50,
                        backgroundColor: '#3f51b5',
                        borderRadius: 100,
                    }}>
                    <Icon type="FontAwesome" name='refresh' style={{ color: '#fff', width: 26 }} />
                </TouchableOpacity>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        height: 40,
        width: screenWidth - 60,
        alignItems: 'center',
        color: '#000000',
    },
    tableview: {
        height: screenHeight - 100,
        width: screenWidth
    },
    tablehead: {
        flexDirection: 'row',
        height: 60,
        color: '#333',
        backgroundColor: '#bbb',
        padding: 15
    },
    tableheadtext: {
        color: '#333',
        textAlign: 'center'
    },
    tablebody: {
        flexDirection: 'row',
        color: '#333'
    },
    tbody: {
        flexDirection: 'row',
        color: '#333',
        height: 60,
        borderBottomColor: '#fff',
        borderBottomWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftColor: '#5874d1',
        borderLeftWidth: 8
    }
});