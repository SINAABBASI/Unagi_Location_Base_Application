import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Share,
    Button
} from "react-native";
import { likePost } from "../actions";
import { connect } from "react-redux";

import IconI from "react-native-vector-icons/Ionicons";

var Helpers = require("../helpers");
class PostItem extends Component {
    componentWillMount() {
        this.setState({ isLiked: this.props.isLiked });
        this.setState({ likes: this.props.likes });
    }
    componentWillReceiveProps(props) {
        if (!this.props.notConnected) {
            this.setState({ isLiked: props.isLiked });
            this.setState({ likes: props.likes });
        }
    }
    share() {
        Share.share(
            {
                message: this.props.label
            },
            {
                // Android only:
                dialogTitle: "منتشر کنید",
                // iOS only:
                excludedActivityTypes: [
                    "com.apple.UIKit.activity.PostToTwitter"
                ]
            }
        );
    }
    postTime() {
        var prevTime = new Date(this.props.date);
        var thisTime = new Date(); // now
        var time = Math.floor((thisTime.getTime() - prevTime.getTime()) / 1000);
        time += 5;
        if (time < 60) return time + " ثانیه پیش";
        time = Math.floor(time / 60);
        if (time < 60) return time + " دقیقه پیش";
        time = Math.floor(time / 60);
        if (time < 24) return time + " ساعت پیش";
        time = Math.floor(time / 24);
        if (time < 7) return time + " روز پیش";
        time = Math.floor(time / 7);
        return time + " هفته پیش";
    }

    likeChanged() {
        this.props.likePost(
            this.props.accessToken,
            this.props.refreshToken,
            this.props.location,
            this.props.id,
            !this.state.isLiked,
            this.props.likes
        );
        if (this.props.notConnected) {
            this.setState({ isLiked: !this.state.isLiked });
            this.setState({
                likes: this.state.isLiked
                    ? this.state.likes - 1
                    : this.state.likes + 1
            });
        }
    }
    render() {
        return (
            <View style={styles.postItem}>
                {!this.props.disableReply && <TouchableOpacity style = {{flex : 1}}
                    onPress={()=>
                    this.props.navigation.navigate("ReplyScreen", {
                                label: this.props.label,
                                accessToken: this.props.accessToken,
                                likes: this.state.likes,
                                id: this.props.id,
                                isLiked: this.state.isLiked,
                                date: this.props.date,
                                location: this.props.location,
                                autoFocus : false,
                            })
                     }
                  > 
                    <Text style={styles.postContent}>
                        {this.props.label}
                    </Text>
                 </TouchableOpacity>} 
                 {this.props.disableReply &&
                    <Text style={styles.postContent}>
                        {this.props.label}
                    </Text>      }
                <View
                    style={{
                        borderBottomColor: "rgb(226, 226, 226)",
                        borderBottomWidth: 2
                    }}
                />
                <View style={styles.bottomOfPost}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate("ReplyScreen", {
                                label: this.props.label,
                                accessToken: this.props.accessToken,
                                likes: this.state.likes,
                                id: this.props.id,
                                isLiked: this.state.isLiked,
                                date: this.props.date,
                                location: this.props.location,
                                cbs: this.props.cbs
                            });
                        }}
                    >
                        {!this.props.disableReply &&
                            <IconI
                                name="ios-chatbubbles-outline"
                                color="grey"
                                style={styles.replyIcon}
                                size={28}
                            />}
                    </TouchableOpacity>
                    <Text style={styles.replies}>
                        {Helpers.PersianNum(this.props.replies)}
                    </Text>
                    <TouchableOpacity onPress={() => this.likeChanged()}>
                        {!this.state.isLiked &&
                            <IconI
                                name="ios-heart-outline"
                                color="grey"
                                style={styles.likeIcon}
                                size={28}
                            />}
                        {this.state.isLiked &&
                            <IconI
                                name="ios-heart"
                                color="red"
                                style={styles.likedIcon}
                                size={28}
                            />}
                    </TouchableOpacity>
                    <Text style={styles.Likes}>
                        {Helpers.PersianNum(this.state.likes)}
                    </Text>
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={() => this.share()}
                    >
                        <IconI
                            name="ios-share-outline"
                            style={styles.shareIcon}
                            size={28}
                            color="grey"
                        />
                    </TouchableOpacity>
                    <Text style={styles.date}>
                        {Helpers.PersianNum(this.postTime())}
                    </Text>
                </View>
                {this.props.repliedTo &&
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate("ReplyScreen", {
                                label: this.props.label,
                                accessToken: this.props.accessToken,
                                likes: this.state.likes,
                                id: this.props.repliedTo,
                                isLiked: this.state.isLiked,
                                date: this.props.date,
                                location: this.props.location,
                                autoFocus : true
                            });
                        }}
                    >
                        <Text style={styles.fatherText} numberOfLines={1}>
                            {" در پاسخ به: " + this.props.fatherText}
                        </Text>
                    </TouchableOpacity>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    postItem: {
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 20,
        paddingTop: 15,
        paddingBottom: 10,
        backgroundColor: "#ffffff",
        flexDirection: "column",
        elevation: 4,
        borderTopWidth: 2,
        borderTopColor: "#709e3a"
    },
    postContent: {
        flex: 1,
        marginBottom: 5,
        fontFamily: "IRAN_Sans",
        color: "#212121"
    },
    likeIcon: {
        flex: 1,
        opacity: 0.6,
        marginLeft: 5,
        marginTop: 5
    },
    likedIcon: {
        flex: 1,
        marginLeft: 5,
        marginTop: 5
    },
    replyIcon: {
        flex: 1,
        marginRight: 5,
        marginTop: 5,
        opacity: 0.6
    },
    bottomOfPost: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 30
    },
    Likes: {
        fontFamily: "IRAN_Sans",
        fontSize: 13,
        flex: 1,
        marginLeft: 10,
        marginTop: 5
    },
    replies: {
        fontFamily: "IRAN_Sans",
        fontSize: 13,
        marginRight: 10,
        marginTop: 5
    },
    date: {
        color: "#aaa",
        marginTop: 5,
        fontFamily: "IRAN_Sans",
        fontSize: 13
    },
    shareIcon: {
        flex: 1,
        opacity: 0.6,
        marginTop: 5
    },
    shareButton: {
        //flex: 1,
        marginRight: 12
    },
    fatherText: {
        color: "#aaa",
        marginTop: 5,
        fontFamily: "IRAN_Sans",
        fontSize: 13
    }
});
mapStateToProps = state => {
    return {
        storeState: state
    };
};
export default connect(mapStateToProps, {
    likePost
})(PostItem);
