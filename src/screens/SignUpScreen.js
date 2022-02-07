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
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import NoInternetModal from '../components/NoInternetModal';

export default function SignUpScreen({navigation,isOffline}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  const userSignup = async () => {
    crashlytics().log('User signed in.');
    if (!email || !password || !name || !image) {
      alert('Please fill all the fields');
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      messaging()
        .getToken()
        .then(async token => {
          firestore().collection('users').doc(result.user.uid).set({
            name: name,
            email: result.user.email,
            uid: result.user.uid,
            status: 'online',
            pic: image,
            token: token,
          });
          await Promise.all([
            crashlytics().setUserId(result.user.uid),
            crashlytics().setAttributes({
              name: name,
              email: result.user.email,
              uid: result.user.uid,
              pic: image,
              status: 'online',
              token: token,
            }),
          ]);
        });
    } catch (err) {
      alert('Something went wrong');
      console.log('Error>>>', err);
    }
  };

  const pickImageAndUpload = () => {
    launchImageLibrary(
      {quality: 0.5, maxHeight: 200, maxWidth: 200},
      fileobj => {
        const uploadTask = storage()
          .ref()
          .child(`/userprofile/${Date.now()}`)
          .putFile(fileobj.assets[0].uri);
        uploadTask.on(
          'state_changed',
          snapshot => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) alert('image uploaded');
          },
          error => {
            alert('error uploading image');
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log('ProfilePicDownloadURL', downloadURL);
              setImage(downloadURL);
            });
          },
        );
      },
    );
  };

  return (
    <>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.box1}>
          <Text style={styles.text}>Welcome to Chat App</Text>
          <Image style={styles.img} source={require('../assests/chat.png')} />
        </View>
        <View style={styles.box2}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={text => setName(text)}
            mode="outlined"
          />
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
          <Button mode="contained" onPress={() => pickImageAndUpload()}>
            Select Profile Pic
          </Button>
          <Button
            mode="contained"
            disabled={image ? false : true}
            onPress={() => userSignup()}>
            Signup
          </Button>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{textAlign: 'center'}}>Already have an account?</Text>
          </TouchableOpacity>
          {/* <Button mode="contained" onPress={() => crashlytics().crash()}>
          Crash Now
        </Button> */}
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
    height: '70%',
  },
});
