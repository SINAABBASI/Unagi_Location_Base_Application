import { addPost, getPosts, getOlderPosts, likePost } from "./network";
import { getUniqueID } from "./helpers";
import { AsyncStorage } from "react-native";
import * as actions from "./actions";
const reducer = (state, action) => {
    if (action.type === actions.GET_POSTS) {
        getPosts(state.unique_id, myLocation).then(res => {
            return { ...state, items: res };
        });
    }
    if (action.type === actions.ADD_POST) {
        addPost(state.unique_id, myLocation, action.text).then(res => {
            return { ...state, sendPostResponse: "ok" };
        });
    }
    if (action.type === actions.GET_UNIQUE_ID) {
        var uniqueID = getUniqueID();
        return { ...state, unique_id: uniqueID };
    }
    if (action.type === actions.LIKE_POST) {
        likePost(state.unique_id, myLocation, action.postID, true);
    }
    if (action.type === actions.UNLIKE_POST) {
        likePost(state.unique_id, myLocation, action.postID, false);
    }
    if (action.type === actions.SET_LOCATION) {
        return { ...state, location: action.location };
    }
    if (action.type === actions.SAVE_POSTS) {
        return { ...state, items: action.posts, refreshing: false };
    }
    if (action.type == actions.SAVE_UNIQUE_ID) {
        return { ...state, unique_id: action.uniqueID };
    }
    if (action.type === actions.SAVE_OLD_POSTS) {
        var newItems = state.items.concat(action.posts);
        return { ...state, items: newItems, refreshing: false };
    }
    if (action.type === actions.SAVE_OLD_HOT_POSTS) {
        var newItems = state.hotItems.concat(action.posts);
        return { ...state, hotItems: newItems, refreshing: false };
    }
    if (action.type === actions.SAVE_HOT_POSTS) {
        return { ...state, hotItems: action.posts, refreshing: false };
    }
    if (action.type === actions.SAVE_MY_POSTS) {
        return { ...state, myItems: action.posts, refreshing: false };
    }
    if (action.type === actions.SAVE_OLD_MY_POSTS) {
        var newItems = state.myItems.concat(action.posts);
        return { ...state, myItems: newItems, refreshing: false };
    }
    if (action.type === actions.SIGNUP_WAITING) {
        return {
            ...state,
            signupWaiting: true,
            inSignupScreen: true,
            inLoginScreen: false,
            signupNetworkError: false
        };
    }
    if (action.type === actions.SIGNUP_FAIL) {
        return {
            ...state,
            signupWaiting: false,
            signupStatus: false,
            inSignupScreen: true,
            signupNetworkError: false
        };
    }
    if (action.type === actions.SIGNUP_DONE) {
        AsyncStorage.setItem("refreshToken", action.response.refreshtoken);
        AsyncStorage.setItem("accessToken", action.response.accesstoken);
        return {
            ...state,
            signupWaiting: false,
            signupStatus: true,
            inSignupScreen: true,
            refreshToken: action.response.refreshtoken,
            accessToken: action.response.accesstoken
        };
    }
    if (action.type === actions.LOGIN_WAITING) {
        return {
            ...state,
            loginWaiting: true,
            loginStatus: false,
            loginNetworkError: false,
            inLoginScreen: true
        };
    }
    if (action.type === actions.LOGIN_FAIL) {
        return {
            ...state,
            loginStatus: false,
            loginWaiting: false,
            loginNetworkError: false
        };
    }
    if (action.type === actions.LOGIN_DONE) {
        AsyncStorage.setItem("refreshToken", action.response.refreshtoken);
        AsyncStorage.setItem("accessToken", action.response.accesstoken);
        return {
            ...state,
            loginWaiting: false,
            loginStatus: true,
            loginNetworkError: false,
            inLoginScreen: true,
            refreshToken: action.response.refreshtoken,
            accessToken: action.response.accesstoken
        };
    }
    if (action.type === actions.UPDATE_POST) {
        var postsArray = Array.prototype.slice.call(state.items);
        for (var i = 0; i < postsArray.length; i++) {
            if (postsArray[i]._id === action.updatedPostID) {
                postsArray[i].isLiked = action.likeStatus;
                postsArray[i].likes = action.updatedPostLikes;
            }
        }
        if (!state.hotItems) state = { ...state, items: postsArray };
        else {
            state = { ...state, items: postsArray };
            var postsArray = Array.prototype.slice.call(state.hotItems);
            for (var i = 0; i < postsArray.length; i++) {
                if (postsArray[i]._id === action.updatedPostID) {
                    postsArray[i].isLiked = action.likeStatus;
                    postsArray[i].likes = action.updatedPostLikes;
                }
            }
            state = { ...state, hotItems: postsArray };
        }
        if (!state.myItems) return state;
        else {
            var postsArray = Array.prototype.slice.call(state.myItems);
            for (var i = 0; i < postsArray.length; i++) {
                if (postsArray[i]._id === action.updatedPostID) {
                    postsArray[i].isLiked = action.likeStatus;
                    postsArray[i].likes = action.updatedPostLikes;
                }
            }
        }
        return state;
    }
    if (action.type === actions.LOGOUT) {
        AsyncStorage.clear();
        return {};
        // return {
        //     ...state,
        //     inLoginScreen: false,
        //     inSignupScreen: false,
        //     loginWaiting: false,
        //     loginStatus: false,
        //     signupWaiting: false,
        //     signupStatus: false,
        //     loginNetworkError: false,
        //     signupNetworkError: false
        // };
    }
    if (action.type === actions.LOGIN_NETWORK_ERROR) {
        return {
            ...state,
            loginWaiting: false,
            loginStatus: false,
            loginNetworkError: true,
            inLoginScreen: true
        };
    }
    if (action.type === actions.SIGNUP_NETWORK_ERROR) {
        return {
            ...state,
            signupWaiting: false,
            signupStatus: false,
            signupNetworkError: true,
            inSignupScreen: true
        };
    }
    if (action.type === actions.GETTING_POSTS) {
        return { ...state, refreshing: true };
    }
    if (action.type === actions.INCREASE_POST_REPLIES) {
        var postsArray = Array.prototype.slice.call(state.items);
        for (var i = 0; i < postsArray.length; i++) {
            if (postsArray[i]._id === action.updatedPostID) {
                postsArray[i].replies += 1;
            }
        }
        if (!state.hotItems) state = { ...state, items: postsArray };
        else {
            state = { ...state, items: postsArray };
            var postsArray = Array.prototype.slice.call(state.hotItems);
            for (var i = 0; i < postsArray.length; i++) {
                if (postsArray[i]._id === action.updatedPostID) {
                    postsArray[i].replies += 1;
                }
            }
            state = { ...state, hotItems: postsArray };
        }
        if (!state.myItems) return state;
        else {
            var postsArray = Array.prototype.slice.call(state.myItems);
            for (var i = 0; i < postsArray.length; i++) {
                if (postsArray[i]._id === action.updatedPostID) {
                    postsArray[i].replies += 1;
                }
            }
        }
        return state;
    }
};

export default reducer;
