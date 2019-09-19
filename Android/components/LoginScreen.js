import {
    TabNavigator,
    StackNavigator,
    NavigationActions
} from "react-navigation";
import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    Alert,
    TouchableHighlight,
    KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import { login } from "../actions";

import IconI from "react-native-vector-icons/Ionicons";
import IconM from "react-native-vector-icons/MaterialIcons";

var Network = require("../network");

const { width, height } = Dimensions.get("window");

const logo = require("../images/login1_mark.png");
var hidden;
var animating = false;
class LoginScreen extends Component {
    constructor() {
        super();
        this.state = {
            animating: false,
            hidden: true,
            isSignupDisabled: false,
            isLoginDisabled: false
        };
    }
    static navigationOptions = {
        title: "اوناگی",
        headerStyle: {
            backgroundColor: "#8BC34A"
        },
        headerTitleStyle: {
            color: "#fff",
            fontFamily: "IRAN_Sans"
        },
        headerLeft: null
    };
    componentWillReceiveProps(props) {
        this.setState({ animating: false });
        if (props.storeState) {
            if (props.storeState.inLoginScreen) {
                if (props.storeState.loginStatus) {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: "MainScreen"
                            })
                        ]
                    });
                    this.props.navigation.dispatch(resetAction);
                    AsyncStorage.setItem(
                        "refreshToken",
                        props.storeState.refreshToken
                    );
                    AsyncStorage.setItem(
                        "accessToken",
                        props.storeState.accessToken
                    );
                    return;
                } else if (props.storeState.loginNetworkError) {
                    Alert.alert(null, "مشکل در ارتباط با سرور");
                } else if (props.storeState.loginWaiting) {
                    this.setState({ animating: true });
                    return;
                } else {
                    Alert.alert(null, "کلمه عبور یا نام‌کاربری اشتباه است");
                    this.setState({ animating: false });
                    return;
                }
            }
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.background}>
                <View style={styles.container}>
                    <View style={styles.logoWrap}>
                        <Image
                            source={logo}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>به اوناگی خوش آمدید</Text>
                    </View>
                    {this.state.animating &&
                        <ActivityIndicator animating={true} size="small" />}
                    <View style={styles.wrapper}>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <IconM
                                    name="person-outline"
                                    color="white"
                                    size={25}
                                />
                            </View>
                            <TextInput
                                placeholder=" حساب کاربری"
                                placeholderTextColor="#757575"
                                underlineColorAndroid="transparent"
                                style={styles.input}
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    this.passwordInput.focus()}
                                keyboardType="email-address"
                                onChangeText={username =>
                                    this.setState({ username })}
                            />
                        </View>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <TouchableHighlight
                                    onPressIn={() =>
                                        this.setState({
                                            hidden: false
                                        })}
                                    onPressOut={() =>
                                        this.setState({
                                            hidden: true
                                        })}
                                >
                                    <IconI
                                        name={
                                            this.state.hidden
                                                ? "md-eye"
                                                : "md-eye-off"
                                        }
                                        color="white"
                                        size={25}
                                    />
                                </TouchableHighlight>
                            </View>
                            <TextInput
                                placeholderTextColor="#757575"
                                placeholder="رمزعبور "
                                underlineColorAndroid="transparent"
                                style={styles.input}
                                secureTextEntry={this.state.hidden}
                                autoFocus={false}
                                returnKeyType="go"
                                ref={input => (this.passwordInput = input)}
                                onChangeText={password =>
                                    this.setState({ password })}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.5} />
                        <TouchableOpacity
                            disabled={
                                !(this.state.username && this.state.password)
                            }
                            onPress={() => {
                                if (!this.state.isLoginDisabled) {
                                    this.setState({
                                        isLoginDisabled: true
                                    });
                                    if (this.state) {
                                        if (
                                            this.state.username &&
                                            this.state.password
                                        ) {
                                            this.props.login(
                                                this.state.username,
                                                this.state.password
                                            );
                                        }
                                    }
                                    setTimeout(
                                        () =>
                                            this.setState({
                                                isLoginDisabled: false
                                            }),
                                        100
                                    );
                                }
                            }}
                        >
                            <View
                                style={
                                    this.state.username && this.state.password
                                        ? styles.button
                                        : styles.buttonDisabled
                                }
                            >
                                <Text style={styles.buttonText}>ورود</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.signupWrap}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    if (!this.state.isSignupDisabled) {
                                        this.setState({
                                            isSignupDisabled: true
                                        });
                                        navigate("SignUpPage", {});
                                        setTimeout(
                                            () =>
                                                this.setState({
                                                    isSignupDisabled: false
                                                }),
                                            1000
                                        );
                                    }
                                }}
                            >
                                <View>
                                    <Text style={styles.signupLinkText}>
                                        ثبت نام
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.accountText}>
                                حساب کاربری ندارید؟
                            </Text>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 3
    },
    title: {
        color: "rgba(255,255,255,0.7)",
        marginTop: 10,
        fontFamily: "IRAN_Sans",
        fontWeight: "bold",
        fontSize: 19
    },
    logoWrap: {
        alignItems: "center",
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 30
    },
    logo: {
        width: 100,
        height: 100,
        flex: 1
    },
    background: {
        backgroundColor: "#212121",
        width,
        height,
        padding: 10
    },
    wrapper: {
        paddingVertical: 30
    },
    inputWrap: {
        flexDirection: "row",
        marginVertical: 10,
        height: 55,
        borderBottomWidth: 2,
        padding: 2,
        borderBottomColor: "#8BC34A"
    },
    iconWrap: {
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        height: 40,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 15,
        fontFamily: "IRAN_Sans",
        fontWeight: "bold",
        color: "#FFF",
        textAlign: "right",
        marginBottom: 20
    },
    button: {
        backgroundColor: "#689F38",
        opacity: 1,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    buttonDisabled: {
        backgroundColor: "#689F38",
        opacity: 0.4,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontFamily: "IRAN_Sans",
        fontWeight: "bold"
    },
    forgotPasswordText: {
        color: "white",
        backgroundColor: "transparent",
        textAlign: "left",
        paddingLeft: 15,
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: "IRAN_Sans"
    },
    signupWrap: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    accountText: {
        color: "#757575",
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: "IRAN_Sans"
    },
    signupLinkText: {
        color: "#FFF",
        marginRight: 5,
        fontWeight: "bold",
        fontFamily: "IRAN_Sans",
        fontSize: 15
    }
});
mapStateToProps = state => {
    return {
        storeState: state
    };
};
export default connect(mapStateToProps, {
    login
})(LoginScreen);
