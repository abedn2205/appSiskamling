import React, { Component } from 'react'
import { View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import Registrasi from './Screen/Registrasi/Registrasi';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Screen/Login/Login';
import Dashbord from './Screen/Dashbord/Dashbord';
import Maps from './Screen/Maps/Maps';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props)

    this.state={
      user: null, 
      isLoggedIn: false
    }
  }

  componentDidMount(){
    auth().onAuthStateChanged((userdata)=>{
      console.log("user"+ JSON.stringify(userdata))
      if(userdata === null){
        this.setState({isLoggedIn: false})
      }else{
        this.setState({user: userdata, isLoggedIn: true})
      }
      console.log(this.state.isLoggedIn)
      
    });

  // Cek koneksi ke db firestore
  /*
  firestore()
  .collection('users')
  .get()
  .then(querySnapshot => {
    console.log('Total users: ', querySnapshot.size);

    querySnapshot.forEach(documentSnapshot => {
      console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    });
  });
  */



  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        { this.state.isLoggedIn ?(
          <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registrasi} />
          <Stack.Screen name="Dashbord" component={Dashbord} />
          <Stack.Screen name="Maps" component={Maps} />
          </>
        ):(
          <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registration" component={Registrasi} />
          <Stack.Screen name="Dashbord" component={Dashbord} />
          <Stack.Screen name="Maps" component={Maps} />
          
          </>
        )}
          
        </Stack.Navigator>
    </NavigationContainer>
    )
  }
}

