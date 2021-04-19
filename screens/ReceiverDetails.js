import firebase from 'firebase';
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import db from '../config';
import {Card} from 'react-native-elements';

export default class ReceiverDetails extends React.Component{
    constructor(props){
        super(props);
        this.state={
        user_id:firebase.auth().currentUser.email,
        user_name:'',
        receiver_id:this.props.navigation.getParam("details")["user_id"],
        request_id:this.props.navigation.getParam("details")["request_id"],
        book_name:this.props.navigation.getParam("details")["book_name"],
        reason_for_request:this.props.navigation.getParam("details")["reason_to_request"],
        receiver_name:'',
        receiver_contact:'',
        receiver_address:'',
        receiver_request_docid:''
        }
    }

    getReceiverDetails=async()=>{
        db.collection("users").where("email_id", "==", this.state.receiver_id)
        .get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiver_name:doc.data().first_name,
                    receiver_contact:doc.data().contact,
                    receiver_address:doc.data().address,
                })
            })
        })
        db.collection("requested_books").where("request_id", "==", this.state.request_id)
        .get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiver_request_docid:doc.data().id
                })
            })
        })
        db.collection("users").where("email_id", "==", this.state.user_id)
        .get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    user_name : doc.data().first_name + " " + doc.data().last_name
                })
            })
        })
    }

    updateBookStatus=async()=>{
        db.collection("all_donations").add({
            book_name:this.state.book_name,
            request_id:this.state.request_id,
            requested_by:this.state.receiver_name,
            donar_id:this.state.user_id,
            request_status:"Donar Intrested"
        })
    }

    addNotification=async()=>{
        var message = this.state.user_name + " has shown interest in donating the book";
        db.collection("notifications").add({
            targeted_user_id:this.state.receiver_id,
            donor_id:this.state.user_id,
            request_id:this.state.request_id,
            book_name:this.state.book_name,
            date:firebase.firestore.FieldValue.serverTimestamp(),
            notification_status:"unread",
            message:message
        })
    }

    componentDidMount=()=>{
        this.getReceiverDetails();
    }

    render(){
        return(
                <ScrollView>
                <View>
                <Card title={"Book Information"} titleStyle={{fontSize:24, fontWeight:'bold', textAlign:'center'}}>
                    <Card>
                        <Text>Name: {this.state.book_name}</Text>
                    </Card>
                    <Card>
                        <Text>Reason: {this.state.reason_for_request}</Text>
                    </Card>
                </Card>
                </View>
                <View>
                    <Card title={"Receiver Imformation"} titleStyle={{fontWeight:'bold', fontSize:24, textAlign:'center'}}>
                        <Card>
                            <Text>Name: {this.state.receiver_name}</Text>
                        </Card>
                        <Card>
                            <Text>Contact: {this.state.receiver_contact}</Text>
                        </Card>
                        <Card>
                            <Text>Address: {this.state.receiver_address}</Text>
                        </Card>
                    </Card>
                    <View style={{alignItems:'center'}}>
                        {
                            this.state.receiver_id!==this.state.user_id?(
                                <TouchableOpacity style={styles.buttonStyle} onPress={()=>{
                                    this.updateBookStatus()
                                    this.addNotification()
                                    this.props.navigation.navigate("MyDonations")
                                }}>
                                    <Text style={{fontSize:18, color:'white', textAlign:'center'}}>Donate</Text>
                                </TouchableOpacity>
                            ):(
                                undefined
                        )
                        }
                    </View>
                </View>
                </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle:{
        width:280,
        backgroundColor:"#ff5722",
        borderRadius:8,
        padding:10,
        marginTop:30
    }
})