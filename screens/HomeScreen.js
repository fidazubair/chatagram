import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Image } from 'react-native';
import db from '../db.js'
import firebase from 'firebase'
import { ImagePicker } from 'expo';
import { uploadImageAsync } from "../ImageUtils"
export default class App extends Component {
  state = {
    username: "",
    password: "",
    name: "",
    image: null,
    caption:"",
    avatar:null
  }

  loginOrRegister = async () => {
    let avatar = "default.png"
    try {
      await firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password)
      //await db.collection("users").doc(this.state.username).set({ name: this.state.name, online: false })

      if (this.state.avatar) {
        avatar = this.state.username
        await uploadImageAsync("avatar",this.state.avatar, this.state.username)
      }

      const name = this.state.name || this.state.username
      console.log("image upload: ", avatar)

      await db.collection("users").doc(this.state.username).set({ name, avatar, online: true })

      //upload this.state.image called this.state.email
    }
    catch (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)

      if (errorCode == "auth/email-already-in-use") {
        try {
          await firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
          await db.collection("users").doc(this.state.username).update({ online: true })
          // const result = this.state.image && await uploadImageAsync(this.state.image, this.state.username)
          if (this.state.image) {
            avatar = this.state.username
            await uploadImageAsync("avatar",this.state.avatar, this.state.username)
            await db.collection("users").doc(this.state.username).update({ avatar })
          }
          await db.collection("users").doc(this.state.username).update({ online: true })
          if (this.state.name) {
            await db.collection("users").doc(this.state.username).update({ name:this.state.name})
          }
         // console.log("image upload: ", result)
          alert("Login Successful")
        }
        catch (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
          // ...
        }
      } // ...
    }
  }
  pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ avatar: result.uri });
    }
  };
  pickImage=async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
    await uploadImageAsync("images",result.uri,this.state.username)
    await db.collection("users").doc(this.state.username).update({ caption:this.state.caption })

    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.avatar && <Image
          style={{ width: 80, height: 80 }}
          source={{ uri: this.state.avatar }}
        />}
        <TextInput
          autoCapitalize="none"
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          autoCapitalize="none"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
          placeholder={'Name'}
          style={styles.input}
        />
        <TextInput
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
          {this.state.image && <Image
          style={{ width: 80, height: 80 }}
          source={{ uri: this.state.image }}
        />}
 <TextInput
          autoCapitalize="none"
          value={this.state.caption}
          onChangeText={(caption) => this.setState({ caption })}
          placeholder={'Caption'}
          style={styles.input}
        />
        <Button
          title={'Login/Register'}
          style={styles.input}
          onPress={this.loginOrRegister}
        />
        <Button onPress={this.pickAvatar} title="Select Avatar" style={{ width: 100, paddingTop: 20 }} />
        <Button onPress={this.pickImage} title="Upload New Image " style={{ width: 100, paddingTop: 20 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
