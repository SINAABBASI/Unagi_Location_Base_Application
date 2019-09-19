export const GET_POSTS = "get_posts";
export const SAVE_OLD_POSTS = "save_old_posts";
export const SAVE_OLD_HOT_POSTS = "save_old_hot_posts";
export const SAVE_OLD_MY_POSTS = "save_old_my_posts";
export const ADD_POST = "add_post";
export const GET_UNIQUE_ID = "get_unique_id";
export const LIKE_POST = "like_post";
export const UNLIKE_POST = "unlike_post";
export const SAVE_POSTS = "save_posts";
export const SAVE_HOT_POSTS = "save_hot_posts";
export const SAVE_MY_POSTS = "save_my_posts";
export const SAVE_UNIQUE_ID = "save_unique_id";
export const UPDATE_POST = "update_post";
export const SET_LOCATION = "set_location";
export const SIGNUP_DONE = "signup_done";
export const SIGNUP_FAIL = "signup_fail";
export const SIGNUP_WAITING = "signup_waiting";
export const LOGIN_DONE = "login_done";
export const LOGIN_FAIL = "login_fail";
export const LOGIN_WAITING = "login_waiting";
export const LOGOUT = "logout";
export const LOGIN_NETWORK_ERROR = "login_network_error";
export const SIGNUP_NETWORK_ERROR = "signup_network_error";
export const GETTING_POSTS = "getting_posts";
export const INCREASE_POST_REPLIES = "increase_post_replies";

var Helpers = require("./helpers");
var Network = require("./network");
// export function getPosts() {
//     return {
//         type: GET_POSTS
//     };
// }
export function saveOldPosts(posts) {
    return {
        type: SAVE_OLD_POSTS,
        posts: posts
    };
}
export function saveOldHotPosts(posts) {
    return {
        type: SAVE_OLD_HOT_POSTS,
        posts: posts
    };
}
export function addPost(text) {
    return {
        type: ADD_POST,
        text: text
    };
}
export function getUniqueID() {
    return {
        type: GET_UNIQUE_ID
    };
}
export function savePosts(posts) {
    return {
        type: SAVE_POSTS,
        posts: posts
    };
}
export function saveHotPosts(posts) {
    return {
        type: SAVE_HOT_POSTS,
        posts: posts
    };
}
export function saveMyPosts(posts) {
    return {
        type: SAVE_MY_POSTS,
        posts: posts
    };
}
export function saveOldMyPosts(posts) {
    return {
        type: SAVE_OLD_MY_POSTS,
        posts: posts
    };
}
export function saveUniqueID(uniqueID) {
    return {
        type: SAVE_UNIQUE_ID,
        uniqueID: uniqueID
    };
}
export function setLocation(location) {
    return {
        type: SET_LOCATION,
        location: location
    };
}
export function gettingPosts() {
    return {
        type: GETTING_POSTS
    };
}
export function getAndSaveUniqueID() {
    return function(dispatch) {
        return Helpers.getUniqueID().then(
            uniqueID => dispatch(saveUniqueID(uniqueID)),
            err => console.log(err)
        );
    };
}
export function getAndSavePosts(accessToken, refreshToken) {
    return function(dispatch) {
        dispatch(gettingPosts());
        return Helpers.getLocation().then(
            location => {
                return Network.getPosts(
                    location,
                    accessToken,
                    refreshToken
                ).then(
                    posts => {
                        dispatch(savePosts(posts));
                        dispatch(setLocation(location));
                    },
                    err => console.log(err)
                );
            },
            err => console.log(err)
        );
    };
}
export function getAndSaveOldPosts(
    accessToken,
    refreshToken,
    location,
    lastPostID
) {
    return function(dispatch) {
        return Network.getOldPosts(
            accessToken,
            refreshToken,
            location,
            lastPostID
        ).then(
            posts => {
                dispatch(saveOldPosts(posts));
            },
            err => console.log(err)
        );
    };
}
export function getAndSaveOldHotPosts(
    accessToken,
    refreshToken,
    location,
    lastPostID
) {
    return function(dispatch) {
        return Network.getOldHotPosts(
            accessToken,
            refreshToken,
            location,
            lastPostID
        ).then(
            posts => {
                dispatch(saveOldHotPosts(posts));
            },
            err => console.log(err)
        );
    };
}
export function getAndSaveHotPosts(accessToken, refreshToken) {
    return function(dispatch) {
        dispatch(gettingPosts());
        return Helpers.getLocation().then(
            location => {
                return Network.getHotPosts(
                    location,
                    accessToken,
                    refreshToken
                ).then(
                    posts => {
                        dispatch(saveHotPosts(posts));
                    },
                    err => console.log(err)
                );
            },
            err => console.log(err)
        );
    };
}
export function getAndSaveMyPosts(accessToken, refreshToken) {
    return function(dispatch) {
        dispatch(gettingPosts());
        return Network.getMyPosts(accessToken, refreshToken).then(
            posts => {
                dispatch(saveMyPosts(posts));
            },
            err => console.log(err)
        );
    };
}
export function getAndSaveOldMyPosts(accessToken, refreshToken, lastpost) {
    return function(dispatch) {
        return Network.getOldMyPosts(accessToken, refreshToken, lastpost).then(
            posts => {
                dispatch(saveOldMyPosts(posts));
            },
            err => console.log(err)
        );
    };
}
export function updatePost(updatedPostID, likeStatus, likes) {
    return {
        type: UPDATE_POST,
        updatedPostID: updatedPostID,
        updatedPostLikes: likeStatus ? likes + 1 : likes - 1,
        likeStatus: likeStatus
    };
}
export function increasePostReplies(updatedPostID) {
    return {
        type: INCREASE_POST_REPLIES,
        updatedPostID: updatedPostID
    };
}
export function likePost(
    accessToken,
    refreshToken,
    location,
    postID,
    likeStatus,
    likes
) {
    return function(dispatch) {
        return Network.likePost(
            accessToken,
            refreshToken,
            location,
            postID,
            likeStatus
        ).then(
            res => dispatch(updatePost(postID, likeStatus, likes)),
            err => console.log(err)
        );
    };
}
export function signup(username, password) {
    return function(dispatch) {
        dispatch(signupWaiting());
        return Network.signup(username, password).then(
            response => dispatch(signupResponse(response)),
            err => console.log(err)
        );
    };
}
export function signupResponse(response) {
    if (!response) {
        return {
            type: SIGNUP_NETWORK_ERROR
        };
    }
    if (response.message === "ok") {
        return {
            type: SIGNUP_DONE,
            response: response
        };
    } else
        return {
            type: SIGNUP_FAIL
        };
}
export function signupWaiting() {
    return {
        type: SIGNUP_WAITING
    };
}
export function login(username, password) {
    return function(dispatch) {
        dispatch(loginWaiting());
        return Network.login(username, password).then(
            response => dispatch(loginResponse(response)),
            err => console.log(err)
        );
    };
}
export function loginWithToken(refreshToken) {
    return function(dispatch) {
        return Network.loginWithToken(refreshToken).then(
            response => dispatch(loginResponse(response)),
            err => console.log(err)
        );
    };
}
export function loginResponse(response) {
    if (!response)
        return {
            type: LOGIN_NETWORK_ERROR
        };
    if (response.message === "ok")
        return {
            type: LOGIN_DONE,
            response: response
        };
    else
        return {
            type: LOGIN_FAIL
        };
}
export function loginWaiting() {
    return {
        type: LOGIN_WAITING
    };
}
export function logout() {
    return {
        type: LOGOUT
    };
}
export function loginNetworkError() {
    return {
        type: LOGIN_NETWORK_ERROR
    };
}
export function signupNetworkError() {
    return {
        type: SIGNUP_NETWORK_ERROR
    };
}
