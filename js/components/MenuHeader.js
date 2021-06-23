import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, ScrollView, StyleSheet, Animated } from 'react-native';
import { Container, Content, Item, Header, Input, Icon, Right, Left, Footer, Body } from 'native-base';


class MenuHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        return(

            <Header androidStatusBarColor={'#3f51b5'} style={{ backgroundColor: '#5874d1', alignItems: 'center' }}>
                    <Left style={{ flex:1}}>
                        {!this.props.noleft && 
                        <TouchableOpacity style={{width:50,height:50,justifyContent:'center'}} transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon type="FontAwesome" name='bars' style={{ color: '#fff', fontSize: 20 }} />
                        </TouchableOpacity>
                        }
                    </Left>
                    <Body style={{flex:3, alignItems:'center'}}><Text style={{ color: '#ffffff',fontSize:16,textTransform:'uppercase' }}>{this.props.title}</Text></Body>
                    <Right style={{flex:1}}>
                       
                    </Right>
            </Header>

        );

    }
}


export default MenuHeader;