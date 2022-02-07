import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import NoInternetModal from '../components/NoInternetModal';

export default function LogInScreen({navigation, isOffline}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userLogin = async () => {
    if (!email || !password) {
      alert('Please fill all the fields');
      return;
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      messaging()
        .getToken()
        .then(token => {
          firestore().collection('users').doc(result.user.uid).update({
            token: token,
          });
        });
    } catch (err) {
      alert('something went wrong');
      console.log('Error>>>', err);
    }
  };
  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.box1}>
          <Text style={styles.text}>Welcome to Chat App</Text>
          <Image style={styles.img} source={require('../assests/chat.png')} />
        </View>
        <View style={styles.box2}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            mode="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            mode="outlined"
            secureTextEntry
          />
          <Button mode="contained" onPress={() => userLogin()}>
            Login
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={{textAlign: 'center'}}>Dont have an account?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {isOffline ? <NoInternetModal show={isOffline} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'blue',
    margin: 10,
  },
  img: {
    width: 150,
    height: 150,
  },
  box1: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: 'space-evenly',
    height: '60%',
  },
});
