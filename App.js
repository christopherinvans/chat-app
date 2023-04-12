import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  // const firebaseConfig = {
  //   apiKey: "AIzaSyBRMaVHRbyD2NpeXpbXJcFasNCiJLhD1QM",
  //   authDomain: "chatapp-4fdcc.firebaseapp.com",
  //   projectId: "chatapp-4fdcc",
  //   storageBucket: "chatapp-4fdcc.appspot.com",
  //   messagingSenderId: "274539179086",
  //   appId: "1:274539179086:web:2ef388166f7679fab2a71f"
  // };
  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);

  // // Initialize Cloud Firestore and get a reference to the service
  // const db = getFirestore(app);
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}>
            </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;