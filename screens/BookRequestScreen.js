import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      request_id:'',
      requested_book_name:'',
      doc_id:'',
      book_status:'',
      isBookRequestActive:'',
      user_doc_id:''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  getBookRequest=async()=>{
    var bookRequest = db.collection("requested_books").where("user_id", "==", this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().book_status!== "received"){
          this.setState({
            request_id:doc.data().request_id,
            requested_book_name:doc.data().book_name,
            doc_id:doc.id,
            book_status:doc.data().book_status
          })
        }
      })
    })
  }

  getIsBookRequestActive=async()=>{
    db.collection("users").where("email_id", "==", this.state.userId)
    .onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        this.setState({
          isBookRequestActive:doc.data().isBookRequestActive,
          user_doc_id:doc.id
        })
      })
    })
  }

  addRequest =async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        book_status:"requested",
        date : firebase.firestore.FieldValue.serverTimestamp()
    })
    db.collection("users").where("email_id", "==", this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          isBookRequestActive:true
        })
      })
    })

    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }

  updateBookRequestStatus=()=>{
    db.collection("users").where("email_id", "==", this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          isBookRequestActive:false
        })
      })
    })

    db.collection("requested_books").doc(this.state.doc_id).update({
      book_status:"received"
    })
  }
    
  

  sendNotification=async()=>{
    var name, lastName;
    db.collection("users").where("email_id", "==", this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        name = doc.data().first_name;
        lastName = doc.data().last_name;
      })
    })

    db.collection("notifications").where("request_id", "==", this.state.request_id)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var donorId = doc.data().donor_id
        var bookName = doc.data().book_name
        db.collection("notifications").add({
          targeted_user_id:donorId,
          message: name + " " + lastName + " received the book " + bookName,
          notification_status:"unread",
          book_name:bookName
        })
      })
    })
  }

  receivedBook=async(bookName)=>{
    var userId = this.state.userId
    var requestId = this.state.request_id
    db.collection("received_books").add({
      user_id:userId,
      book_name:bookName,
      book_status:"received",
      request_id:requestId
    })
  }

  componentDidMount=async()=>{
    this.getBookRequest()
    await this.getIsBookRequestActive()
  }

  render(){
    if(this.state.isBookRequestActive===true){
      return(
        <View style={{alignItems:'center', flex:1, justifyContent:'center'}}>
          <Text style={{textAlign:'center', fontSize:20}}>Book Name </Text>
          <Text style={{fontSize:16}}>{this.state.requested_book_name}</Text>
          <View>
            <Text style={{fontSize:20}}>Book Status</Text>
            <Text style={{fontSize:16}}> {this.state.book_status} </Text>
          </View>
          <View style={{alignItems:'center', marginTop:30}}>
            <TouchableOpacity onPress={()=>{
              this.updateBookRequestStatus();
              this.sendNotification();
              this.receivedBook(this.state.requested_book_name);
            }} style={{backgroundColor:"#ff5722", borderRadius:20, width:300, padding:10, alignSelf:'center', shadowColor:"#000", shadowOpacity:{width:0, height:8}, elevation:16.12, shadowRadius:10.22, shadowOpacity:0.44}}>
              <Text style={{textAlign:'center', color:"white", fontSize:20}}>I Received the Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
