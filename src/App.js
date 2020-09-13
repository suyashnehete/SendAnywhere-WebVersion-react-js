import React from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import {BrowserRouter, Route} from 'react-router-dom';
import firebase from 'firebase';
import config from './config'
import LoginScreen from './screens/LoginScreen';
import UpdateProfile from './screens/UpdateProfile';

function App() {
  firebase.initializeApp({
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    databaseURL: config.DATABASE_URL,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSEGING_SENDER_ID,
    appId: config.APP_ID,
    measurementId: config.MESUREMENT_ID
  });

  firebase.analytics();

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  
  return (
    <div>
      <BrowserRouter>
        <Route path="/update" component={UpdateProfile} />
        <Route path="/login" component={LoginScreen} />
        <Route path="/" exact={true} component={HomeScreen} />
      </BrowserRouter>
    </div>
  );
}

export default App;
