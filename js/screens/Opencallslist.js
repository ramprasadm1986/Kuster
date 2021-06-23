import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView, StyleSheet, Animated } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer, Body, className } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import { Picker } from '@react-native-community/picker';
import Modal from "react-native-modal";

const problemList = ['Problem Type'];
const cityList = ['City'];
const bankList = ['Bank'];
const keSerialList = ['Ke Seriel No'];
export default class Opencallslist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            loading: false,
            calls: [],
            calls_data: [],
            authorisation: '',
            animation: new Animated.Value(0),
            problemtype: 'Problem Type',
            city: 'City',
            bank: 'Bank',
            keserial: 'Ke Seriel No',
            callID: '',
            problemList: [],
            cityList: [],
            bankList: [],
            keSerialList: []
        };
        this.props.navigation.addListener('focus', () => {
            this.getuserGetails();
        });
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
            this.getopencalls();
        })
    }

    getopencalls() {
        var token = this.state.authorisation;
        this.setState({ loading: true });
        fetch(api.opencall, {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + token
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 'success') {
                    this.setState({ calls_data: response.data, calls: response.data, loading: false });
                    response.data.map((row) => {
                        if (problemList.indexOf(row.problemtype) < 0) {
                            problemList.push(row.problemtype);
                        }
                        if (cityList.indexOf(row.city) < 0) {
                            cityList.push(row.city);
                        }
                        if (bankList.indexOf(row.customer) < 0) {
                            bankList.push(row.customer);
                        }
                        if (keSerialList.indexOf(row.keserialno) < 0) {
                            keSerialList.push(row.keserialno);
                        }
                    });
                    this.setState({ problemList: problemList });
                    this.setState({ cityList: cityList });
                    this.setState({ bankList: bankList });
                    this.setState({ keSerialList: keSerialList });

                } else {
                    this.setState({ loading: false });
                    alert("There is some error, please try again");
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                alert("There is some problem with the server : " + error + " Please contact the administrator");
            });
    }


    handleOpen = () => {
        Animated.timing(this.state.animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    handleClose = () => {
        Animated.timing(this.state.animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    filteritem = () => {
        const newData = this.state.calls_data.filter((mydata) => {
            const problemtype = (this.state.problemtype == 'Problem Type') ? '' : this.state.problemtype.toUpperCase();
            const city = (this.state.city == 'City') ? '' : this.state.city.toUpperCase();
            const bank = (this.state.bank == 'Bank') ? '' : this.state.bank.toUpperCase();
            const keserial = (this.state.keserial == 'Ke Seriel No') ? '' : this.state.keserial.toUpperCase();
            const callid = this.state.callID.toUpperCase();
            const result = mydata;
            if (problemtype != '') {
                if (mydata.problemtype.toUpperCase().indexOf(problemtype) < 0) {
                    return false;
                }
            }
            if (city != '') {
                if (result.city.toUpperCase().indexOf(city) < 0) {
                    return false;
                }
            }
            if (bank != '') {
                if (result.customer.toUpperCase().indexOf(bank) < 0) {
                    return false;
                }
            }
            if (keserial != '') {
                if (result.keserialno.toUpperCase().indexOf(keserial) < 0) {
                    return false;
                }
            }
            if (callid != '') {
                if (result.callid.toUpperCase().indexOf(callid) < 0) {
                    return false;
                }
            }


            return true;
        });
        this.setState({
            calls: newData
        });
        this.handleClose();
    }

    calldetail = (callid) => {
        AsyncStorage.setItem('callid', callid);
        this.props.navigation.navigate('Drawer', { screen: 'OpencallUpdate',callid:callid });
    }


    UNSAFE_componentWillMount() {
        //this.getuserGetails();
    }

    render() {
        const slideUp = {
            transform: [
                {
                    translateY: this.state.animation.interpolate({
                        inputRange: [0.01, 1],
                        outputRange: [0, -1 * screenHeight],
                        extrapolate: "clamp",
                    }),
                },
            ],
        };
        const backdrop = {
            transform: [
                {
                    translateY: this.state.animation.interpolate({
                        inputRange: [0, 0.01],
                        outputRange: [screenHeight, 0],
                        extrapolate: "clamp",
                    }),
                },
            ],
            opacity: this.state.animation.interpolate({
                inputRange: [0.01, 0.5],
                outputRange: [0, 1],
                extrapolate: "clamp",
            }),
        };
        return (
            <Container style={{ flex: 1 }}>
                
                <MenuHeader title="Open Calls" navigation={this.props.navigation} />
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
                    <View style={styles.tableview}>
                        
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        
                                    <View style={styles.tablebody}>
                                        <ScrollView style={{ height: screenHeight - 50 }}>
                                            <View style={styles.tablehead}>
                                        <View style={{ width: 80 }}>
                                            <Text style={styles.tableheadtext}>Call ID</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Customer Code</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Customer Name</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Ke Serial No</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Mfr Serial No</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Item No</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>City</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>State</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Call Created Date</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Status</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Problem Type</Text>
                                        </View>
                                        <View style={{ width: 170 }}>
                                            <Text style={styles.tableheadtext}>Call Ageing Days</Text>
                                        </View>
                                    </View>
                                
                                    {this.state.calls.map((row, index) => (
                                        <TouchableOpacity onPress={() => this.calldetail(row.callid)} key={index} >
                                        <View style={[styles.tbody, { backgroundColor: (index % 2 == 0) ? '#efefef' : '#fff' }]} >
                                            
                                                <View style={{ width: 80 }}>
                                                    <Text style={[styles.tableheadtext, { color: '#0f7fa0' }]}>{row.callid}</Text>
                                                </View>
                                           
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.customercode}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.customer}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.keserialno}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.mfrserialno}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.itemno}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.city}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.state}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.createdon}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.status}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.problemtype}</Text>
                                            </View>
                                            <View style={{ width: 170 }}>
                                                <Text style={styles.tableheadtext}>{row.ageing_days}</Text>
                                            </View>

                                        </View>
                                        </TouchableOpacity>
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
                    <Icon type="FontAwesome" name='filter' style={{ color: '#fff', width: 20 }} />
                </TouchableOpacity>

                <Animated.View style={[StyleSheet.absoluteFill, backdrop]} />
                <View style={[styles.sheet]}>
                    <Animated.View style={[styles.popup, slideUp]}>
                        <View style={{ marginBottom: 10 }}>
                            <View style={{ backgroundColor: '#f2f2f2', marginTop: '3%' }}>
                                <Picker
                                    selectedValue={this.state.problemtype}
                                    style={styles.picker}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ problemtype: itemValue })
                                    }>
                                    {this.state.problemList.map((row, index) => (
                                        <Picker.Item label={row} value={row} key={index} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ backgroundColor: '#f2f2f2', marginTop: '3%' }}>
                                <Picker
                                    selectedValue={this.state.city}
                                    style={styles.picker}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ city: itemValue })
                                    }>
                                    {this.state.cityList.map((row, index) => (
                                        <Picker.Item label={row} value={row} key={index} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ backgroundColor: '#f2f2f2', marginTop: '3%' }}>
                                <Picker
                                    selectedValue={this.state.bank}
                                    style={styles.picker}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ bank: itemValue })
                                    }>
                                    {this.state.bankList.map((row, index) => (
                                        <Picker.Item label={row} value={row} key={index} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ backgroundColor: '#f2f2f2', marginTop: '3%' }}>
                                <Picker
                                    selectedValue={this.state.keserial}
                                    style={styles.picker}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ keserial: itemValue })
                                    }>
                                    {this.state.keSerialList.map((row, index) => (
                                        <Picker.Item label={row} value={row} key={index} />
                                    ))}
                                </Picker>
                            </View>

                            <Item regular style={{ backgroundColor: '#f2f2f2', marginTop: '3%' }}>
                                <Input style={styles.picker} placeholder='Call Id' placeholderTextColor='#000' autoCorrect={false} autoCapitalize="none" onChangeText={(item) => this.setState({ callID: item })} />
                            </Item>
                        </View>
                        <TouchableOpacity style={{
                            backgroundColor: '#f2f2f2', width: screenWidth - 200, height: 45, alignItems: 'center', justifyContent: 'center',
                            borderRadius: 20, marginBottom: 20, marginTop: 20
                        }} onPress={this.filteritem}>
                            <Text>FILTER</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleClose} style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            position: 'absolute',
                            bottom: 20,
                            right: 10,
                            height: 40,
                        }}>
                            <Icon type="FontAwesome" name='close' style={{ color: '#fff', width: 20 }} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <Modal isVisible={this.state.loading} style={{ marginTop: screenHeight / 2 }}>
                    <View style={{ flex: 1 }}>
                        <ActivityIndicator size="large" color="#ff5c33" />
                    </View>
                </Modal>
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    sheet: {
        position: "absolute",
        top: Dimensions.get("window").height,
        left: 0,
        right: 0,
        height: "100%",
        justifyContent: "flex-end",
    },
    popup: {
        backgroundColor: "#3f51b5",
        marginHorizontal: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        minHeight: 400,
        alignItems: "center",
        justifyContent: "center",
    },
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