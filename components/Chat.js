import { useState, useEffect} from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useNavigation, useRoute } from "@react-navigation/native";
import { query, collection } from "firebase/firestore";
import { db } from "../firebase";

const Chat = () => {
  const route = useRoute();
  const { user, color } = route.params;
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  useEffect(() => {
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
      setMessages(newMessages);
    })
    return () => {
      if (unsubMessages) unsubMessages();
    }
   }, []);

  useEffect(() => {
    navigation.setOptions({ title: user.username });
  }, []);

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
