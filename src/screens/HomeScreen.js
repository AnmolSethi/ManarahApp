import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Container } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import { LANGUAGES } from "../config";
import { MenuOptions, MenuOption } from "react-native-popup-menu";
import storage from "../store/storage";

class HomeScreen extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      position: 0,
      image:
        this.props.setup !== undefined && this.props.setup.slide_image_1
          ? this.props.setup.slide_image_1
          : require("../images/topo1.png"),
      selectedLanguage: this.getCurrentLanguage(),
      typeText: lang.getString("welcome-note"),
    };
  }

  getCurrentLanguage() {
    for (let i = 0; i < LANGUAGES.length; i++) {
      if (this.props.language === LANGUAGES[i].key) return LANGUAGES[i];
    }
    return LANGUAGES[0];
  }

  render() {
    return this.showContent(
      <Container style={{ flex: 1, backgroundColor: this.theme.darkColor }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                padding: 30,
                paddingTop: 20,
              }}
            >
              <Image
                source={require("../images/logo.png")}
                style={{
                  marginTop: 120,
                  width: 138,
                  height: 104,
                  resizeMode: "contain",
                  alignSelf: "center",
                  flex: 1,
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  marginTop: 20,
                  marginBottom: 20,
                  fontSize: 20,
                  fontWeight: "500",
                  color: this.theme.brandPrimary,
                }}
              >
                {"Adibiat"}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("auth", { page: "login" })
                }
              >
                <View style={styles.button}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 18,
                      color: this.theme.textColor,
                    }}
                  >
                    {lang.getString("login")}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("auth", { page: "signup" })
                }
              >
                <View style={styles.button}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 18,
                      color: this.theme.textColor,
                    }}
                  >
                    {lang.getString("signup-for-account")}
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  padding: 10,
                }}
              >
                <Text style={{ color: this.theme.textColor }}>{"Or"}</Text>
              </View>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("explore")}
              >
                <View style={styles.button}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 18,
                      color: this.theme.textColor,
                    }}
                  >
                    {lang.getString("explore-music")}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{ flex: 1 }}></View>
            </View>
          </View>
        </View>
      </Container>
    );
  }

  languageOptions() {
    let views = [];

    for (let i = 0; i < LANGUAGES.length; i++) {
      let lan = LANGUAGES[i];
      views.push(
        <MenuOption
          onSelect={() => {
            storage.set("language", lan.key);
            lang.setLanguage(lan.key);
            this.forceUpdate();
            this.updateState({
              selectedLanguage: lan,
              typeText: lang.getString("welcome-note"),
            });

            this.props.dispatch({
              type: "SET_AUTH_DETAILS",
              payload: {
                userid: this.props.userid,
                username: this.props.username,
                avatar: this.props.avatar,
                apikey: this.props.apiKey,
                language: lan.key,
                theme: this.props.theme,
                setup: this.props.setup,
              },
            });
          }}
        >
          <View style={{ flexDirection: "row", padding: 5 }}>
            <Image
              source={lan.icon}
              style={{ width: 20, height: 15, marginTop: 2 }}
            />
            <Text style={{ fontSize: 15, marginLeft: 5 }}>{lan.name}</Text>
          </View>
        </MenuOption>
      );
    }

    return <MenuOptions>{views}</MenuOptions>;
  }
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    alignItems: "center",
    marginBottom: 10,
    height: 40,
    justifyContent: "center",
    backgroundColor: "#3F5C57",
  },
});

export default connect((state) => {
  return {
    userid: state.auth.userid,
    avatar: state.auth.avatar,
    username: state.auth.username,
    apikey: state.auth.apikey,
    language: state.auth.language,
    theme: state.auth.theme,
    setup: state.auth.setup,
  };
})(HomeScreen);
