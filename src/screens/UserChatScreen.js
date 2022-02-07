import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
// import config from '../config';
import Config from 'react-native-config';
import NoInternetModal from '../components/NoInternetModal';

export default function UserChatScreen({user, route, isOffline}) {
  const [messages, setMessages] = useState([]);
  const {uid} = route.params;
  console.log('Config.SERVER_URL>>>', Config.SERVER_URL);
  // const getAllMessages = async () => {
  //   const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
  //   const querySanp = await firestore()
  //     .collection('chatrooms')
  //     .doc(docid)
  //     .collection('messages')
  //     .orderBy('createdAt', 'desc')
  //     .get();
  //   const allmsg = querySanp.docs.map(docSanp => {
  //     return {
  //       ...docSanp.data(),
  //       createdAt: docSanp.data().createdAt.toDate(),
  //     };
  //   });
  //   setMessages(allmsg);
  // };

  useEffect(() => {
    // getAllMessages()
    // sendNotif();
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const sendNotif = async msg => {
    console.log('Notif');
    const sender = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        return docSnap.data();
      });
    const receiver = await firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(docSnap => {
        return docSnap.data();
      });
    if (receiver.token !== '') {
      fetch(Config.SERVER_URL + '/sendnotif', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: sender,
          receiver: receiver,
          msg: msg,
        }),
      });
    }
  };

  const onSend = messageArray => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .doc(mymsg._id)
      .set({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});

    sendNotif(mymsg);
  };
  return (
    <>
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <GiftedChat
        messages={messages}
        onSend={text => {
          onSend(text);
        }}
        user={{
          _id: user.uid,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'green',
                },
                left: {
                  backgroundColor: 'lightblue',
                },
              }}
            />
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{borderTopWidth: 1.5, borderTopColor: 'blue'}}
              textInputStyle={{color: 'black'}}
            />
          );
        }}
      />
    </View>
    {isOffline? <NoInternetModal show={isOffline} />:null}
    </>
  );
}
