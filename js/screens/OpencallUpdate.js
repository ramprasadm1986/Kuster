import React, { Component } from 'react';
import { ScrollView,View, Text, Dimensions, TouchableOpacity, Image,FlatList, ToastAndroid, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { Container,  Content, Item, Header, Input, Icon, Right, Left, Footer, Body } from 'native-base';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from 'react-native-image-picker';
import api from "../config/api";
import MenuHeader from "../components/MenuHeader";
import Button from "../components/Button";
import Geolocation from '@react-native-community/geolocation';
import IMEI from 'react-native-imei';
import Modal from "react-native-modal";
import MediaPicker from "../components/MediaPicker/MediaPicker";

const options = {
    title: 'Select a Photo',
    takePhotoButtonTitle: 'Take a Photo',
    quality: 0.2
};

interface IProps {}

interface IState {
  image: any;
  images: any;
}

class OpencallUpdate extends React.Component<IProps, IState> {
   
    
    
    constructor(props) {
        super(props);
        this.mediaPicker=MediaPicker;
        this.state = {
            status: 'Call Status',
            servicereportnumber: '',
            remark: '',
            date: '',
            enddate: '',
            callid: '',
            lastLat: null,
            lastLong: null,
            imeiList: '',
            isDateTimePickerVisible: false,
            authorisation: '',
            image:[],
            images:[],
            image_flatview:[]
        };
       
       
        this.props.navigation.addListener('focus', () => {
            this.getuserGetails();
        });
    }
    
    renderItem = (data) => {
        const { item, index } = data;

        return (
          <TouchableOpacity onPress={() => {}}>
            <Image
              key={item.path}
              source={item}
              style={{
                margin: 16,
                width: 200,
                height: 200,
                borderRadius: 16,
                overflow: "hidden",
              }}
            />
          </TouchableOpacity>
        );
    };
   
    

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
       
        AsyncStorage.getItem("callid").then((value) => {
            if (value != null || value != undefined || value == "") {
                this.setState({
                    callid: value
                })
            } else {
                this.props.navigation.navigate({ screen: 'Login' })
            }
        });
        AsyncStorage.getItem("authorisation").then((value) => {
            if (value != null || value != undefined || value == "") {
                this.setState({
                    authorisation: value
                })
            }
        });
        Geolocation.getCurrentPosition((position) => {
            this.onRegionChange(position.coords.latitude, position.coords.longitude);
        }, function (error) { console.log(error) });

        IMEI.getImei().then(imeiList => {
            this.state.imeiList = imeiList[0];
        });

        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        this.setState({
            date: date + '-' + month + '-' + year,
            enddate: date + '-' + month + '-' + year + ' ' + hours + ':' + min + ':' + sec,
            image:[],
            images:[],
            image_flatview:[]
        });
    }

    callupdate = () => {
        var token = this.state.authorisation;
        this.setState({ loading: true });
       
        const formData = new FormData();
        formData.append('callid', this.state.callid);
        formData.append('remark', this.state.remark);
        formData.append('callstatus', this.state.status);
        formData.append('imei', this.state.imeiList);
        formData.append('geocode[]',this.state.lastLat);
        formData.append('geocode[]',this.state.lastLong);
        formData.append('in_time', this.state.date);
        formData.append('spare_part', '');
        formData.append('sp', '');
        formData.append('SRN', this.state.servicereportnumber);
        formData.append('out_time',  this.state.enddate);
       
       

        this.state.image_flatview.forEach((item, i) => {
            formData.append("images[]", {
              uri: item.uri,
              type: item.mime,
              name: item.name || `filename${i}.jpg`,
            });
          });
        
        fetch(api.opencallsdata, {
            method: "POST",
            headers: {
                'Authorization': 'Basic ' + token,
                'Accept' : 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === 'success') {
                    this.setState({ loading: false });
                    alert(response.message);
                    this.props.navigation.navigate('Drawer', { screen: 'Opencallslist' });
                } else {
                    this.setState({ loading: false });
                    alert("There is some error, please try again");
                }
            })
            .catch(error => {
                this.setState({ loading: false });
                alert("There is some problem with the server : " + error + " Please contact the administrator");
            });
    };

    onRegionChange(lastLat, lastLong) {
        this.setState({
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    handleDatePicked = (datetime) => {
        var dateval = new Date(datetime);
        var date = dateval.getDate(); //Current Date
        var month = dateval.getMonth() + 1; //Current Month
        var year = dateval.getFullYear(); //Current Year
        var hours = dateval.getHours(); //Current Hours
        var min = dateval.getMinutes(); //Current Minutes
        var sec = dateval.getSeconds(); //Current Seconds
        var datetime = date + '-' + month + '-' + year + ' ' + hours + ':' + min + ':' + sec;
        this.setState({ isDateTimePickerVisible: false });
        this.setState({ date: datetime });
    }

    hideDateTimePicker() {
        this.setState({ isDateTimePickerVisible: false });
    }

    componentDidMount() {
        
        this.requestLocationPermission();
        
    }

    UNSAFE_componentWillMount() {
       // this.getuserGetails();
    }

    componentDidUpdate() {
        Geolocation.clearWatch(this.watchID);
    }

    render() {
        const { image_flatview,image,images} = this.state;
        
       
        

        return (
            <Container style={{ flex: 1 }}>
                
                <MenuHeader title="Kuster Service Excellence" navigation={this.props.navigation} />
                <ScrollView>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Call Id - {this.state.callid}</Text>
                        <View style={{ flexDirection: 'row', marginTop: '1%' }}>
                            <Text style={{ padding: 10 }}>AMC AMOUNT : NA</Text>
                            <Text style={{ padding: 10 }}>IR AMOUNT : NA</Text>
                        </View>
                        <TouchableOpacity  style={{
                            backgroundColor: '#3f51b5', width: screenWidth - 60, height: 40, alignItems: 'center', justifyContent: 'center',
                            borderRadius: 20, marginTop: '1%'
                        }}>
                            <Text style={{ color: '#ffffff' }}>VIEW LAST FEEDBACK</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: '1%', backgroundColor: '#fff', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                            <Picker
                                selectedValue={this.state.status}
                                style={{ height: 50, width: screenWidth - 60, alignItems: 'center' }}
                                mode={'dropdown'}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ status: itemValue })
                                }>
                                <Picker.Item label="Call Status" value="Call Status" />
                                <Picker.Item label="Open" value="OP" />
                                <Picker.Item label="Spare Requested" value="SR" />
                                <Picker.Item label="Spare In Transit" value="ST" />
                                <Picker.Item label="Spare Delivered" value="SD" />
                                <Picker.Item label="Second Visit" value="SV" />
                                <Picker.Item label="Closed" value="CL" />
                            </Picker>
                        </View>
                        <Item style={{ width: screenWidth - 60, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                            <Input style={{ color: '#333' }} placeholder='Remark' placeholderTextColor='#333' autoCorrect={false} onChangeText={(remark) => this.setState({ remark: remark })} autoCapitalize="none" />
                        </Item>
                        <Item style={{ width: screenWidth - 60, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                            <Input style={{ color: '#333' }} placeholder='Service Report Number' placeholderTextColor='#333' autoCorrect={false} onChangeText={(servicereportnumber) => this.setState({ servicereportnumber: servicereportnumber })} autoCapitalize="none" />
                        </Item>
                        <View style={{ flexDirection: 'row', margin: '3%' }}>

                            <DateTimePickerModal
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                is24Hour={false}
                                mode="datetime"
                            />
                            <TouchableOpacity onPress={() => this.setState({ isDateTimePickerVisible: true })} style={{ width: '43%', marginLeft: '2%', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                                <Text style={{ padding: 10 }}>{this.state.date}</Text>
                            </TouchableOpacity>
                            <View style={{ width: '43%', marginLeft: '2%', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                                <Text style={{ padding: 10 }}>{this.state.enddate}</Text>
                            </View>
                        </View>
                       
                        <View>
                        <TouchableOpacity
                          style={{
                            height: 50,
                            width: 200,
                            top: "10%",
                            borderRadius: 16,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#3f51b5",
                            shadowRadius: 8,
                            shadowOpacity: 0.3,
                            shadowColor: "#757575",
                            shadowOffset: {
                              width: 0,
                              height: 3,
                            },
                          }}
                          onPress={() => this.mediaPicker.openModal()}
                        >
                          <Text
                            style={{
                              color: "#ffffff",
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            Open Media Picker
                          </Text>
                        </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            height: 250,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FlatList
                            horizontal
                            data={image_flatview}
                            keyExtractor={(item, index) => index}
                            renderItem={this.renderItem.bind(this)}
                          />
                        </View>
                        <MediaPicker
                          multiple
                          compressImageQuality={0.5}
                          ref={(ref) => (this.mediaPicker = ref)}
                          galleryOnPress={(images: any) => {
                            
                            this.setState({                             
                                images:[],
                                image_flatview:[]
                            });
                            this.setState({
                             
                              images: images.map((image: any) => {
                                
                                return {
                                  uri: image.path,
                                  width: image.width,
                                  height: image.height,
                                  mime: image.mime,
                                  name:image.path.split(/[\\\/]/).pop()

                                };
                              })
                            });
                            let newArray = [...this.state.image];
                            let ImageArray = [...this.state.images];
                            newArray.push(...ImageArray);
                              this.setState({                               
                                image_flatview:newArray
                              });
                            
                          }}
                          cameraOnPress={(image: any) => {
                           
                            this.setState({                             
                                image:[],
                                image_flatview:[]
                            });
                            let newArray = [];
                            
                            newArray[0]={
                                uri: image.path,
                                width: image.width,
                                height: image.height,
                                mime: image.mime,
                                name:image.path.split(/[\\\/]/).pop()}
                            
                            this.setState({                               
                                image:newArray
                              });
                              let ImageArray = [...this.state.images];
                              newArray.push(...ImageArray);
                              this.setState({
                               
                                image_flatview:newArray
                              });
                            
                          }}
                        />
                        
                        
                        
                       
                            
                    </View>
                    <View>
                    <TouchableOpacity onPress={() => this.callupdate()} style={{
                        backgroundColor: '#3f51b5', width: screenWidth - 60, height: 40, alignItems: 'center', justifyContent: 'center',
                        borderRadius: 20, marginBottom: '1%'
                    }}>
                        <Text style={{ color: '#ffffff' }}>Submit</Text>
                    </TouchableOpacity>
                    </View>
                   
                </View>
                </ScrollView>
                <Modal isVisible={this.state.loading} style={{ marginTop: screenHeight / 2 }}>
                    <View style={{ flex: 1 }}>
                        <ActivityIndicator size="large" color="#ff5c33" />
                    </View>
                </Modal>
            </Container>
        );
    }
    
}
export default OpencallUpdate;