import firebase from 'firebase';
import * as React from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {ListItem, Icon} from 'react-native-elements'
import MyHeader from '../components/MyHeader';
import db from '../config';

export default class MyDonationScreen extends React.Component{
    constructor(){
        super();
        this.state={
            donor_id:firebase.auth().currentUser.email,
            donorName:'',
            doc_id:'',
            allDonations:[],
            request_id:''
        }
        this.requestRef = null
    }

    getDonorName=async()=>{
        db.collection("users").where("email_id", "==", this.state.donor_id).get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    donorName:doc.data().first_name + " " + doc.data().last_name
                })
            })
        })
    }

    getAllDonations=async()=>{
        this.requestRef = db.collection("all_donations").where("donar_id", "==", this.state.donor_id)
        .onSnapshot(snapshot=>{
            var allDonation = snapshot.docs.map(document=>document.data())
            this.setState({
                allDonations:allDonation
            })
        })
    }
    
    sendBook=async(bookDetails)=>{
        if(bookDetails.request_status === "Book Sent"){
          var requestStatus = "Donor Interested"
          db.collection("all_donations").doc(this.state.doc_id).update({
            "request_status" : "Donor Interested"
          })
          this.sendNotification(bookDetails,requestStatus)
        }
        else{
          var requestStatus = "Book Sent"
          db.collection("all_donations").doc(this.state.doc_id).update({
            "request_status" : "Book Sent"
          })
          this.sendNotification(bookDetails,requestStatus)
        }
      }

    sendNotification=(bookDetails,requestStatus)=>{
        var requestId = bookDetails.request_id
        var donorId = bookDetails.donar_id
        db.collection("notifications")
        .where("request_id","==", requestId)
        .where("donor_id","==",donorId)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var message = ""
            if(requestStatus === "Book Sent"){
              message = this.state.donorName + " sent you book"
            }else{
               message =  this.state.donorName  + " has shown interest in donating the book"
            }
            db.collection("all_notifications").doc(doc.id).update({
              "message": message,
              "notification_status" : "unread",
              "date"                : firebase.firestore.FieldValue.serverTimestamp()
            })
          });
        })
      }

    componentDidMount=()=>{
        this.getAllDonations();
        this.getDonorName();
        db.collection("all_donations").where("donar_id", "==", this.state.donor_id)
        .get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    request_id:doc.data().request_id
                })
            })
        })
        var requestId = this.state.request_id
        var donorId = firebase.auth().currentUser.email
        db.collection("all_donations").where("request_id", "==", requestId)
        .where("donar_id", "==", donorId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    doc_id:doc.id
                })
            })
        })
    }

    componentWillUnmount=()=>{
        this.requestRef();
    }

    keyExtractor=( item, index)=>index.toString();

    renderItem=({item, i})=>{
        return(
            <ListItem
                key={i}
                title={item.book_name}
                subtitle={"Requested By: " + item.requested_by + "\nStatus: " + item.request_status}
                leftElement={
                    <Icon name="book" type="font-awsome" color="#ff3d00"></Icon>
                }
                titleStyle={{textAlign:'center', fontSize:20, fontWeight:'bold'}}
                rightElement={
                    <TouchableOpacity style={[
                        styles.button,
                        {
                          backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722"
                        }
                      ]}
                      onPress = {()=>{
                        this.sendBook(item)
                      }}>
                        <Text style={{fontSize:16, color:'white'}}>Send Book</Text>
                    </TouchableOpacity>
                }
                bottomDivider
            ></ListItem>

        );
    }
    render(){
        return(
            <View>
                <MyHeader title="My Donations"></MyHeader>
                <ScrollView>
                    {
                        this.state.allDonations.length===0?(
                            <View>
                                <Text>No Donations</Text>
                            </View>
                        ):(
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.allDonations}
                                renderItem={this.renderItem}
                            ></FlatList>
                        )
                    }
                    <Text>{this.state.doc_id}</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button:{width:100, 
        alignItems:'center',
        padding:6
    }
})