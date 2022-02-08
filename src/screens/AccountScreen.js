import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import NoInternetModal from '../components/NoInternetModal';

export default function AccountScreen({user, isOffline}) {
  const [profile, setProfile] = useState('');

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setProfile(docSnap.data());
      });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Image style={styles.img} source={{uri: profile.pic}} />
        <Text style={styles.text}>Name :- {profile.name}</Text>
        <View style={{flexDirection: 'row'}}>
          <Feather name="mail" size={30} color="white" />
          <Text style={[styles.text, {marginLeft: 10}]}>
            :- {profile.email}
          </Text>
        </View>
        <Button
          style={styles.btn}
          mode="contained"
          onPress={() => {
            firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                status: firestore.FieldValue.serverTimestamp(),
                token: '',
              })
              .then(() => {
                auth().signOut();
              });
          }}>
          Logout
        </Button>
      </View>
      {isOffline ? <NoInternetModal show={isOffline} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  img: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'grey',
    resizeMode: "contain",
  },
  text: {
    fontSize: 23,
    color: 'white',
  },
  btn: {
    borderColor: 'white',
    borderWidth: 3,
  },
});
