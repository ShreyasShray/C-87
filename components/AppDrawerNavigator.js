import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import SideBarMenu from '../components/SideBarMenu';
import { AppTabNavigator } from '../components/AppTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import MyDonationScreen from '../screens/MyDonationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{screen:AppTabNavigator},
    Settings:{screen:SettingScreen},
    MyDonations:{screen:MyDonationScreen}
},{
    contentComponent:SideBarMenu
},{
    initialRouteName:"Home"
})