import React, { Component } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../Registrasi/Styles'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class Registrasi extends Component {
    constructor(props){
        super(props)

        this.state ={
            name: "",
            email: "",
            password: "",
            repassword: "",
            address: ""
        }

    }
// email password sign in
    registerUser =()=>{
        console.log('Test Register')
        auth()
  .createUserWithEmailAndPassword(this.state.email, this.state.password)
  .then((response) => {
    console.log('User account created & signed in!');
    console.log("Response"+ response)

    //menambahkan data baru ke user ke firestore
    firestore()
    .collection('users')
    //doc digunakan untuk membuat email unik
    .doc(this.state.email)
    .set({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        repassword: this.state.repassword,
        address: this.state.address
        
    })
    .then(() => {
        console.log('user added!');
        this.props.navigation.navigate("Dashbord")
    })
    .catch(error =>{
        alert("Login Gagal", JSON.stringify(error))
    })


    
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  });

    }

    //pindah halaman
    goToLogin = ()=>{
        this.props.navigation.navigate('Login')
    }


    render() {
        return (
            <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../assets/ic_launcher.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText ={(name)=> this.setState({name :name})}
                    // onChangeText={(text) => setFullName(text)}
                    // value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText ={(email)=> this.setState({email :email})}
                    // onChangeText={(text) => setEmail(text)}
                    // value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText ={(password)=> this.setState({password :password})}
                    // onChangeText={(text) => setPassword(text)}
                    // value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Re Password'
                    onChangeText ={(repassword)=> this.setState({repassword :repassword})}
                    // onChangeText={(text) => setConfirmPassword(text)}
                    // value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                 <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Address'
                    onChangeText ={(address)=> this.setState({address :address})}
                    // onChangeText={(text) => setConfirmPassword(text)}
                    // value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress = {this. registerUser}
                    >
                    
                    {/* // onPress={() => onRegisterPress()}> */}
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={this.goToLogin} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
        )
    }
}
