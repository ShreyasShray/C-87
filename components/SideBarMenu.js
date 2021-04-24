import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import firebase from 'firebase';
import {DrawerItems} from 'react-navigation-drawer';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import db from '../config';

export default class SideBarMenu extends React.Component{
    constructor(){
        super()
        this.state={
            image:"#",
            userId:firebase.auth().currentUser.email,
            name:'',
            doc_id:''
        }
    }

    getUserProfile=async()=>{
        db.collection("users").where("email_id", "==", this.state.userId)
        .onSnapshot((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                this.setState({
                    name : doc.data().first_name + " " + doc.data().last_name
                })
            })
        })
    }

    selectPicture=async()=>{
        const {canceled, uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4, 3],
            quality:1
        })
        if(!canceled){
            this.uploadImage(uri, this.state.userId)
            this.setState({
                image:uri
            })
        }
    }

    uploadImage=async(uri, imageName)=>{
        var response = await fetch(uri);
        var blob = await response.blob();
        var ref = firebase.storage().ref().child("user_profiles/" + imageName)
        return ref.put(blob).then((response)=>{
            this.fetchImage(imageName)
        })
    }

    fetchImage=async(imageName)=>{
        var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);
        storageRef.getDownloadURL().then((url)=>{
            this.setState({
                image:url
            })
        }).catch((error)=>{
            this.setState({
                image:"#"
            })
        })
    }

    componentDidMount=()=>{
        this.getUserProfile();
        this.fetchImage(this.state.userId)
    }

    render(){
        return(
            <View>
                <Avatar
                    rounded
                    source={{uri:this.state.image}}
                    size="medium"
                    onPress={()=>{this.selectPicture()}}
                    containerStyle={styles.imageContainer}
                    showEditButton
                />
                <Text style={{ textAlign:'center', fontSize:18, fontWeight:'bold', marginTop:2, marginBottom:20}}>{this.state.name}</Text>
                <DrawerItems
                    {...this.props}
                />
                <View>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>{
                        this.props.navigation.navigate("WelcomeScreen")
                        firebase.auth().signOut()
                        }}>
                        <Text style={styles.displayText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle:{
        backgroundColor:"#ff9800",
        alignItems:'center',
        padding:8
    },
    displayText:{
        fontSize:20,
        textAlign:'center',
        fontWeight:'bold',
    },
    imageContainer:{
        flex:1,
        width:60,
        height:60,
        marginLeft:20,
        marginTop:20,
        marginBottom:20,
        borderRadius:10
    }
})