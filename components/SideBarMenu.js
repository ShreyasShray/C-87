import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import firebase from 'firebase';
import {DrawerItems} from 'react-navigation-drawer';

export default class SideBarMenu extends React.Component{
    render(){
        return(
            <View>
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
    }
})