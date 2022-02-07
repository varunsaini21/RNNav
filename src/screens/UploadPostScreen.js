import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import NoInternetModal from '../components/NoInternetModal';

export default function SignUpScreen({navigation, user, isOffline}) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const uploadpost = async () => {
    if (!title || !image) {
      alert('Please fill all the fields');
      return;
    }
    try {
      const uploadBy = await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(docSnap => {
          return docSnap.data();
        });
      var today = new Date();
      firestore()
        .collection('usersposts')
        .doc(uploadBy.uid)
        .collection('posts')
        .add({
          title: title,
          time: new Date(),
          userId: uploadBy.uid,
          userName: uploadBy.name,
          post: image,
        });
      navigation.goBack();
    } catch (err) {
      alert('Something went wrong');
      console.log('Error>>>', err);
    }
  };

  const pickPostAndUpload = () => {
    launchImageLibrary(
      {quality: 0.5, maxHeight: 400, maxWidth: 400},
      fileobj => {
        const uploadTask = storage()
          .ref()
          .child(`/userpost/${Date.now()}`)
          .putFile(fileobj.assets[0].uri);
        uploadTask.on(
          'state_changed',
          snapshot => {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) alert('Image Uploaded');
          },
          error => {
            alert('error uploading image');
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log('PostDownloadURL', downloadURL);
              setImage(downloadURL);
            });
          },
        );
      },
    );
  };

  return (
    <>
      <KeyboardAvoidingView behavior="height">
        <View style={styles.box1}>
          <Text style={styles.text}>Upload Post</Text>
        </View>
        <View style={styles.box2}>
          <TextInput
            label="Title"
            value={title}
            onChangeText={text => setTitle(text)}
            mode="outlined"
          />
          <Button mode="contained" onPress={() => pickPostAndUpload()}>
            Select image
          </Button>
          <Button
            mode="contained"
            disabled={image ? false : true}
            onPress={() => uploadpost()}>
            Post
          </Button>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{textAlign: 'center', fontSize: 15}}>Cancel</Text>
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
  box1: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: 'space-evenly',
    height: '75%',
  },
});
