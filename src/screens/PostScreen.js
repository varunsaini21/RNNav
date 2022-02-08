import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FAB} from 'react-native-paper';
import NoInternetModal from '../components/NoInternetModal';

export default function PostScreen({user, navigation, isOffline}) {
  const [posts, setPosts] = useState(null);
  const getPosts = async () => {
    const querySanp = await firestore()
      .collection('usersposts')
      .doc(user.uid)
      .collection('posts')
      .orderBy('time',"desc")
      .get();
    const allposts = querySanp.docs.map(docSnap => docSnap.data());
    setPosts(allposts);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const RenderCard = ({item}) => {
    var timestamp = item.time;
    var DateandTime = new Date(timestamp.toDate()).toUTCString();
    return (
      <View style={styles.mycard}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginLeft: 0}}>
              <Text>{item.userName}</Text>
            </View>
            <View style={{marginEnd: 0}}>
              <Text>{DateandTime}</Text>
            </View>
          </View>
          <Image style={styles.img} source={{uri: item.post}} />
          <Text style={styles.text}>{item.title}</Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={{flex: 1}}>
        <FlatList
          data={posts}
          renderItem={({item}) => {
            return <RenderCard item={item} />;
          }}
          keyExtractor={item => item.time}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          color="black"
          onPress={() => navigation.navigate('UploadPostScreen')}
        />
      </View>
      {isOffline ? <NoInternetModal show={isOffline} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  mycard: {
    flexDirection: 'row',
    margin: 5,
    padding: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  img: {
    width: 400,
    height: 400,
    backgroundColor: 'grey',
    resizeMode: 'contain',
  },
});
