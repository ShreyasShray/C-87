import firebase from 'firebase';
import * as React from 'react';
import { Alert } from 'react-native';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';

export default class SettingScreen extends React.Component{
    constructor(){
        super();
        this.state={
            first_name:'',
            last_name:'',
            address:'',
            mobile_number:'',
            doc_id:'',
            emailId:''
        }
    }
    getUserDetails=async()=>{
        var user = firebase.auth().currentUser;
        var email = user.email;
        db.collection("users").where("email_id","==", email).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var data = doc.data();
                this.setState({
                    emailId:data.email_id,
                    first_name:data.first_name,
                    last_name:data.last_name,
                    address:data.address,
                    mobile_number:data.contact,
                    doc_id:doc.id
                })
            
            })
        })
    }
    updateUserDetails=async()=>{
        db.collection("users").doc(this.state.doc_id).update({
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            address:this.state.address,
            contact:this.state.mobile_number
        });
        Alert.alert("Profile Updated Successfully")
    }
    componentDidMount=async()=>{
        this.getUserDetails();
    }
    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="Settings"/>
                <KeyboardAvoidingView style={styles.view}>
                    <TextInput style={styles.inputBox} value={this.state.first_name} placeholder="First Name" maxLength={16} onChangeText={(text)=>{this.setState({first_name:text})}}></TextInput>
                    <TextInput style={styles.inputBox} value={this.state.last_name} placeholder="Last Name" maxLength={16} onChangeText={(text)=>{this.setState({last_name:text})}}></TextInput>
                    <TextInput style={styles.inputBox} value={this.state.address} placeholder="Address" maxLength={16} onChangeText={(text)=>{this.setState({address:text})}}></TextInput>
                    <TextInput style={styles.inputBox} value={this.state.mobile_number} placeholder="Mobile Number" maxLength={10} keyboardType="numeric" onChangeText={(text)=>{this.setState({mobile_number:text})}}></TextInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.updateUserDetails()}}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#f8be85'
    },
    inputBox:{
        width:280,
        paddingLeft:5,
        borderWidth:1.4,
        borderRadius:6,
        marginTop:30
    },
    buttonStyle:{
        width:140,
        textAlign:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#ff9800",
        marginTop:30,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:8
        },
        shadowOpacity: 0.44,
        shadowRadius:10.32,
    },
    buttonText:{
        color:'white',
        fontSize:18
    }
})