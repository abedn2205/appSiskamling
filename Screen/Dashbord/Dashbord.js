import React, { Component } from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView, FlatList,PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../Dashbord/Styles'
import auth from '@react-native-firebase/auth';
// import Geolocation from 'react-native-geolocation-service';
// import VIForegroundService from '@voximplant/react-native-foreground-service';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';

export default class Dashbord extends Component {
    constructor(props){
        super(props)

        this.state={
            data:[
                {id:1,  title: "Laporan", color:"#FF4500", image:"https://img.icons8.com/color/70/000000/name.png"},
                {id:7,  title: "History",    color:"#00FFFF", image:"https://img.icons8.com/dusk/70/000000/checklist.png"},
                {id:8,  title: "Maps", color:"#20B2AA", image:"https://img.icons8.com/dusk/70/000000/globe-earth.png"},
                {id:4, title: "LogOut" , color:"#FF4500", image:"https://img.icons8.com/color/70/000000/shutdown.png"} ,
            ],
            counter: 1
        }
    }

    logOut= ()=>{
        auth()
        .signOut()
        .then(() => {
            console.log('User signed out!')
            this.props.navigation.navigate("Login")
        });
    }

    componentDidMount(){

        // if (this.hasLocationPermission) {
        //     Geolocation.getCurrentPosition(
        //         (position) => {
        //           console.log(position);
        //         },
        //         (error) => {
        //           // See error code charts below.
        //           console.log(error.code, error.message);
        //         },
        //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        //     );
        //   }
       
    }

    panicButton= () =>{
        if(this.state.counter < 3){
            let dummyCounter = this.state.counter;
            this.setState({counter: dummyCounter+1})
        }else{
            //mengambil dan menampilkan data pada maps
            Geolocation.getCurrentPosition(
                info=>{
                console.log(info)
                const { coords } = info
    
                console.log( coords.latitude)
                console.log( coords.longitude)

                //mengirim data lokasi ke database firestore
                let uniqueId = Date.now()
                database()
                .ref('/maps/'+ uniqueId)
                .set({
                    email: 'uniqueId',
                    latitude: coords.latitude,
                    longitude: coords.longitude
                })
                .then(() => {
                    Alert.alert('Butuh Bantuan',`Dilaporkan dari lokasi ${coords.latitude}, ${coords.longitude}`)
                    this.setState({counter: 0})
                });

                },

                error => console.log(error),
                {
                    enableHighAccuracy: false,
                    timeout: 2000,
                    maximumAge: 3600000
                }
            )
        }
    }

    clickEventListener =(item) =>{
        Alert.alert(item.title)
        switch(item.title){
        
        case "Maps" :
        
           this.props.navigation.navigate("Maps")
        break;

        case "LogOut" :
        
          this.props.navigation.navigate("Login")
       break;
  
        
        }
    }  

    render() {
        return (
        <View style={styles.container}>
            <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={this.state.data}
          horizontal={false}
          numColumns={2}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity style={[styles.card, {backgroundColor:item.color}]} onPress={() => {this.clickEventListener(item)}}>
                  <Image style={styles.cardImage} source={{uri:item.image}}/>
                </TouchableOpacity>

                <View style={styles.cardHeader}>
                  <View style={{alignItems:"center", justifyContent:"center"}}>
                    <Text style={[styles.title, {color:item.color}]}>{item.title}</Text>
                  </View>
                </View>
              </View>
            )
          }}/>

            <View style={styles.container2}>
                <TouchableOpacity style={[styles.cardRounded, {backgroundColor:"#FF4500"}]} onPress={this.panicButton} >
               
                <Image style={styles.cardImage} source={require('../../assets/warning.png')}/>
                </TouchableOpacity>
            </View>
        </View>    
        

            // <View style={styles.container}>
            //     <KeyboardAwareScrollView
            //         style={{ flex: 1, width: '100%' }}
            //         keyboardShouldPersistTaps="always">
            //         <TouchableOpacity onPress= {this.logOut} style={styles.button}>
            //         <Text style={styles.buttonTitle}>Log Out</Text>
            //     </TouchableOpacity>
            //     </KeyboardAwareScrollView>
            // </View>
        )
    }

    hasLocationPermission = async () => {
    
        if (Platform.OS === 'android' && Platform.Version < 23) {
          return true;
        }
    
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
    
        if (hasPermission) {
          return true;
        }
    
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
    
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }
    
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show(
            'Location permission denied by user.',
            ToastAndroid.LONG,
          );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show(
            'Location permission revoked by user.',
            ToastAndroid.LONG,
          );
        }

        return false;
    };

}
