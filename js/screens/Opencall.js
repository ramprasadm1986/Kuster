import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView, StyleSheet, Animated, PermissionsAndroid } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-community/picker';
import Modal from "react-native-modal";
import Geolocation from '@react-native-community/geolocation';
import IMEI from 'react-native-imei';

const problemList = ['Problem Type'];
const cityList = ['City'];
const bankList = ['Bank'];
const keSerialList = ['Ke Seriel No'];
const bucket = ['Bucket'];

class Opencalls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            callselectvalue: [],
            email: "",
            loading: false,
            calls: [],
            calls_data: [],
            authorisation: '',
            animation: new Animated.Value(0),
            callID: '',
            problemList: [],
            cityList: [],
            bankList: [],
            keSerialList: [],
            bucketList: [],
            lastLat: null,
            lastLong: null,
            imeiList: '',
        };
        this.requestLocationPermission();
        Geolocation.getCurrentPosition((position) => {
            this.onRegionChange(position.coords.latitude, position.coords.longitude);
        }, function (error) { console.log(error) });

        IMEI.getImei().then(imeiList => {
            this.state.imeiList = imeiList[0];
        });
    }

    async requestLocationPermission() {

        try {
            
            var permissions = [
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
            ]; 

            PermissionsAndroid.requestMultiple(permissions).then(granted => {
                 Object.entries(granted).map(([key, value]) => {

                    console.log(key);
                    console.log(value);
                 });
                
            });
            

        } catch (err) {
            console.log(err)
        }
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
        });
        AsyncStorage.getItem("attendance").then((value) => {
            if (value != null || value != undefined || value == "") {
                this.setState({
                    attendance: value
                })
            }
        });
    }

    getopencalls() {
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

    callselect() {
        AsyncStorage.setItem('todayscall', JSON.stringify(this.state.callselectvalue));
        var token = this.state.authorisation;
        var dateval = new Date();
        var date = dateval.getDate(); //Current Date
        var month = dateval.getMonth() + 1; //Current Month
        var year = dateval.getFullYear(); //Current Year
        var hours = dateval.getHours(); //Current Hours
        var min = dateval.getMinutes(); //Current Minutes
        var sec = dateval.getSeconds(); //Current Seconds
        var datetime = year + '/' + month + '/' + date + ' ' + hours + ':' + min + ':' + sec;

        this.setState({ loading: true });
        const param = JSON.stringify({
            imei: this.state.imeiList,
            geocode: {
                lat: this.state.lastLat,
                lng: this.state.lastLong
            },
            status: this.state.attendance,
            attending_calls: this.state.callselectvalue,
            date_time: datetime
        });
        fetch(api.attendance, {
            method: "PUT",
            headers: {
                'Authorization': 'Basic ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: param
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === 'success') {
                    this.setState({ loading: false });
                    this.props.navigation.navigate('Drawer', { screen: 'TodayCallList' });
                } else {
                    this.setState({ loading: false });
                    alert("There is some error, please try again");
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log(error);
                alert("There is some problem with the server : " + error + " Please contact the administrator");
            });

    }

    onRegionChange(lastLat, lastLong) {
        this.setState({
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
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

    componentDidMount() {   
        
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        this.setState({
            date: date + '-' + month + '-' + year,
            enddate: date + '-' + month + '-' + year + ' ' + hours + ':' + min + ':' + sec
        });
    }


    UNSAFE_componentWillMount() {
        this.getuserGetails();
    }

    componentDidUpdate() {
        Geolocation.clearWatch(this.watchID);
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
            <Container>

                <MenuHeader noleft={true} title="Schedule Opencalls" navigation={this.props.navigation} />
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '2%' }}>
                    <ScrollView style={{ margin: 15, height: screenHeight - 200, width: '100%' }}>
                        {this.state.calls.map((row, index) => (
                            <View style={{
                                backgroundColor: '#fff', paddingLeft: 5, paddingRight: 5,
                                paddingTop: 10, paddingBottom: 10,
                                borderRadius: 10, flexDirection: "row", marginBottom: 10, minHeight: 80, marginLeft: 10, marginRight: 10,
                                alignItems: 'center', shadowColor: '#000', marginTop: 10,
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.8,
                                shadowRadius: 10,
                                elevation: 5
                            }} key={index}>

                                <View style={{ alignItems: 'flex-start' }}>
                                    <CheckBox
                                        disabled={false}
                                        onValueChange={(newValue) => this.setState(prevState => ({ callselectvalue: [...this.state.callselectvalue, row.callid] }))}
                                    />
                                </View>
                                <View style={{ marginLeft: 5, flex: 1, alignItems: 'flex-start' }} >


                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.cardtextHead}>Call ID</Text>
                                        </View>
                                        <View>
                                            <Text>:</Text>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <Text style={styles.cardtext}> {row.callid}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.cardtextHead}>Aging Days</Text>
                                        </View>
                                        <View>
                                            <Text>:</Text>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <Text style={styles.cardtext}> {row.ageing_days}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.cardtextHead}>Customer</Text>
                                        </View>
                                        <View>
                                            <Text>:</Text>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <Text style={styles.cardtext}> {row.customer}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.cardtextHead}>Problem Type</Text>
                                        </View>
                                        <View>
                                            <Text>:</Text>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <Text style={styles.cardtext}> {row.problemtype}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.cardtextHead}>City</Text>
                                        </View>
                                        <View>
                                            <Text>:</Text>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <Text style={styles.cardtext}> {row.city}</Text>
                                        </View>
                                    </View>



                                </View>



                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity onPress={() => this.callselect()} style={{
                        backgroundColor: '#3f51b5', width: screenWidth - 170, height: 45, alignItems: 'center', justifyContent: 'center',
                        borderRadius: 20, marginBottom: 20, marginTop: 20
                    }}>
                        <Text style={{ color: '#ffffff' }}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleOpen}
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.6)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            position: 'absolute',
                            bottom: 15,
                            right: 10,
                            height: 50,
                            backgroundColor: '#3f51b5',
                            borderRadius: 100,
                        }}>
                        <Icon type="FontAwesome" name='filter' style={{ color: '#fff', width: 20 }} />
                    </TouchableOpacity>

                    <Animated.View style={[StyleSheet.absoluteFill, backdrop]} />
                </View>
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
                                    selectedValue={this.state.bucket}
                                    style={styles.picker}
                                    mode={'dropdown'}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ bucket: itemValue })
                                    }>
                                    <Picker.Item label="Bucket" value="Bucket" />
                                    <Picker.Item label="730+" value="730+" />
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
    cardtext: {

        flexWrap: 'wrap',
        fontSize: 15,


    },
    cardtextHead: {

        flexWrap: 'wrap',
        fontWeight: 'bold',
        color: '#6e6e6e'
    }
});

export default Opencalls