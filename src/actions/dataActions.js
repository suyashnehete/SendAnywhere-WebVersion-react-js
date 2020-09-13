import { READ_DATA_NOT_FOUND, READ_DATA_REQUEST, READ_DATA_SUCCEES, READ_DATA_FAIL } from "../constants/dataConstants";
import firebase from 'firebase';

const listData = (id) => async (dispatch) => {
    try {
        dispatch({ type: READ_DATA_REQUEST });
        firebase.database().ref('Users').child(id).on('value', function (snapshot) {
            if(snapshot.exists()){
            const temp = snapshot.val();
            console.log(temp);
            dispatch({ type: READ_DATA_SUCCEES, payload: temp }); 
            }else{
                dispatch({ type: READ_DATA_NOT_FOUND });
            }
        });
    } catch (error) {
        dispatch({ type: READ_DATA_FAIL, payload: error.message });
    }
};

export {listData};