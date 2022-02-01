import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity,Image, StatusBar, Linking, ImageBackground,ToastAndroid } from 'react-native'
import Tts from 'react-native-tts'
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import OnboardingScreen from './screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';


Tts.setDefaultLanguage('en-GB')
Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');
Tts.setDefaultRate(0.5);
Tts.setDefaultPitch(1.2);

const Stack = createNativeStackNavigator();

const App = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
  
  }, []);

  if (isFirstLaunch === null) {
    return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
  } else if (isFirstLaunch == true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'Main';
  }

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName={routeName}>
        <Stack.Screen name="Onboarding"component={OnboardingScreen} options={{header: () => null}}/>
        <Stack.Screen component={Main} name="Main" options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
const Main = ({navigation}) => {

  const[Quote,setQuote]=useState('Loading...');
  const [Author,setAuthor] = useState('Loading...');
  const[isLoading,setIsLoading]=useState(false);
  const [isSpeaking,setIsSpeaking]=useState(false);

  const randomQuote =()=> {
    setIsLoading(true)
  fetch('https://api.quotable.io/random').then(res => res.json()).then(result=>{
    //console.log(result.content)
    setQuote(result.content)
    setAuthor(result.author)
    setIsLoading(false)
  })
}

useEffect(()=> {
  randomQuote();
},[])

const speakNow = () => {
  Tts.stop();
  Tts.speak(Quote + ' by ' + Author);
  Tts.addEventListener('tts-start',(event) => setIsSpeaking(true));
  Tts.addEventListener('tts-finish',(event) => setIsSpeaking(false));
}

const showToast = () => {
    ToastAndroid.show("Listen the Quote !", ToastAndroid.SHORT);
  };
const showToastCopied = () => {
    ToastAndroid.show("Quote Copied !", ToastAndroid.SHORT);
  };
const tweetNow = () => {
    const url = "https://twitter.com/intent/tweet?text=" + Quote;
    Linking.openURL(url);
}

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black'}}>
    {/* <Image source={require('./assets/download.jpg')} style={{position:'absolute',top:12,left:3}}/> */}
    <Text style={{position:'absolute',top:12,right:16,fontSize:17}}>Welcome !!!</Text>
    <StatusBar barStyle="light-content"/>
    <View style={{
      width:'90%',
      backgroundColor:'white',
      borderRadius:20,
      padding:10
      }}>
      <ImageBackground source={require('./assets/background.jpg')} resizeMode='cover'>
            <Text style={{
              textAlign:'center',
              fontSize:26,
              fontWeight:'600',
              color:'#333',
              marginBottom:20
              }}>
              Quote of the Day
              </Text>
              
            <Text style={{
              fontSize:16,
              lineHeight:26,
              letterSpacing:1.1,
              fontWeight:'400',
              textAlign:'center',
              marginBottom:10,
              color:'black'
              }}>
              {Quote}
              </Text>

            <Text style={{
              textAlign:'right',
              fontStyle:'italic',
              fontSize:16,
              fontWeight:'300',
              color:'black',paddingRight:7
              }}>
              -- {Author}
              </Text>

            <TouchableOpacity onPress={randomQuote} 
            style={{
              
              borderRadius:30,
              padding:20,
              marginVertical:20
              }}>
              <ImageBackground source={require('./assets/download.jpg')}style={{height:35}} resizeMode='cover'>
              <Text style={{
                color:'#fff',
                fontSize:18,
                textAlign:'center'
                }}>
                {isLoading ? "Loading..." : "New Quote"}
                </Text>
                </ImageBackground>

            </TouchableOpacity>

            <View style={{flexDirection:'row',justifyContent:'space-around'}}>

              <TouchableOpacity onPress={()=>{speakNow();showToast()}} 
              style={{borderWidth:2,padding:15,borderRadius:50}}>
                <Image source={require('./assets/volup.jpg')} 
                style={{height:25,width:25,backgroundColor:isSpeaking?'#234F1E':'#FFF'}} />
              </TouchableOpacity>

              <TouchableOpacity onPress={showToastCopied} 
              style={{borderWidth:2,padding:15,borderRadius:50}}>
                <Image source={require('./assets/copy.jpg')} 
                style={{height:25,width:25}} />
              </TouchableOpacity>

              <TouchableOpacity onPress={tweetNow} 
              style={{borderWidth:2,padding:15,borderRadius:50}}>
                <Image source={require('./assets/twitter.jpg')} 
                style={{height:25,width:25}} />
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={()=>navigation.navigate('AddQuote')}
              style={{borderWidth:2,padding:15,borderRadius:50}}>
                <Image source={require('./assets/add.jpg')} 
                style={{height:25,width:25,backgroundColor:'transparent'}} />
              </TouchableOpacity> */}

            </View>
            </ImageBackground>
    </View>
    </View>
    
  )
}

export default App