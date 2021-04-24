import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import SideBarMenu from '../components/SideBarMenu';
import { AppTabNavigator } from '../components/AppTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ReceivedBookScreen from '../screens/ReceivedBookScreen';


export const AppDrawerNavigator = createDrawerNavigator({
    Home:{screen:AppTabNavigator},
    Settings:{screen:SettingScreen},
    MyDonations:{screen:MyDonationScreen},
    Notifications:{screen:NotificationScreen},
    ReceivedBooks:{screen:ReceivedBookScreen}
},{
    contentComponent:SideBarMenu
},{
    initialRouteName:"Home"
})