import { READ_DATA_REQUEST, READ_DATA_FAIL, READ_DATA_SUCCEES, READ_DATA_NOT_FOUND } from "../constants/dataConstants";

function dataListReducer(state = { data: [] }, action) {
    switch (action.type) {
        case READ_DATA_REQUEST:
            return { loading: true, data: [], not: false };
        case READ_DATA_SUCCEES:
            return { loading: false, data: action.payload, not: false };
        case READ_DATA_FAIL:
            return { loading: false, error: action.payload, not: false};
        case READ_DATA_NOT_FOUND:
            return { loading: false, data: [] , not: true};
        default:
            return state;
    }
}

export {dataListReducer};