import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import fetch from "node-fetch"




admin.initializeApp(functions.config().firebase)
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const writeMessage = functions.firestore
    .document('chat/{id}')
    .onWrite((change, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const message=change.after.exists?change.after.data():null
      const oldMessage = change.before.data();

      // access a particular field as you would any JS property
      console.log("message=",message)
      console.log("oldMessage",oldMessage)

      // perform desired operations ...
    });

    export const onWriteUser = functions.firestore
    .document('users/{id}')
    .onWrite(async(change, context) => {
      
      const user=change.after.exists?change.after.data():null
      const olduser = change.before.data();

      
      console.log("user=",user)
      console.log("olduser",olduser)

      // perform desired operations ...

      //choices: user logged in,user logged out, user registered
      let message=null
      if(!olduser||user.online&& !olduser.online){
        message="Hi"
      }else if(olduser.online&&!user.online){
        message="Bye"
      }
      if (message){
        await admin.firestore().collection("chat").add({ Message: message + " "+user.name+" !", Name: "Bot.png", Time: new Date() })
      }
    });
export const addMessage = functions.https.onCall(async (data, context) => {
    const message = data.message;
    const email = context.auth!.token.email || null;
    const help = ["Type !hi to chat with the robot\n", "Type !users to see the list of logged in users\n"]
    await admin.firestore().collection("chat").add({ Message: message, Name: email, Time: new Date() })
    //if message=!hi say "Hi" to the user
    if (message == "!hi") {
        await admin.firestore().collection("chat").add({ Message: "I am here fellas", Name: "Bot.png", Time: new Date() })
    }
    else if (message == "!users") {

        const querySnapshot = await admin.firestore().collection("chat").get()


        let users = new Array()

        querySnapshot.forEach(doc => {
            const username = doc.data().Name

            if (!users.includes(username)) {
                users.push(username);
            }
        });
        await admin.firestore().collection("chat").add({ Message: users, Name: "Bot.png", Time: new Date() })

    }
    else if (message == "!help") {
        await admin.firestore().collection("chat").add({ Message: help, Name: "Bot.png", Time: new Date() })

    }
    else if (message.startsWith("!weather")) {
     
       const city=message.slice(9)
       console.log(city)
       const json= await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=11abb120ec5d40d9965d6118654a6949`)
        const description=json.weather[0].main
        const temp=json.main.temp-273.15
        await admin.firestore().collection("chat").add({ Message: "Currently"+description+"and the temperature is "+temp, Name: "Mr.Robot", Time: new Date() })

    }
    return null

    //response.send("Helloo from firebase")
});

export const updateImage = functions.https.onRequest(async (req, res) => {
    
    //find all images(users with captions)
    // const querySnapshot = await admin.firestore().collection("users").get()
    // let captionAr = new Array()
    // querySnapshot.forEach(doc => {
    //     const info = doc.data()
       
    //     if(info.caption!=null){
    //         captionAr.push(info)
    //     }

       
    // });
    // //pick one at random

    // //change user document in image collection
    // await admin.firestore().collection("image").doc("user").update({ email,when:new Date()})
    const querySnapshot = await admin.firestore().collection("users").where("caption",">","").get()
    let emails = new Array()
    querySnapshot.forEach(doc => {
        
        emails.push(doc.id)
        
       
})
console.log(emails)
const email=emails[Math.floor(emails.length*Math.random())]
await admin.firestore().collection("image").doc("user").update({email:email})
res.status(200).send();
})

