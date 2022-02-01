import React from 'react'
import { View, Text, Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import * as api from '../API';

getRequest = () => {
    api.getCall().then(function (response) {
      console.log(JSON.stringify(response.data))
    })
      .catch(function (error) {
        console.log(error);
      })
  }

  postRequest = (content, author) => {

    api.insertCall(content,author).then(function (response) {
      console.log(response.data);
    })
      .catch(function (error) {
        console.log(error)
      })

  }


export default function AddQuote() {
    return (
        <><View style={{ backgroundColor: 'black',marginTop:'50%' }}>
            <TextInput placeholder='enter Quote' style={{ color: 'white' }} />
            <TextInput placeholder='Author' style={{ color: 'white' }} />
        </View>
        <View>
            <Button title='Submit' onPress={()=>postRequest()} />
            <Button title='get' onPress={()=>getRequest()} />
        </View></>
    )
}
