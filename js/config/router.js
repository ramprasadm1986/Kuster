import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../screens/Login';
import Logout from '../screens/Logout';
import Home from '../screens/Home';
import Opencall from '../screens/Opencall';
import SideBar from '../screens/SideBar';
import TodayCallList from '../screens/TodayCallList';
import Opencallslist from '../screens/Opencallslist';
import OpencallUpdate from '../screens/OpencallUpdate';
import Mapmodule from '../screens/Mapmodule';
import AMCs from '../screens/AMCs';
import Invoices from '../screens/Invoices';
import Defective from '../screens/Defective';
import Offline from '../screens/Offline';
import ReuploadImage from '../screens/ReuploadImage';
import Actual from '../screens/Actual';
import ActualStatus from '../screens/ActualStatus';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Opencall" component={Opencall} />
      <Stack.Screen name="Drawer" component={MyDrawer} />
    </Stack.Navigator>
  )
}

function MyDrawer(props) {
  return (
    <Drawer.Navigator initialRouteName="TodayCallList" drawerContent={() => <SideBar {...props} />}>
      <Drawer.Screen name="TodayCallList" component={TodayCallList} />
      <Drawer.Screen name="Opencallslist" component={Opencallslist} />
      <Drawer.Screen name="OpencallUpdate" component={OpencallUpdate} />
      <Drawer.Screen name="Mapmodule" component={Mapmodule} />
      <Drawer.Screen name="AMCs" component={AMCs} />
      <Drawer.Screen name="Invoices" component={Invoices} />
      <Drawer.Screen name="Defective" component={Defective} />
      <Drawer.Screen name="Offline" component={Offline} />
      <Drawer.Screen name="ReuploadImage" component={ReuploadImage} />
      <Drawer.Screen name="Actual" component={Actual} />
      <Drawer.Screen name="ActualStatus" component={ActualStatus} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
