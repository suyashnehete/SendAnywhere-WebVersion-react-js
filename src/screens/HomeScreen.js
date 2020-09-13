import React, { useState, useEffect } from 'react';
import firebase from 'firebase'
import { useSelector, useDispatch } from 'react-redux';
import { listData } from '../actions/dataActions';

function HomeScreen(props) {
  

  const [user, setUser] = useState({});
  const [files, setFiles] = useState({});
  var fileIndex = 0;
  const dataList = useSelector(state => state.dataList);
  const {loading, data, error, not} = dataList;
  const dispatch = useDispatch();

  const signOut = () => {
    firebase.auth().signOut().then(() => {
      props.history.push("/login");
    }).catch((error) => {
      console.log(error);
    });
  }


const generateRandomNumber = () => {
  uploadData(String(Math.floor(100000 + Math.random() * 900000)));
}

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
        dispatch(listData(user.uid));
      } else {
        props.history.push("/login");
      }
    });
  }, []);


  const sizeConverter = (size) => {
    console.log(size);
    if (size > (1024 * 1024 * 1024)) {
      return String((size / (1024 * 1024 * 1024)).toFixed(2)) + " GB";
    } else if (size > (1024 * 1024)) {
      return String((size / (1024 * 1024)).toFixed(2)) + " MB";
    } else if (size > (1024)) {
      return String((size / (1024)).toFixed(2)) + " KB";
    } else {
      return String(size.toFixed(2)) + " B";
    }
  }
  
  const uploadData = (rand) => {
    firebase.database().ref("shareCodes").orderByKey().equalTo(rand).once('value', function (snapshot) {
      if (snapshot.exists()) {
        generateRandomNumber();
      } else {
        const key = firebase.database().ref("Users").child(user.uid).push().key;
        const date = Date.now();
        var uploadTask = firebase.storage().ref(user.uid).child(files[fileIndex].name+date).put(files[fileIndex]);
        var d = document.createElement("div");
        var n = document.createElement("h4");
        var p = document.createElement("p");
        var b = document.createElement("button");
        b.innerHTML = "Cancel"
        b.onclick = () => uploadTask.cancel();
        n.innerText = files[fileIndex].name;
        d.appendChild(n);
        d.appendChild(p);
        d.appendChild(b);
        document.getElementById("send").appendChild(d);
        uploadTask.on('state_changed', function (snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if(progress < 100){
          p.innerHTML = progress.toFixed(2);
          }
        }, function (error) {
          console.log(error);
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            const uploadTime = new Date().getTime();
            console.log(user.uid);
            firebase.database().ref("Users/" + user.uid+"/"+key).set({
              name: files[fileIndex].name,
              size: files[fileIndex].size,
              url: downloadURL,
              uploadTime,
              type: "Images",
              shareCode: rand,
              uri: ""
            }).then(() => {
              firebase.database().ref("shareCodes/" + rand).set({
                fileId: key,
                userId: user.uid
              }).then(() => {
                p.innerHTML = "100%"
                console.log("Uploaded");
                console.log(files.length);
                console.log(fileIndex);
                if((files.length-1) > fileIndex){
                  fileIndex += 1;
                  generateRandomNumber();
                }else{
                  fileIndex = 0;
                }
              });
            });
          });
        });
      }
    });
  }
  
  return (
    <div>
      {user.length === 0 ? <div>Loading...</div> : <div>
        <div>{user.uid}</div>
        <div>{user.displayName}</div>
        <div>{user.email}</div>
        <div>{user.phoneNumber}</div>
        <div>{user.photoURL}</div>
        </div>
      }
      <button onClick={signOut}>Sign Out</button>
          {loading ?
          <div>Loading...</div>:
          error ?
          <div>{error}</div>: 
          not ? 
          <div>No Data Found</div> :
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>ShareCode</th>
                </tr>
              </thead>
              <tbody>{
                Object.keys(data).map((id) =>  <tr key={id}>
                      <td>{data[id].name}</td>
                      <td>{sizeConverter(data[id].size)}</td>
                      <td>{data[id].shareCode}</td>
                    </tr>
                )
}
              </tbody>
            </table>
          }

        <form>
          <input type="file" onChange={(e) => {
            if(fileIndex == 0){
              setFiles(e.target.files)
            }else{
              var temp = files;
              temp.push(e.target.files);
              setFiles(temp);
            }
          }} multiple/>
          <button 
          onClick={(e) => {
            e.preventDefault(); 
            if(files.length && fileIndex==0){
              generateRandomNumber();
            }
          }}>Upload</button>
        </form>
        <div id="send"></div>
    </div>
  );
}
export default HomeScreen;
