import firebase from 'firebase';
import * as React from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import db from '../config';;
import {ListItem, Icon} from 'react-native-elements';

export default class SwipeableFlatlist extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user_id:firebase.auth().currentUser.email,
            all_notifications:this.props.all_notifications
        }
    }

    updateMarkAsRead=()=>{
        db.collection("notifications").where("targeted_user_id", "==", this.state.user_id)
        .where("notification_status", "==", "unread")
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("notifications").doc(doc.id).update({
                    notification_status:"read"
                })
            })
        })
    }

    onSwipeValueChange=swipeData=>{
        var all_notifications = this.state.all_notifications
        const {key, value} = swipeData
        if(value < -Dimensions.get("window").width){
            const newData = [...all_notifications]
            this.updateMarkAsRead()
            newData.splice(key, 1)
            this.setState({
                all_notifications:newData
            })
        }
    }

    renderItem = data=>(
        <Animated.View>
            <ListItem
                leftElement={<Icon name="book" type="font-awesome" color="#000" ></Icon>}
                title={data.item.book_name}
                titleStyle={{color:"#000", fontWeight:"bold"}}
                subtitle={data.item.message}
                bottomDivider
            ></ListItem>
        </Animated.View>
        );

    renderHiddenItem = () => (
        <View style={styles.viewStyle}>
            <View style={styles.view2}>
                <Text style={styles.textStyle}>Mark as Read</Text>
            </View>
        </View>
    )

    render(){
        return(
            <View>
                <SwipeListView
                    disableRightSwipe
                    data={this.state.all_notifications}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    rightOpenValue={-Dimensions.get("window").width}
                    previewRowKey={0}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onSwipeValueChange={this.onSwipeValueChange}
                ></SwipeListView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyle:{
        alignItems:'center',
        backgroundColor:"#ff5722",
        flex:1,
        flexDirection:'row',
        justifyContent:"space-between",
        paddingLeft:15
    },
    view2:{
        alignItems:'center',
        bottom:0,
        justifyContent:'center',
        position:'absolute',
        top:0,
        width:100
    },
    textStyle:{
        fontSize:14,
        fontWeight:"bold",
        textAlign:'center',
        color:"#000",
        textAlign:'center'
    }
})