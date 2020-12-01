import React from "react";
import BaseScreen from "../utils/BaseScreen";
import {
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Container, Icon, Button, Form, Item, Input, Toast } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Api from "../api";
import storage from "../store/storage";
import { FBLoginManager } from "react-native-facebook-login";
import FastImage from "react-native-fast-image";
import { ENABLE_FB_LOGIN } from "../config";

class AuthScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      currentPage: this.props.navigation.getParam("page", "login"),
      loading: false,
      position: 0,
      image: this.props.setup.slide_image_1
        ? this.props.setup.slide_image_1
        : require("../images/topo1.png"),
      username: "",
      password: "",
      email: "",
      name: "",
    };

    setInterval(() => {
      let dPosition = 0;
      let dImage = this.props.setup.slide_image_1
        ? this.props.setup.slide_image_1
        : require("../images/topo1.png");
      if (this.state.position === 0) {
        dPosition = 1;
        dImage = this.props.setup.slide_image_2
          ? this.props.setup.slide_image_2
          : require("../images/topo2.png");
      } else if (this.state.position === 1) {
        dPosition = 2;
        dImage = this.props.setup.slide_image_3
          ? this.props.setup.slide_image_3
          : require("../images/topo3.png");
      } else if (this.state.position === 2) {
        dPosition = 0;
        dImage = this.props.setup.slide_image_1
          ? this.props.setup.slide_image_1
          : require("../images/topo1.png");
      }
      this.updateState({
        image: dImage,
        position: dPosition,
      });
    }, 3000);
  }

  submitLogin() {
    if (this.state.username === "") {
      Toast.show({
        text: lang.getString("enter-your-username"),
        type: "danger",
      });
      return false;
    }
    if (this.state.password === "") {
      Toast.show({
        text: lang.getString("enter-your-password"),
        type: "danger",
      });
      return false;
    }
    this.updateState({ loading: true });
    Api.get("login", {
      username: encodeURI(this.state.username),
      password: encodeURI(this.state.password),
      device: encodeURI(this.device),
    })
      .then((result) => {
        this.updateState({ loading: false });
        if (result.status === 1) {
          //success signup and logged in
          storage.set("user_name", result.full_name);
          storage.set("avatar", result.avatar);
          storage.set("cover", result.cover);
          storage.set("userid", result.id);
          storage.set("api_key", result.key);
          storage.set("did_getstarted", "1");
          this.props.dispatch({
            type: "SET_AUTH_DETAILS",
            payload: {
              userid: result.id,
              username: result.full_name,
              password: result.password,
              avatar: result.avatar,
              cover: result.cover,
              apikey: result.key,
              language: this.props.language,
              theme: this.props.theme,
              setup: this.props.setup,
            },
          });
          this.props.navigation.navigate("feed");
        } else {
          Toast.show({
            text: lang.getString("invalid-login-details"),
            type: "danger",
          });
        }
      })
      .catch(() => this.updateState({ loading: false }));
  }

  submitSignup() {
    if (this.state.username === "") {
      Toast.show({
        text: lang.getString("provide-your-username"),
        type: "danger",
      });
      return false;
    }

    if (this.state.email === "") {
      Toast.show({
        text: lang.getString("provide-your-email"),
        type: "danger",
      });
      return false;
    }
    if (this.state.name === "") {
      Toast.show({
        text: lang.getString("provide-your-fullname"),
        type: "danger",
      });
      return false;
    }
    if (this.state.password === "") {
      Toast.show({
        text: lang.getString("choose-your-password"),
        type: "danger",
      });
      return false;
    }
    this.updateState({ loading: true });

    Api.get("signup", {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      full_name: this.state.name,
      device: this.device,
    })
      .then((result) => {
        this.updateState({ loading: false });
        if (result.status === 1) {
          //success signup and logged in
          Toast.show({
            text: lang.getString("register-successful"),
            type: "info",
          });

          storage.set("user_name", result.full_name);
          storage.set("avatar", result.avatar);
          storage.set("cover", result.cover);
          storage.set("userid", result.id);
          storage.set("api_key", result.key);

          this.props.dispatch({
            type: "SET_AUTH_DETAILS",
            payload: {
              userid: result.id,
              username: result.full_name,
              password: result.password,
              avatar: result.avatar,
              cover: result.cover,
              apikey: result.key,
              language: this.props.language,
              theme: this.props.theme,
              setup: this.props.setup,
            },
          });

          this.props.navigation.navigate("welcome");
        } else if (result.status === 2) {
          //user need to activate account
          Toast.show({
            text: lang.getString("please-confirm-email-register"),
            type: "info",
          });
          this.props.navigation.navigate("home");
        } else {
          //problem
          Toast.show({
            text: result.message,
            type: "danger",
          });
        }
      })
      .catch(() => this.updateState({ loading: false }));
  }

  render() {
    const resizeMode = "cover";
    return this.showContent(
      <Container style={{ flex: 1 }}>
        <Spinner
          visible={this.state.loading}
          textContent={""}
          textStyle={{ color: "#FFF" }}
        />
        <View style={{ flex: 1 }}>
          <Image
            style={{ flex: 1, resizeMode, width: null, height: null }}
            source={require("../images/bg.jpeg")}
          />

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <ScrollView
              bounces={false}
              style={{ flex: 1, flexDirection: "column" }}
            >
              <View
                style={{
                  flex: 1,
                  padding: 20,
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Icon
                    name="arrow-left"
                    type="SimpleLineIcons"
                    style={{ fontSize: 20, color: "#FFF" }}
                  />
                </TouchableOpacity>
                <Text
                  style={{ fontSize: 20, color: "white", fontWeight: "600" }}
                >
                  {this.state.currentPage === "login"
                    ? lang.getString("login")
                    : "Registration"}
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Icon
                    name="close"
                    type="SimpleLineIcons"
                    style={{ fontSize: 20, color: "#FFF" }}
                  />
                </TouchableOpacity>
              </View>

              <Image
                source={require("../images/white.png")}
                style={{
                  width: 250,
                  marginTop: 100,
                  height: 120,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: 30,
                }}
              >
                {this.state.currentPage === "login" ? (
                  <View>
                    <Form>
                      <Item
                        style={{
                          marginBottom: 10,
                          backgroundColor: "#FFF",
                          paddingLeft: 7,
                        }}
                      >
                        <Input
                          style={{ color: "grey" }}
                          placeholder={lang.getString("username")}
                          onChangeText={(t) =>
                            this.updateState({ username: t })
                          }
                        />
                      </Item>
                      <Item
                        style={{
                          marginBottom: 20,
                          backgroundColor: "#FFF",
                          paddingLeft: 7,
                        }}
                      >
                        <Input
                          secureTextEntry
                          placeholder={lang.getString("password")}
                          style={{ color: "grey" }}
                          onChangeText={(t) =>
                            this.updateState({ password: t })
                          }
                        />
                      </Item>
                    </Form>

                    <TouchableOpacity onPress={() => this.submitLogin()}>
                      <ImageBackground
                        source={require("../images/btn.png")}
                        style={{
                          width: 300,
                          alignItems: "center",
                          marginTop: 10,
                          height: 40,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            fontSize: 18,
                            color: "#fff",
                          }}
                        >
                          {lang.getString("login")}
                        </Text>
                      </ImageBackground>
                    </TouchableOpacity>

                    <View
                      style={{
                        flex: 1,
                        padding: 20,
                        marginTop: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 12,
                          color: "grey",
                        }}
                      >
                        {"Do not have an account?"}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          this.updateState({ currentPage: "signup" })
                        }
                      >
                        <Text
                          style={{
                            alignSelf: "flex-start",
                            fontSize: 12,
                            color: "black",
                            marginLeft: 5,
                            textDecorationLine: "underline",
                            fontWeight: "bold",
                          }}
                        >
                          {"Registration"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                {this.state.currentPage === "signup" ? (
                  <View>
                    <Form style={{ marginTop: 30 }}>
                      <Item
                        style={{
                          marginBottom: 10,
                          backgroundColor: "#FFF",
                          paddingLeft: 7,
                        }}
                      >
                        <Input
                          style={{ color: "black" }}
                          placeholder={lang.getString("fullname")}
                          onChangeText={(t) => this.updateState({ name: t })}
                        />
                      </Item>
                      <Item
                        style={{
                          marginBottom: 10,
                          backgroundColor: "#FFF",
                          paddingLeft: 7,
                        }}
                      >
                        <Input
                          style={{ color: "black" }}
                          placeholder={lang.getString("username")}
                          onChangeText={(t) =>
                            this.updateState({ username: t })
                          }
                        />
                      </Item>
                      <Item
                        style={{
                          marginBottom: 10,
                          backgroundColor: "#FFF",
                          paddingLeft: 7,
                        }}
                      >
                        <Input
                          style={{ color: "black" }}
                          placeholder={lang.getString("email-address")}
                          onChangeText={(t) => this.updateState({ email: t })}
                        />
                      </Item>
                      <Item
                        style={{
                          marginBottom: 20,
                          backgroundColor: "#FFF",
                          paddingLeft: 7,
                        }}
                      >
                        <Input
                          secureTextEntry
                          placeholder={lang.getString("password")}
                          style={{ color: "black" }}
                          onChangeText={(t) =>
                            this.updateState({ password: t })
                          }
                        />
                      </Item>
                    </Form>

                    <TouchableOpacity onPress={() => this.submitSignup()}>
                      <ImageBackground
                        source={require("../images/btn.png")}
                        style={{
                          width: 300,
                          alignItems: "center",
                          marginTop: 10,
                          height: 40,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            fontSize: 18,
                            color: "#fff",
                          }}
                        >
                          {"Complete"}
                        </Text>
                      </ImageBackground>
                    </TouchableOpacity>

                    <View
                      style={{
                        flex: 1,
                        padding: 20,
                        marginTop: 10,
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 12,
                          color: "grey",
                        }}
                      >
                        {"Already have an account?"}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          this.updateState({ currentPage: "login" })
                        }
                      >
                        <Text
                          style={{
                            alignSelf: "flex-start",
                            fontSize: 12,
                            color: "black",
                            marginLeft: 5,
                            textDecorationLine: "underline",
                            fontWeight: "bold",
                          }}
                        >
                          {"Login"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </Container>
    );
  }

  fbLogin() {
    FBLoginManager.setLoginBehavior(
      Platform.OS === "ios"
        ? FBLoginManager.LoginBehaviors.Web
        : FBLoginManager.LoginBehaviors.WebView
    ); // defaults to Native
    let component = this;
    FBLoginManager.loginWithPermissions(["email"], function (error, data) {
      if (!error) {
        //console.log(data);
        var api = `https://graph.facebook.com/v2.3/${data.credentials.userId}/?fields=name,email&redirect=false&access_token=${data.credentials.token}`;

        fetch(api)
          .then((response) => response.json())
          .then((responseData) => {
            //console.log('fbing')
            component.updateState({ loading: true });
            let email = "";
            try {
              email = responseData.email;
            } catch (e) {}

            Api.get("social/signup", {
              device: component.device,
              full_name: responseData.name,
              email: email,
              fbid: responseData.id,
            })
              .then((result) => {
                component.updateState({ loading: false });
                if (result.status === 1) {
                  storage.set("user_name", result.full_name);
                  storage.set("avatar", result.avatar);
                  storage.set("cover", result.cover);
                  storage.set("userid", result.id);
                  storage.set("api_key", result.key);
                  storage.set("did_getstarted", "1");

                  component.props.dispatch({
                    type: "SET_AUTH_DETAILS",
                    payload: {
                      userid: result.id,
                      username: result.full_name,
                      password: result.password,
                      avatar: result.avatar,
                      cover: result.cover,
                      apikey: result.key,
                      language: component.props.language,
                      theme: component.props.theme,
                      setup: component.props.setup,
                    },
                  });

                  component.props.navigation.navigate("feed");
                }
              })
              .catch((e) => {
                //console.log(e);
                Toast.show({
                  text: "Problem connecting - " + e.message,
                  type: "danger",
                });
                component.updateState({ loading: false });
              });
          })
          .done();
      } else {
        //console.log("Error: ", error);
      }
    });
  }
}

export default connect((state) => {
  return {
    userid: state.auth.userid,
    avatar: state.auth.avatar,
    username: state.auth.username,
    apikey: state.auth.apikey,
    language: state.auth.language,
    cover: state.auth.cover,
    theme: state.auth.theme,
    setup: state.auth.setup,
  };
})(AuthScreen);
