import * as React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text
} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
import {ListItem} from 'react-native-elements';

export default class ReceivedBookScreen extends React.Component{
    constructor(){
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            receivedBookList:[]
        }
    }

    getAllReceivedBooks=async()=>{
        db.collection("received_books").where("user_id", "==", this.state.userId)
        .onSnapshot((snapshot)=>{
            snapshot.docs.map((doc)=>{
                var booksList = []
                booksList.push(doc.data())
                this.setState({
                    receivedBookList:booksList
                })
                console.log(this.state.receivedBookList)
            })
        })
    }

    componentDidMount=()=>{
        this.getAllReceivedBooks()
    }

    keyExtractor=(item, index)=>index.toString()

    renderItem=({item, index})=>{
        return(
            <ListItem
                key={index}
                title={item.book_name}
                titleStyle={{fontWeight:'bold', textAlign:'center', color:'#000'}}
                subtitle={item.book_status}
                bottomDivider
            ></ListItem>
        )
    }

    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="My Received Books" navigation={this.props.navigation} />
                <View>
                    {
                        this.state.receivedBookList.length===0?(
                            <View>
                                <Text>No Books Received</Text>
                            </View>
                        ):(
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.receivedBookList}
                                renderItem={this.renderItem}
                            ></FlatList>
                        )
                    }
                </View>
            </View>
        );
    }
}