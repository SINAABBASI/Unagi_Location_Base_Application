import {
    TabNavigator,
    StackNavigator,
    NavigationActions
} from "react-navigation";
import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    AsyncStorage,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from "react-native";
// import { signup } from "../../network";
var Helpers = require("../helpers");
import { signup } from "../actions";
import { connect } from "react-redux";

import IconM from "react-native-vector-icons/MaterialIcons";

var Validator = require("email-validator");

const { width, height } = Dimensions.get("window");

class SignupScreen extends Component {
    constructor() {
        super();
        this.state = { animating: false, isSignupDisabled: false };
    }
    validate(username, password, email) {
        if (this.state.password != this.state.repeatPassword) {
            Alert.alert(null, "رمز عبور و تکرار آن تطابق ندارند");
            return false;
        }
        if (!Helpers.ValidateUsername(this.state.username)) {
            Alert.alert(
                null,
                "نام کاربری باید حداقل  6 کاراکتر و شامل حروف انگلیسی باشد"
            );
            return false;
        }
        if (!Helpers.ValidatePassword(this.state.password)) {
            Alert.alert(
                null,
                "گذرواژه باید حداقل 6 کاراکتر و شامل حروف انگلیسی بزرگ و کوچک و اعداد باشد"
            );
            return false;
        }
        if (!Helpers.ValidateEmail(this.state.email)) {
            Alert.alert(null, "ایمیل معتبر نیست");
            return false;
        }
        if (this.state.username == this.state.password) {
            Alert.alert(null, "نام کاربری و گذرواژه نباید مطابق هم باشند");
            return false;
        }
        return true;
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
        headerTintColor: "white"
    };
    componentWillReceiveProps(props) {
        this.setState({ animating: false });
        if (props.storeState) {
            if (props.storeState.inSignupScreen) {
                if (props.storeState.signupStatus) {
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
                } else if (props.storeState.signupNetworkError) {
                    Alert.alert(null, "مشکل در ارتباط با سرور");
                } else if (props.storeState.signupWaiting) {
                    this.setState({ animating: true });
                    return;
                } else {
                    Alert.alert(null, ".این نام‌کاربری قبلاً گرفته شده است");
                    this.setState({ animating: false });
                }
            }
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={Platform.select({
                    ios: () => 0,
                    android: () => 450
                })()}
                style={styles.background}
            >
                <View style={styles.container}>
                    <View style={styles.headerTitleView}>
                        <Text style={styles.titleViewText}>ثبت نام</Text>
                    </View>
                    {this.state.animating &&
                        <ActivityIndicator animating={true} size="small" />}
                    <View style={styles.inputsContainer}>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconContainer}>
                                <IconM
                                    name="person-outline"
                                    color="white"
                                    size={25}
                                />
                            </View>
                            <TextInput
                                style={[styles.input, styles.whiteFont]}
                                placeholder="نام کاربری"
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#757575"
                                returnKeyType="next"
                                onSubmitEditing={() => this.emailInput.focus()}
                                onChangeText={username =>
                                    this.setState({ username })}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconContainer}>
                                <IconM
                                    name="mail-outline"
                                    color="white"
                                    size={25}
                                />
                            </View>
                            <TextInput
                                style={[styles.input, styles.whiteFont]}
                                placeholder="ایمیل"
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#757575"
                                ref={input => (this.emailInput = input)}
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    this.passwordInput.focus()}
                                keyboardType="email-address"
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconContainer}>
                                <IconM
                                    name="lock-outline"
                                    color="white"
                                    size={25}
                                />
                            </View>
                            <TextInput
                                secureTextEntry={true}
                                style={[styles.input, styles.whiteFont]}
                                placeholder="گذرواژه"
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#757575"
                                ref={input => (this.passwordInput = input)}
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    this.repeatPasswordInput.focus()}
                                onChangeText={password =>
                                    this.setState({ password })}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.iconContainer}>
                                <IconM
                                    name="lock-outline"
                                    color="white"
                                    size={25}
                                />
                            </View>
                            <TextInput
                                secureTextEntry={true}
                                style={[styles.input, styles.whiteFont]}
                                placeholder="تکرار گذرواژه"
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#757575"
                                ref={input =>
                                    (this.repeatPasswordInput = input)}
                                returnKeyType="go"
                                onChangeText={repeatPassword =>
                                    this.setState({ repeatPassword })}
                            />
                        </View>
                    </View>
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            disabled={
                                !(
                                    this.state.username &&
                                    this.state.password &&
                                    this.state.password &&
                                    this.state.repeatPassword
                                )
                            }
                            onPress={() => {
                                if (
                                    this.validate(
                                        this.state.username,
                                        this.state.password,
                                        this.state.email
                                    )
                                )
                                    this.props.signup(
                                        this.state.username,
                                        this.state.password
                                    );
                            }}
                        >
                            <View
                                style={
                                    this.state.username &&
                                    this.state.password &&
                                    this.state.password &&
                                    this.state.repeatPassword
                                        ? styles.button
                                        : styles.buttonDisabled
                                }
                            >
                                <Text style={styles.buttonText}>تایید</Text>
                            </View>
                        </TouchableOpacity>
                        <View />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        backgroundColor: "#212121",
        width,
        height,
        padding: 10
    },
    inputsContainer: {
        flex: 3,
        marginTop: 50
    },
    footerContainer: {
        flex: 2
    },

    headerTitleView: {
        marginTop: 20,
        alignItems: "center"
    },
    titleViewText: {
        color: "#8BC34A",
        fontSize: 40,
        fontFamily: "IRAN_Sans"
    },
    inputContainer: {
        borderWidth: 2,
        borderBottomColor: "#8BC34A",
        borderColor: "transparent",
        flexDirection: "row",
        height: 55
    },
    iconContainer: {
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        height: 40,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: "IRAN_Sans",
        color: "#FFF",
        textAlign: "right",
        marginBottom: 20
    },
    buttonDisabled: {
        backgroundColor: "#689F38",
        opacity: 0.4,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center"
        // marginBottom: 20
    },
    button: {
        backgroundColor: "#689F38",
        opacity: 1,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center"
        // marginBottom: 20
    },

    whiteFont: {
        color: "#FFF"
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "IRAN_Sans"
    }
});
mapStateToProps = state => {
    return {
        storeState: state
    };
};
export default connect(mapStateToProps, {
    signup
})(SignupScreen);
