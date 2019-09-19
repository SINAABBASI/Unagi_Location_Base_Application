import React, { Component } from "react";
import Fetch from "react-native-fetch";
var serverPath = "http://45.55.213.147";
export function getPosts(location, accessToken, refreshToken) {
    return fetch(serverPath + "/post", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            location: JSON.stringify(location),
            accesstoken: accessToken
            // refreshtoken: refreshToken
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res.posts);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function login(username, password) {
    return fetch(serverPath + "/auth/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            type: "password"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function loginWithToken(refreshToken, accessToken) {
    return fetch(serverPath + "/auth/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            type: "token",
            refreshtoken: refreshToken,
            accesstoken: accessToken
        },
        body: JSON.stringify({
            username: "a",
            password: "a"
        })
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function signup(username, password) {
    return fetch(serverPath + "/auth/register ", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function getOldPosts(accessToken, refreshToken, location, lastpost) {
    return fetch(serverPath + "/post", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            location: JSON.stringify(location),
            lastpost: lastpost,
            accesstoken: accessToken
            // refreshtoken: refreshToken
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res.posts);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function addPost(accessToken, refreshToken, location, text) {
    return fetch(serverPath + "/post", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            accesstoken: accessToken,
            // refreshtoken: refreshToken,
            location: JSON.stringify(location)
        },
        body: JSON.stringify({
            text
        })
    });
}
export function likePost(accessToken, refreshToken, location, postId, like) {
    var requestMethod;
    like ? (requestMethod = "PUT") : (requestMethod = "DELETE");
    return fetch(serverPath + "/post/" + postId + "/like", {
        method: requestMethod,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            accesstoken: accessToken,
            // refreshtoken: refreshToken,
            location: JSON.stringify(location)
        }
    })
        .then(function(res) {
            // console.log("Response" , res);
            return;
        })
        .then(function(res) {
            return;
        })
        .catch(err => {
            console.log(err);
        });
}
export function getHotPosts(location, accessToken, refreshToken) {
    return fetch(serverPath + "/post/hot", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            location: JSON.stringify(location),
            accesstoken: accessToken
            // refreshtoken: refreshToken
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res.posts);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function getMyPosts(accessToken, refreshToken) {
    location = { latitude: 1, longitude: 1 };
    return fetch(serverPath + "/user/post", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            location: JSON.stringify(location),
            accesstoken: accessToken,
            refreshtoken: refreshToken
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res.posts);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function getOldMyPosts(accessToken, refreshToken, lastpost) {
    location = { latitude: 1, longitude: 1 };
    return fetch(serverPath + "/user/post", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            location: JSON.stringify(location),
            accesstoken: accessToken,
            refreshtoken: refreshToken,
            lastpost: lastpost
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res.posts);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function getOldHotPosts(accessToken, refreshToken, location, lastpost) {
    return fetch(serverPath + "/post/hot", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            accesstoken: accessToken,
            // refreshtoken: refreshToken,
            location: JSON.stringify(location),
            lastpost: lastpost
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res.posts);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function logout(accessToken, refreshToken) {
    // console.log("PARAMETERS", accessToken, refreshToken);
    return fetch(serverPath + "/auth/logout", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            type: "token",
            refreshtoken: refreshToken,
            accesstoken: accessToken
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function getReplies(postID, accessToken, location) {
    return fetch(serverPath + "/post/" + postID, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            type: "token",
            accesstoken: accessToken,
            location: JSON.stringify(location)
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function getOldReplies(postID, accessToken, location, lastpost) {
    return fetch(serverPath + "/post/" + postID, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            type: "token",
            accesstoken: accessToken,
            location: JSON.stringify(location),
            lastpost: lastpost
        }
    })
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        })
        .catch(err => {
            console.log(err);
        });
}
export function sendReply(postID, text, accessToken, location) {
    return fetch(serverPath + "/post/" + postID + "/reply", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            accesstoken: accessToken,
            // refreshtoken: refreshToken,
            location: JSON.stringify(location)
        },
        body: JSON.stringify({
            text
        })
    })
        .then(function(res) {
            // console.log("Response" , res);
            return;
        })
        .then(function(res) {
            // func();
            return;
        })
        .catch(err => {
            console.log(err);
        });
}
