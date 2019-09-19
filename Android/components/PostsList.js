import React, { Component } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    RefreshControl
} from "react-native";
import PostItem from "./PostItem";

export default class PostsList extends Component {
    constructor() {
        super();
    }
    _onRefresh = () => {
        this.props.getAndSavePosts(
            this.props.accessToken,
            this.props.refreshToken
        );
    };
    render() {
        if (
            (!this.props.items || this.props.items.length == 0) &&
            this.props.mainScreen
        ) {
            return (
                <TouchableOpacity
                    disabled={this.props.refreshing}
                    isP
                    style={styles.emptyTouchable}
                    onPress={() => this._onRefresh()}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {!this.props.refreshing &&
                            <Text style={styles.emptyText}>
                                {
                                    "پستی یافت نشد.برای تلاش دوباره صفحه را لمس کنید."
                                }
                            </Text>}
                        {this.props.refreshing &&
                            <Text style={styles.emptyText}>
                                {"در حال دریافت پست‌ها ..."}
                            </Text>}
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <View>
                <FlatList
                    data={this.props.items}
                    keyExtractor={item => Math.random()}
                    onEndReachedThreshold={0.5}
                    onEndReached={() =>
                        this.props.getAndSaveOldPosts(
                            this.props.accessToken,
                            this.props.refreshToken,
                            this.props.location,
                            this.props.items[this.props.items.length - 1]._id
                        )}
                    renderItem={({ item }) =>
                        <PostItem
                            id={item._id}
                            label={item.text}
                            isLiked={item.isLiked}
                            likes={item.likes}
                            replies={item.replies}
                            fatherText={item.fatherText}
                            location={this.props.location}
                            accessToken={this.props.accessToken}
                            refreshToken={this.props.refreshToken}
                            navigation={this.props.navigation}
                            date={item.date}
                            repliedTo={item.repliedTo}
                        />}
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                this.props.refreshing
                                    ? this.props.refreshing
                                    : false
                            }
                            onRefresh={() => this._onRefresh()}
                            colors={["white"]}
                            progressBackgroundColor="#8BC34A"
                        />
                    }
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    emptyTouchable: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    emptyText: {
        fontFamily: "IRAN_Sans",
        fontSize: 15
    }
});
