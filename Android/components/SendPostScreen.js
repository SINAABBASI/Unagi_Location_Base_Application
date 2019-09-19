import React, { Component } from "react";
import { addPost } from "../network";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Image,
    TouchableOpacity,
    ToastAndroid
} from "react-native";

import IconM from "react-native-vector-icons/MaterialIcons";

var Helpers = require("../helpers");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#DCEDC8"
    },
    sendButton: {
        marginRight: 15,
        opacity: 1
    },
    sendButtonDisabled: {
        marginRight: 15,
        opacity: 0.4
    },
    textInput: {
        backgroundColor: "#DCEDC8",
        color: "black",
        marginRight: 10,
        marginLeft: 10,
        textAlignVertical: "top",
        fontFamily: "IRAN_Sans",
        fontSize: 15,
        height: "100%"
    },
    headerRight: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    charLimit: {
        marginRight: 10,
        marginTop: 4.5,
        color: "#FFF",
        fontSize: 19,
        fontFamily: "IRAN_Sans",
        fontWeight: "bold"
    },
    charLimitRed: {
        marginRight: 10,
        marginTop: 4.5,
        color: "red",
        fontSize: 19,
        fontFamily: "IRAN_Sans",
        fontWeight: "bold"
    }
});
var charLimit = 160;

export default class SendPostScreen extends Component {
    componentWillMount() {
        this.props.navigation.setParams({
            charLimit: 160
        });
    }
    static navigationOptions = props => {
        var limit = 160;
        if (props.navigation.state.params) {
            limit = props.navigation.state.params.charLimit;
        }
        return {
            title: "افزودن پست",
            headerStyle: {
                backgroundColor: "#8BC34A"
            },
            headerTitleStyle: {
                color: "#fff",
                fontFamily: "IRAN_Sans"
            },
            headerTintColor: "white",
            headerRight: (
                <View style={styles.headerRight}>
                    {limit >= 0 &&
                        <Text style={styles.charLimit}>
                            {" "}{Helpers.PersianNum(limit)}{" "}
                        </Text>}
                    {limit < 0 &&
                        <Text style={styles.charLimitRed}>
                            {" "}{Helpers.PersianNum(limit)}{" "}
                        </Text>}
                    {limit >= 0 &&
                        limit !== 160 &&
                        <TouchableOpacity
                            onPress={() => {
                                addPost(
                                    props.navigation.state.params.accessToken,
                                    props.navigation.state.params.refreshToken,
                                    props.navigation.state.params.location,
                                    props.navigation.state.params.text
                                )
                                    .then(function(res) {
                                        return res.json();
                                    })
                                    .then(function(res) {
                                        ToastAndroid.showWithGravity(
                                            res.status == 0
                                                ? "پست فرستاده شد"
                                                : "ارسال پست با مشکل مواجه شد",
                                            ToastAndroid.SHORT,
                                            ToastAndroid.BOTTOM
                                        );
                                        if (res.status == 0) {
                                            props.navigation.goBack();
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            }}
                        >
                            <IconM
                                name="send"
                                style={styles.sendButton}
                                color="white"
                                size={30}
                            />
                        </TouchableOpacity>}
                    {(limit < 0 || limit === 160) &&
                        <TouchableOpacity disabled={true}>
                            <IconM
                                name="send"
                                style={styles.sendButtonDisabled}
                                color="white"
                                size={30}
                            />
                        </TouchableOpacity>}
                </View>
            )
        };
    };
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    autoFocus={true}
                    {...this.props}
                    editable={true}
                    multiline={true}
                    placeholder="جدید مدید چه خبر...؟!"
                    placeholderTextColor="#757575"
                    underlineColorAndroid="transparent"
                    numberOfLines={7}
                    onChangeText={text => {
                        this.setState({ text });
                        this.props.navigation.setParams({
                            charLimit: 160 - text.length,
                            text
                        });
                    }}
                />
            </View>
        );
    }
}
