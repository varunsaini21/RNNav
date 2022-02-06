import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreen from './src/screens/SignUpScreen';
import LogInScreen from './src/screens/LogInScreen';
import ChatScreen from './src/screens/ChatScreen';
import UserChatScreen from './src/screens/UserChatScreen';
import AccountScreen from './src/screens/AccountScreen';
import PostScreen from './src/screens/PostScreen';
import UploadPostScreen from './src/screens/UploadPostScreen';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from './src/components/NoInternetModal';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
  },
};

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const BottomTab = createMaterialBottomTabNavigator();
// const Drawer = createDrawerNavigator();

const Navigation = () => {
  const [user, setuser] = useState('');
  const [isOffline, setOfflineStatus] = useState(false);
  console.log('Internet Status>>>', isOffline);

  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        firestore().collection('users').doc(userExist.uid).update({
          status: 'online',
        });
        setuser(userExist);
      } else setuser('');
    });
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });

    return () => {
      unregister();
      removeNetInfoSubscription();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'blue',
        }}>
        {user ? (
          <>
            <Stack.Screen name="MyTabs" options={{headerShown: false}}>
              {props => <MyTabs {...props} user={user} isOffline={isOffline} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="LogInScreen" options={{headerShown: false}}>
              {props => <LogInScreen {...props} isOffline={isOffline} />}
            </Stack.Screen>
            <Stack.Screen name="SignUpScreen" options={{headerShown: false}}>
              {props => <SignUpScreen {...props} isOffline={isOffline} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function HomeTab({user, isOffline}) {
  return (
    <TopTab.Navigator
      initialRouteName="Feed Screen"
      screenOptions={{headerShown: false}}>
      <TopTab.Screen name="Feed Screen" options={{headerShown: false}}>
        {props => <FeedScreen {...props} user={user} isOffline={isOffline} />}
      </TopTab.Screen>
      <TopTab.Screen name="Home Screen" options={{headerShown: false}}>
        {props => <HomeScreen {...props} user={user} isOffline={isOffline} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
}

function FeedScreen({user, isOffline}) {
  return (
    //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <Text>Search!</Text>
    // </View>
    <Stack.Navigator>
      <>
        <Stack.Screen name="PostScreen" options={{headerShown: false}}>
          {props => <PostScreen {...props} user={user} isOffline={isOffline} />}
        </Stack.Screen>
        <Stack.Screen name="UploadPostScreen" options={{headerShown: false}}>
          {props => (
            <UploadPostScreen {...props} user={user} isOffline={isOffline} />
          )}
        </Stack.Screen>
      </>
    </Stack.Navigator>
  );
}

function HomeScreen({user, isOffline}) {
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen name="ChatScreen" options={{headerShown: false}}>
          {props => <ChatScreen {...props} user={user} isOffline={isOffline} />}
        </Stack.Screen>
        <Stack.Screen
          name="UserChatScreen"
          options={({route}) => ({
            title: (
              <View>
                <Text>{route.params.name}</Text>
                <Text>{route.params.status}</Text>
              </View>
            ),
          })}>
          {props => (
            <UserChatScreen {...props} user={user} isOffline={isOffline} />
          )}
        </Stack.Screen>
      </>
    </Stack.Navigator>
  );
}

function SearchTab() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Search!</Text>
    </View>
  );
}

function UpdatesTab({isOffline}) {
  <NoInternetModal show={isOffline} />;
  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Update!</Text>
        <Button
          title={'Javascript Crash Now.'}
          onPress={() => {
            undefinedVariable.notAFunction();
          }}
        />
      </View>
      {isOffline? <NoInternetModal show={isOffline} />:null}
    </>
  );
}

// function AccountTab() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Account Tab!</Text>
//     </View>
//     <TopTab.Navigator>
//       <TopTab.Screen name="Tab 1" component={Tab1} />
//       <TopTab.Screen name="Tab 2" component={Tab2} />
//       <TopTab.Screen name="Tab 3" component={Tab3} />
//       <TopTab.Screen name="Tab 4" component={Tab4} />
//     </TopTab.Navigator>
//   );
// }

// function Tab1() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Tab 1!</Text>
//     </View>
//   );
// }

// function Tab2() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Tab 2!</Text>
//     </View>
//   );
// }

// function Tab3() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Tab 3!</Text>
//     </View>
//   );
// }

// function Tab4() {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: true,
//         drawerType: 'back',
//         drawerPosition: 'right',
//         drawerContentStyle: {width: '100%'},
//       }}>
//       <Drawer.Screen
//         name="Notif 1"
//         component={Notif1}
//         options={{drawerLabel: 'Notif 1'}}
//       />
//       <Drawer.Screen
//         name="Notif 2"
//         component={Notif2}
//         options={{drawerLabel: 'Notif 2'}}
//       />
//       <Drawer.Screen
//         name="Notif 3"
//         component={Notif3}
//         options={{drawerLabel: 'Notif 3'}}
//       />
//     </Drawer.Navigator>
//   );
// }

// function Notif1() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Notification 1!</Text>
//     </View>
//   );
// }

// function Notif2() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Notification 2!</Text>
//     </View>
//   );
// }

// function Notif3() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Notification 3!</Text>
//     </View>
//   );
// }

function MyTabs({user, isOffline}) {
  return (
    <BottomTab.Navigator
      initialRouteName="HomeTab"
      activeColor="#e91e63"
      labelStyle={{fontSize: 25}}
      style={{backgroundColor: 'tomato'}}>
      <BottomTab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}>
        {props => <HomeTab {...props} user={user} isOffline={isOffline} />}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="SearchTab"
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}>
        {props => <SearchTab {...props} isOffline={isOffline} />}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="UpdatesTab"
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}>
        {props => <UpdatesTab {...props} isOffline={isOffline} />}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="AccountScreen"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}>
        {props => (
          <AccountScreen {...props} user={user} isOffline={isOffline} />
        )}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="blue" />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
