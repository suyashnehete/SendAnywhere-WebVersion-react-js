import React, { useState, useEffect } from 'react';
import firebase from 'firebase'

function UpdateProfile(props) {


    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState({});

    const updateProfile = (e) => {
        console.log(file);
        e.preventDefault();
        if(file.length !== undefined){
        var uploadTask = firebase.storage().ref("profileImage").child(user.uid).put(file);
        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function (error) {
            console.log(error);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log(email);
                user.updateEmail(email);
                user.updateProfile({
                    displayName: name,
                    email: email,
                    photoURL: downloadURL
                }).then(function () {
                        console.log("Profile Updated");
                        props.history.push("/");
                }).catch(function (error) {
                    console.log("Failed");
                });
            });
        });
    }else{
            console.log(email);
            user.updateEmail(email);
            user.updateProfile({
                displayName: name,
            }).then(function () {
                console.log("Profile Updated");
                props.history.push("/");
            }).catch(function (error) {
                console.log("Failed");
            });
    }
    }

    const loadProfile = (file) => {
        setFile(file);
            var fr = new FileReader();
            fr.onload = function () {
                document.getElementById("profileImage").src = fr.result;
            }
            fr.readAsDataURL(file);
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUser(user);
                setName(user.displayName);
                setEmail(user.email);
            } else {
                props.history.push("/login");
            }
        });

    }, []);

    return (
        <div>
            {user.length === 0 ? <div>Loading...</div> : <div>
                    <form>
                        <img src={user.photoURL} id="profileImage"/>
                    <input type="file" onChange={(e) => loadProfile(e.target.files[0])} accept="image/*"/>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name"/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email"/>
                        <button onClick={(e) => updateProfile(e)}>Update</button>
                    </form>
                </div>
            }
        </div>
    );
}
export default UpdateProfile;
