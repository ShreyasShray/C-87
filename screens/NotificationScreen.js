import firebase from 'firebase';
import * as React from 'react';
import {
    View,
    Text,
    FlatList
} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import {ListItem, Icon} from 'react-native-elements';
import SwipeableFlatlist from '../components/SwipeableFlatlist';

export default class NotificationScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user_id:firebase.auth().currentUser.email,
            all_notifications:[]
        }
        this.notificationRef=null
    }

    getAllNotificcations=async()=>{
        this.notificationRef = db.collection("notifications")
        .where("notification_status", "==", "unread")
        .where("targeted_user_id", "==", this.state.user_id)
        .onSnapshot((snapshot)=>{
            var allNotification = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data()
                notification["doc_id"] = doc.id
                allNotification.push(notification)
            });
            this.setState({
                all_notifications:allNotification
            })
        })
    }

    keyExtractor=(item, index)=>index.toString();

    renderItem=({item, index})=>{
        return(
            <ListItem
                key={index}
                title={item.book_name}
                titleStyle={{color:"#000", fontWeight:'bold'}}
                leftElement={<Icon name="book" type="font-awesome" color="#000"></Icon>}
                subtitle={item.message}
                bottomDivider
            ></ListItem>
        );
    }

    componentDidMount=()=>{
        this.getAllNotificcations()
    }

    componentWillUnmount=()=>{
        this.notificationRef()
    }

    render(){
        return(
            <View>
                <MyHeader title="Notifications" navigation={this.props.navigation} />
                <View>
                    {
                        this.state.all_notifications.length===0?(
                            <View>
                                <Text>You have no Notifications</Text>
                            </View>
                        ):(
                            <SwipeableFlatlist all_notifications={this.state.all_notifications} />
                        )
                    }
                </View>
            </View>
        );
    }
}