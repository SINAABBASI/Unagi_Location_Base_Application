import React, { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import ActionButton from "react-native-action-button";
import { StyleSheet, View, Image, FlatList, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import {
    getAndSaveUniqueID,
    getAndSavePosts,
    getAndSaveOldPosts,
    updatePost,
    likePost,
    loginWithToken
} from "../actions";
import SendPostScreen from "./SendPostScreen";
import PostItem from "./PostItem";
import PostsList from "./PostsList";

import IconM from "react-native-vector-icons/MaterialIcons";

var Network = require("../network");
var Helpers = require("../helpers");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#DCEDC8",
        padding: 5
    }
});
class NormalPosts extends Component {
    constructor() {
        super();
        this.state = { isFabDisabled: false, fabColor: Helpers.RandomColor() };
    }
    componentDidMount() {
        if (!this.props.storeState) {
            AsyncStorage.getItem("refreshToken", (err, refreshToken) => {
                if (refreshToken) {
                    AsyncStorage.getItem("accessToken", (err, accessToken) => {
                        if (accessToken)
                            this.props.loginWithToken(
                                refreshToken,
                                accessToken
                            );
                        this.props.getAndSavePosts(accessToken, refreshToken);
                    });
                }
            });
        } else {
            this.props.getAndSavePosts(
                this.props.storeState.accessToken,
                this.props.storeState.refreshToken
            );
        }
    }
    render() {
        if (!this.props.storeState) return null;
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <PostsList
                    items={this.props.storeState.items}
                    getAndSavePosts={this.props.getAndSavePosts}
                    getAndSaveOldPosts={this.props.getAndSaveOldPosts}
                    location={this.props.storeState.location}
                    refreshToken={this.props.storeState.refreshToken}
                    accessToken={this.props.storeState.accessToken}
                    navigation={this.props.navigation}
                    mainScreen={true}
                    refreshing={this.props.storeState.refreshing}
                />
                <ActionButton
                    buttonColor={this.state.fabColor}
                    icon={<IconM name="create" color="white" size={30} />}
                    onPress={() => {
                        if (!this.state.isFabDisabled) {
                            this.setState({ isFabDisabled: true });
                            navigate("SendPostScreen", {
                                accessToken: this.props.storeState.accessToken,
                                refreshToken: this.props.storeState
                                    .refreshToken,
                                location: this.props.storeState.location
                            });
                            setTimeout(
                                () => this.setState({ isFabDisabled: false }),
                                1000
                            );
                        }
                    }}
                />
            </View>
        );
    }
}
mapStateToProps = state => {
    return {
        storeState: state
    };
};
export default connect(mapStateToProps, {
    getAndSaveUniqueID,
    getAndSavePosts,
    getAndSaveOldPosts,
    updatePost,
    loginWithToken
})(NormalPosts);
