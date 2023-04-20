import React, { useState, useEffect} from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { 
  query, 
  collection, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  getFirestore, 
  disableNetwork, 
  enableNetwork 
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

let unsubMessages;

const Chat = ({ db, route, isConnected, navigation }) => {
  const { user, color } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  useEffect(() => {
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

    navigation.setOptions({ title: user });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      cacheMessages(newMessages);
      setMessages(newMessages);
    });
  } else {
    loadCachedMessages();
  }
    return () => {
      if (unsubMessages) unsubMessages();
    }
   }, [isConnected]);

    // async function that sets messages with cached value
  // || [] will assign an empty array to cachedMessages if the messages_stored item hasn’t been set yet in AsyncStorage
  const loadCachedMessages = async () => {
    const cachedMessages =
      (await AsyncStorage.getItem('messages_stored')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // cashing data whenever it is updated
  // try-catch function - to prevent the app from crashing in case AsyncStorage fails to store the data.
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem(
        'messages_stored',
        JSON.stringify(messagesToCache)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: user.username });
  }, []);
  
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
   }

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#3b3d3d",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        marginBottom: 20,
      }}
    >
      <GiftedChat
        messagesContainerStyle={{ backgroundColor: color }}
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.uid,
          name: user.username,
          avatar: `https://placehold.co/140x140?text=${user.username.charAt(
            0
          )}`,
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
