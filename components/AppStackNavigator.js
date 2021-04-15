import * as React from 'react';
import {createStackNavigator} from 'react-navigation-stack'
import ReceiverDetails from '../screens/ReceiverDetails';
import BookDonateScreen from '../screens/BookDonateScreen';

export const AppStackNavigator = createStackNavigator({
    BookDonateList:{screen:BookDonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    ReceiverDetails:{screen:ReceiverDetails}
},
{
    initialRouteName:"BookDonateList"
});