import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { connect } from "react-redux";
import {
    getAndSaveUniqueID,
    getAndSaveMyPosts,
    getAndSaveOldMyPosts,
    updatePost,
    likePost
} from "../actions";
import ActionButton from "react-native-action-button";
import PostsList from "./PostsList";
import IconM from "react-native-vector-icons/MaterialIcons";
var Helpers = require("../helpers");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#DCEDC8"
    }
});
var myLocation = { latitude: 35.7293756, longitude: 51.42246219 };
class MyPosts extends Component {
    constructor() {
        super();
        this.state = { isFabDisabled: false, fabColor: Helpers.RandomColor() };
    }
    componentDidMount() {
        if (this.props.storeState) {
            this.props.getAndSaveMyPosts(
                this.props.storeState.accessToken,
                this.props.storeState.refreshToken
            );
        }
    }
    render() {
        if (!this.props.storeState) {
            return null;
        }
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <PostsList
                    items={this.props.storeState.myItems}
                    getAndSavePosts={this.props.getAndSaveMyPosts}
                    getAndSaveOldPosts={this.props.getAndSaveOldMyPosts}
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
    getAndSaveMyPosts,
    getAndSaveOldMyPosts,
    updatePost
})(MyPosts);
