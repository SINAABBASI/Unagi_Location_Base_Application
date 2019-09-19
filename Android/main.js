import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
    TabNavigator,
    StackNavigator,
    NavigationActions
} from "react-navigation";
import {
    AppRegistry,
    StyleSheet,
    View,
    Button,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    AsyncStorage
} from "react-native";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import NormalPosts from "./components/NormalPosts";
import HotPosts from "./components/HotPosts";
import MyPosts from "./components/MyPosts";
import ReplyScreen from "./components/ReplyScreen";
import SendPostScreen from "./components/SendPostScreen";
import { logout } from "./actions";
import reducer from "./reducer";

import IconEnt from "react-native-vector-icons/Entypo";

const store = createStore(reducer, applyMiddleware(thunk));
const MainScreenNavigator = TabNavigator(
    {
        جدیدترین: { screen: NormalPosts },
        داغ‌ترین: { screen: HotPosts },
        "پست‌های من": { screen: MyPosts }
    },
    {
        tabBarPosition: "top",
        backBehavior: "none",
        tabBarOptions: {
            style: {
                backgroundColor: "#8BC34A"
            },
            labelStyle: {
                fontFamily: "IRAN_Sans",
                fontSize: 16,
                fontWeight: "bold"
            },
            indicatorStyle: {
                backgroundColor: "white"
            }
        }
    }
);
MainScreenNavigator.navigationOptions = props => {
    return {
        title: "اوناگی",
        headerStyle: {
            backgroundColor: "#8BC34A"
        },
        headerTitleStyle: {
            color: "#fff",
            fontFamily: "IRAN_Sans"
        },
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        "اوناگی",
                        " قصد خروج از حساب کاربری را دارید؟",
                        [
                            {
                                text: "خروج",
                                onPress: () => {
                                    store.dispatch(logout());
                                    const resetAction = NavigationActions.reset(
                                        {
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({
                                                    routeName: "LoginScreen"
                                                })
                                            ]
                                        }
                                    );
                                    props.navigation.dispatch(resetAction);
                                }
                            },
                            {
                                text: "خیر",
                                onPress: () => console.log("Cancel Pressed")
                            }
                        ],
                        { cancelable: false }
                    );
                }}
            >
                <IconEnt
                    name="log-out"
                    size={30}
                    color="white"
                    style={(stylesLogout = { marginRight: 15 })}
                />
            </TouchableOpacity>
        )
    };
};

var auth = true;
var App = null;
const setup = () => {
    class Root extends Component {
        componentWillMount() {
            var refreshToken = AsyncStorage.getItem(
                "refreshToken",
                (error, result) => {
                    if (!result) auth = false;
                    App = StackNavigator({
                        Home: {
                            screen: auth ? MainScreenNavigator : LoginScreen
                        },
                        SignUpPage: { screen: SignupScreen },
                        MainScreen: { screen: MainScreenNavigator },
                        SendPostScreen: { screen: SendPostScreen },
                        LoginScreen: { screen: LoginScreen },
                        ReplyScreen: { screen: ReplyScreen }
                    });
                    this.forceUpdate();
                }
            );
        }
        render() {
            if (!App) return null;
            return (
                <Provider store={store}>
                    <App />
                </Provider>
            );
        }
    }
    return Root;
};
AppRegistry.registerComponent("RahnemaTeam2App", setup);
