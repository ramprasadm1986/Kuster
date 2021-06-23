import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView, StyleSheet, Animated } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer, Body } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import { Picker } from '@react-native-community/picker';

const problemList = ['Problem Type'];
const cityList = ['City'];
const bankList = ['Bank'];
const keSerialList = ['Ke Seriel No'];
export default class TodayCallList extends Component {
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
            bucket: 'Bucket',
            city: 'City',
            bank: 'Bank',
            keserial: 'Ke Seriel No',
            callID: '',
            todayCalls: [],
            problemList: [],
            cityList: [],
            bankList: [],
            keSerialList: []
        };
    }

    getuserGetails() {
        AsyncStorage.getItem("todayscall").then((value) => {
            if (value != null || value != undefined || value == "") {
                this.setState({
                    todayCalls: value
                })
            }
        });
        AsyncStorage.getItem("authorisation").then((value) => {
            if (value != null || value != undefined || value == "") {
                this.setState({
                    authorisation: value
                })
            } else {
                this.props.navigation.navigate({ screen: 'Login' })
            }
            this.gettodaycalls();
        });
    }

    gettodaycalls() {
        const todayCall = JSON.parse(this.state.todayCalls);
        var token = this.state.authorisation;
        this.setState({ loading: true });
        fetch(api.opencall + '?&staging=true', {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + token
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.status === 'success') {
                    const todayCallList = [];
                    response.data.map((data) => {
                        if (todayCall.indexOf(data.callid) !== -1) {
                            todayCallList.push(data);

                            if (problemList.indexOf(data.problemtype) < 0) {
                                problemList.push(data.problemtype);
                            }
                            if (cityList.indexOf(data.city) < 0) {
                                cityList.push(data.city);
                            }
                            if (bankList.indexOf(data.customer) < 0) {
                                bankList.push(data.customer);
                            }
                            if (keSerialList.indexOf(data.keserialno) < 0) {
                                keSerialList.push(data.keserialno);
                            }

                            this.setState({ problemList: problemList });
                            this.setState({ cityList: cityList });
                            this.setState({ bankList: bankList });
                            this.setState({ keSerialList: keSerialList });
                        }
                    });
                    this.setState({ calls_data: todayCallList, calls: todayCallList, loading: false })
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
        this.props.navigation.navigate('Drawer', { screen: 'OpencallUpdate' });
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
                <MenuHeader title="List Of Today" navigation={this.props.navigation} />
                

                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
                    <View style={styles.tableview}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.tablebody}>
                                <ScrollView style={{ height: screenHeight - 50 }} >
                                    <View style={styles.tablehead}>
                                        <View style={{ flex: 80 }}>
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
                                            <Text style={styles.tableheadtext}>Call Created On</Text>
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
        alignItems: 'center',
        justifyContent: 'space-between',
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
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: '#5874d1',
        borderLeftWidth:8
        
    }
});