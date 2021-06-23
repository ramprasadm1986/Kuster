import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView, StyleSheet, Animated } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer, Body } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import { Picker } from '@react-native-community/picker';

const bucketList = ['Bucket'];
const cityList = ['City'];
const bankList = ['Bank'];
const catList = ['Category'];
export default class Invoices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            loading: false,
            calls: [],
            calls_data: [],
            authorisation: '',
            animation: new Animated.Value(0),
            bucket: 'Bucket',
            category: 'Catgeory',
            city: 'City',
            bank: 'Bank',
            bucketList: [],
            cityList: [],
            bankList: [],
            catList: []
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
            this.getinvoices();
        });
    }

    getinvoices() {
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
        this.setState({ bucketList: bucketList });
        this.setState({ cityList: cityList });
        this.setState({ bankList: bankList });
        this.setState({ catList: catList });
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

    filteritem() {
        const newData = this.state.calls_data.filter((mydata) => {
            const bucket = (this.state.bucket == 'Bucket') ? '' : this.state.bucket.toUpperCase();
            const city = (this.state.city == 'City') ? '' : this.state.city.toUpperCase();
            const bank = (this.state.bank == 'Bank') ? '' : this.state.bank.toUpperCase();
            const category = (this.state.category == 'MFR') ? '' : this.state.category.toUpperCase();

            const result = mydata;
            if (bucket != '') {
                if (mydata.bucket.toUpperCase().indexOf(bucket) < 0) {
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
            if (category != '') {
                if (result.category.toUpperCase().indexOf(category) < 0) {
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

    UNSAFE_componentWillMount() {
        this.getuserGetails();
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
                <MenuHeader  title="Invoices" navigation={this.props.navigation} />
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
                    <View style={styles.tableview}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.tablehead}>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Invoice Number</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Invoice Date</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Customer Code</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Customer Name</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Category</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>KE Serial Ni</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Mfg Serial No</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Item No</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>City</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>State</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Zonet</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Total invoice value</Text>
                                </View>
                                <View style={{ width: 150 }}>
                                    <Text style={styles.tableheadtext}>Due Balance</Text>
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
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.mfrserialno}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.itemno}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.city}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.state}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.status}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.problemtype}</Text>
                                            </View>
                                            <View style={{ width: 150 }}>
                                                <Text style={styles.tableheadtext}>{row.ageing_days}</Text>
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
                    <Icon type="FontAwesome" name='filter' style={{ color: '#fff', width: 20 }} />
                </TouchableOpacity>

                <Animated.View style={[StyleSheet.absoluteFill, backdrop]} />
                <View style={[styles.sheet]}>
                    <Animated.View style={[styles.popup, slideUp]}>
                        <View style={{ marginBottom: 10 }}>
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
                                    selectedValue={this.state.bucket}
                                    style={styles.picker}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ bucket: itemValue })
                                    }>
                                    {this.state.bucketList.map((row, index) => (
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
                                    selectedValue={this.state.category}
                                    style={styles.picker}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ category: itemValue })
                                    }>
                                    {this.state.catList.map((row, index) => (
                                        <Picker.Item label={row} value={row} key={index} />
                                    ))}
                                </Picker>
                            </View>
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
            </Container>
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