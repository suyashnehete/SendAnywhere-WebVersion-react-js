import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
function LoginScreen(props) {

  const [confirmationResult, setConfirmationResult] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");

  const setUpReCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
      }
    });
  }

  const onSignInSubmit = () => {
    setUpReCaptcha();
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber("+91" + phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        setConfirmationResult(confirmationResult);
      }).catch(function (error) {
        document.getElementById("error").innerHTML = "<h4>" + error.message + "</h4>";
      });
  }

  const verifyCode = () => {
    confirmationResult.confirm(code).then(function (result) {
      // User signed in successfully.
      props.history.push("/update");
      // ...
    }).catch(function (error) {
      // User couldn't sign in (bad verification code?)
      // ...
      document.getElementById("error").innerHTML = "<h4>" + error.message + "</h4>";
    });
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (user.displayName) {
          props.history.push("/");
        } else {
          props.history.push("/update");
        }
      }
    });
  }, []);

  return (
    <div className="modal fade" id="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            Login
          </div>
          <div className="modal-body">
            <div className="form">
              <div id="error" style={{ margin: 0, marginBottom: 30 + 'px', color: 'red' }}></div>
              <div id="recaptcha-container"></div>
              <div className="input-phone">
                <input type="tel" name="phone-number" id="phone-number" required onChange={(e) => setPhoneNumber(e.target.value)} />
                <span id="phone-number-label">Phone Number</span>
              </div>
              <div className="verify primary">
                <button id="verify-button" onClick={onSignInSubmit}>Verify</button>
              </div>
              <div className="verification">
                <div className="verify-input">
                  <input type="number" className="verify-text" id="1" onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="proceed">
                  <button id="proceed-home" onClick={verifyCode}>Proceed To Home</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginScreen;
