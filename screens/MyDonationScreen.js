import firebase from 'firebase';
import * as React from 'react';
import { ListItem, Icon } from 'react-native-elements';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-navigation';
import MyHeader from '../components/MyHeader';
import db from '../config';

export default class MyDonationScreen extends React.Component{
    constructor(){
        super();
        this.state={
            user_id:firebase.auth().currentUser.email,
            allDonations:[]
        },
        this.requestRef=null
    }
    getAllDonation=async()=>{
        this.requestRef = db.collection("all_donations").where("donar_id", "==", this.state.user_id)
        .onSnapshot(snapshot=>{
            var allDonations = snapshot.docs.map(document=>document.data());
            this.setState({
                allDonations:allDonations
            })
        })
    }
    keyExtractor=(item, index)=>index.toString()
    renderItem=({item, i})=>{
        <ListItem
            key={i}
            title={item.book_name}
            subtitle={"Requested By: " + item.requested_by + "\nStatus: " + item.request_status}
            leftElement={
                <Icon name="Book" type="font-awsome" color="#ffff"></Icon>
            }
            titleStyle={{textAlign:'center', fontSize:20, fontWeight:'bold'}}
            rightElement={
                <TouchableOpacity style={{width:100}}>
                    <Text style={{fontSize:16, color:'white'}}>Send Book</Text>
                </TouchableOpacity>
            }
            bottomDivider
        ></ListItem>
    }
    componentDidMount=()=>{
        this.getAllDonation()
    }
    componentWillUnmount=()=>{
        this.requestRef()
    }
    render(){
        return(
            <View>
                <MyHeader title="My Donations"></MyHeader>
                {
                    this.state.allDonations.length===0?(
                        <View>
                            <Text>All Donatins</Text>
                        </View>
                    ):(
                        <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.allDonations}
                            renderItem={this.renderItem}
                        />
                    )
                }
            </View>
        );
    }
}

//const styles = StyleSheet.create({//
    //buttonStyle:{
    //    width:100,
    //    backgroundColor:"#ff5722",
    //    textAlign:"center"
    //}
//})