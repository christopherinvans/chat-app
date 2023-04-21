import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// import to make ActionSheet avaliable to fetch
import { useActionSheet } from '@expo/react-native-action-sheet';

// importing packages enabling Geolocation communication features
import * as Location from 'expo-location';

// Import image picker package
// * - imports everything which is exported in package
import * as ImagePicker from 'expo-image-picker';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  color,
  onSend,
  storage,
  userID,
}) => {
  //setting variable actionSheet value as useActionSheet() method, which returns a reference to Gifted Chat’s ActionSheet
  const actionSheet = useActionSheet();

  // onActionsPress renders additional actions for user
  const onActionPress = () => {
    // variable defines array of avaliable options
    const options = [
      'Choose image from library',
      'Take picture',
      'Send location',
      'Cancel',
    ];

    // variable defines index of option 'Cancel'
    const cancelButtonIndex = options.length - 1;

    /**Function makes avaliable to send location
     * Location.requestForegroundPermissionsAsync() - request permission to access the device’s location
     * if permissions.granted = true we get access to read location data
     * Location.getCurrentPositionAsync() - returns an object with coordiantes of user's location
     * to onSend we send to onSend a message that only contains location property
     * it enables renderCustomView to render the MapView in a message bubble
     * other properties added by default (createdAt, _id, and user)
     */
    const getLocation = async () => {
      let permissions = await Location.requestForegroundPermissionsAsync();

      if (permissions?.granted) {
        const location = await Location.getCurrentPositionAsync({});
        if (location) {
          onSend({
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          });
        } else Alert.alert('Error occurred while fetching location');
      } else Alert.alert("Permissions haven't been granted.");
    };

    // to create unique reference string
    const generateReference = (uri) => {
      const timeStamp = new Date().getTime();
      const imageName = uri.split('/')[uri.split('/').length - 1];
      return `${userID}-${timeStamp}-${imageName}`;
    };

    // upload image to Firebase Storage and send to chat
    const uploadAndSendImage = async (imageURI) => {
      // to create unique reference string
      const uniqueRefString = generateReference(imageURI);
      const response = await fetch(imageURI);
      // blob() - creates image of needed format
      const blob = await response.blob();
      // newUploadRef - creates reference that the file will be uploaded to
      const newUploadRef = ref(storage, uniqueRefString);
      // uploadBytes - uploads the file to Storage
      uploadBytes(newUploadRef, blob)
        .then(async (snapshot) => {
          // Get the remote URL of the image you’ve just uploaded
          const imageURL = await getDownloadURL(snapshot.ref);
          onSend({ image: imageURL });
        })
        .catch((error) => console.log(error));
    };

    // Pick image from media library
    const pickImage = async () => {
      let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissions?.granted) {
        let result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
          const imageURI = result.assets[0].uri;
          await uploadAndSendImage(imageURI);
        } else Alert.alert("Permissions haven't been granted.");
      }
    };

    // take Photo
    const takePhoto = async () => {
      let permissions = await ImagePicker.requestCameraPermissionsAsync();

      if (permissions?.granted) {
        let result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
          const imageURI = result.assets[0].uri;
          await uploadAndSendImage(imageURI);
        } else Alert.alert("Permissions haven't been granted.");
      }
    };

    actionSheet.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            console.log('User wants to pick an image');
            return;
          case 1:
            takePhoto();
            console.log('User wants to take a photo');
            return;
          case 2:
            getLocation();
            console.log('User wants to share location');
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel='Show options of actions'
      accessibilityHint="Lets you open the list of available actions"
      accessibilityRole='button'
      style={styles.container}
      onPress={onActionPress}
    >
      <View
        style={[
          styles.wrapper,
          wrapperStyle,
          { backgroundColor: `${color}`, borderColor: `${color}` },
        ]}
      >
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 35,
    height: 35,
    marginLeft: 12,
    marginBottom: 5,
  },
  wrapper: {
    borderRadius: 50,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});
export default CustomActions;