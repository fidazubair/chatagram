import React from 'react';
import { ScrollView, StyleSheet, TextInput, Button, View, Text, Image } from 'react-native';
import { ExpoChatView } from '@expo/samples';
import db from "../db"
import firebase from 'firebase'
import functions from "firebase/functions"
import { createAttendeeAsync } from 'expo/build/Calendar';
export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  };
  state = {
    message: "",
    time: "",

    username: "",
    messages: [],
    imageEmail:null,
   
  }
  users = []
  create = async () => {
    console.log("Create clicked")
    const addMessage = firebase.functions().httpsCallable('addMessage');
    //db.collection("chat").add({Message:this.state.message,Name:firebase.auth().currentUser.email,Time:new Date()})
    this.setState({ username: "" })
    this.setState({ message: "" })
    const result = await addMessage({ message: this.state.message })
  }
  componentDidMount() {
    //go to the database and get all the records
    db.collection("users").onSnapshot(querySnapshot => {
      this.users = [];
      querySnapshot.forEach(doc => {
        this.users.push({ id: doc.id, ...doc.data() });
      });
      ;
      console.log("Current users ", this.users.length);

    });
    db.collection("chat").orderBy("Time").onSnapshot(querySnapshot => {
      let messages = [];
      querySnapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      ;
      console.log("Current Chats ", messages.join(", "));
      this.setState({ messages })
    });


    db.collection("image").onSnapshot(querySnapshot => {
      let images = [];
      querySnapshot.forEach(doc => {
        images.push({ id: doc.id, ...doc.data() });
      });
      ;
      console.log("Image email",images[0].email);
      this.setState({ imageEmail:images[0].email })
    });
  }

  makeURL=(email)=>{
    return "avatar%2F"+this.users.find(u => u.id === email).avatar.replace("@","%40")
    //return "avatar%2F"+email.replace("@","%40")
  }

  imageURL=(email)=>{
    return "images%2F"+email.replace("@","%40")
    //return "avatar%2F"+email.replace("@","%40")
  }
  updateImage= async()=>{
    await firebase.functions().httpsCallable("updateImage")()
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
        {/* {this.state.imageEmail&&
                 <View>  <Image style={{ width: 200, height: 200}}
                      source={{ uri: `https://firebasestorage.googleapis.com/v0/b/inspired-rhythm-221812.appspot.com/o/${this.makeURL("images",this.state.imageEmail)}?alt=media&token=1915ca2b-8f1e-4b10-a254-e3a4046eb809io/react-native/docs/assets/favicon.png` }}
                    />   <Text>{this.users.find(u => u.id === this.state.imageEmail).caption}
                  </Text></View>} */}

                  {this.state.imageEmail&&<View>
                    <Text style={styles.name}>
                    <Image style={{ width: 200, height: 200 }}
                      source={{ uri: `https://firebasestorage.googleapis.com/v0/b/inspired-rhythm-221812.appspot.com/o/${this.imageURL(this.state.imageEmail)}?alt=media&token=1915ca2b-8f1e-4b10-a254-e3a4046eb809io/react-native/docs/assets/favicon.png` }}
                    />    {this.users.find(u => u.id === this.state.imageEmail).caption}</Text></View>
                  }
          <View>
            {
              this.state.messages.map(chat =>
                <View key={chat.id}>

                  <Text style={styles.name}>
                    <Image style={{ width: 20, height: 20 }}
                      source={{ uri: `https://firebasestorage.googleapis.com/v0/b/inspired-rhythm-221812.appspot.com/o/${this.makeURL(chat.Name)}?alt=media&token=1915ca2b-8f1e-4b10-a254-e3a4046eb809io/react-native/docs/assets/favicon.png` }}
                    />    {this.users.find(u => u.id === chat.Name).name}</Text><Text>{chat.Message} {'\n'}
                  </Text>

                </View>
              )
            }
          </View>
          <TextInput autoCapitalize="none"
            placeholder="Enter Message"
            onChangeText={message => this.setState({ message })}
            value={this.state.message}
            multiline={true} />


          <TextInput
            autoCapitalize="none"
            placeholder="Enter Name"
            onChangeText={username => this.setState({ username: firebase.auth().currentUser.email })}
            value={firebase.auth().currentUser.email}
          />

        </View>


        <Button onPress={this.create} title="Create" style={{ width: 100, paddingTop: 20 }} />

        <Button onPress={this.updateImage} title="Update Image" style={{ width: 100, paddingTop: 20 }} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  }
  , name: {
    fontWeight: "bold"
  }
});
