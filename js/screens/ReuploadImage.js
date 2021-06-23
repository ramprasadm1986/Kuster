import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView, StyleSheet, Animated } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer, Body } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import { Picker } from '@react-native-community/picker';

export default class ReuploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            loading: false,
            calls: [],
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
            this.getreupload();
        });
    }

    getreupload() {
        var token = this.state.authorisation;
        this.setState({ loading: true });
        fetch(api.reuploadimage, {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + token
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 'success') {
                    this.setState({ calls: response.data, loading: false })
                } else {
                    this.setState({ loading: false });
                    alert(response.message);
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                alert("There is some problem with the server : " + error + " Please contact the administrator");
            });
    }

    UNSAFE_componentWillMount() {
        this.getuserGetails();
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <MenuHeader title="Reupload Image" navigation={this.props.navigation} />
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
                    <View style={styles.tableview}>
                        <View style={styles.tablebody}>
                            <ScrollView style={{ height: screenHeight }}>
                                {this.state.calls.map((row, index) => (
                                    <View style={[styles.tbody, { backgroundColor: (index % 2 == 0) ? '#efefef' : '#fff' }]} key={index}>
                                        <View>
                                            <Text style={styles.tableheadtext}>CallId : </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.tableheadtext}>Customer Name : </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.tableheadtext}>Customer Code :</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.tableheadtext}>KE No :</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.tableheadtext}>MFR NO :</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
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