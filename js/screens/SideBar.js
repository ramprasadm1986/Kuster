import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
const screenHeight = Dimensions.get('window').height;

var navitems = [
  {
    name: 'Open Calls', nav: 'Opencallslist', image: <Icon type="FontAwesome" name='phone'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Map Module', nav: 'Mapmodule', image: <Icon type="FontAwesome" name='phone'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'List Of Today', nav: 'TodayCallList', image: <Icon type="FontAwesome" name='phone'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'AMCs', nav: 'AMCs', image: <Icon type="FontAwesome" name='desktop'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Invoices', nav: 'Invoices', image: <Icon type="FontAwesome" name='list-alt'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Defective', nav: 'Defective', image: <Icon type="FontAwesome" name='list-alt'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Offline', nav: 'Offline', image: <Icon type="FontAwesome" name='list-alt'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Reupload Image', nav: 'ReuploadImage', image: <Icon type="FontAwesome" name='upload'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Actual', nav: 'Actual', image: <Icon type="FontAwesome" name='list-alt'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Actual Status', nav: 'ActualStatus', image: <Icon type="FontAwesome" name='list-alt'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  },
  {
    name: 'Logout', nav: 'Logout', image: <Icon type="FontAwesome" name='sign-out'
      style={{ fontSize: 15, marginTop: 2, marginBottom: 5, color: '#333' }} />
  }

]


export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: "",
      email: "",
      name: '',
      phone: ''
    };
  }


  render() {
    return (
      <Container>
        <LinearGradient colors={['#3e52b3', '#4f61b3', '#9197b3']} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 0.7 }} style={{ alignItems: "center", flexDirection: 'row', height: 120 }} >
          <View>
            <Image source={require('../assets/pnglogo.png')} />
          </View>
        </LinearGradient>
        <ScrollView style={{ margin: 15, height: screenHeight - 200 }}>
          <View style={{ marginTop: '10%' }}>
            {navitems.map((l, i, ) => {
              return (<TouchableOpacity key={i} style={{ height: 40, marginLeft: 17 }}
                onPress={() => { if (l.nav) { this.props.navigation.navigate(l.nav) } else { alert('No result Found') } }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginRight: 50 }}>
                  {l.image}
                  <Text style={[styles.menutext]}>{l.name}</Text>
                </View></TouchableOpacity>)
            })}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  menutext: {
    fontSize: 15,
    marginLeft: 16,
    color: '#333'
  }
});