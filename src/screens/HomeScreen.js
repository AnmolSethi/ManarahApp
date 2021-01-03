import React from "react";
import BaseScreen from "../utils/BaseScreen";
import {
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
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

    setInterval(() => {
      let dPosition = 0;
      let dImage =
        this.props.setup !== undefined && this.props.setup.slide_image_1
          ? this.props.setup.slide_image_1
          : require("../images/topo1.png");
      if (this.state.position === 0) {
        dPosition = 1;
        dImage =
          this.props.setup !== undefined && this.props.setup.slide_image_2
            ? this.props.setup.slide_image_2
            : require("../images/topo2.png");
      } else if (this.state.position === 1) {
        dPosition = 2;
        dImage =
          this.props.setup !== undefined && this.props.setup.slide_image_3
            ? this.props.setup.slide_image_3
            : require("../images/topo3.png");
      } else if (this.state.position === 2) {
        dPosition = 0;
        dImage =
          this.props.setup !== undefined && this.props.setup.slide_image_1
            ? this.props.setup.slide_image_1
            : require("../images/topo1.png");
      }
      this.updateState({
        image: dImage,
        position: dPosition,
      });
    }, 3000);
  }

  getCurrentLanguage() {
    for (let i = 0; i < LANGUAGES.length; i++) {
      if (this.props.language === LANGUAGES[i].key) return LANGUAGES[i];
    }
    return LANGUAGES[0];
  }

  render() {
    const resizeMode = "cover";
    return this.showContent(
      <Container style={{ flex: 1 }}>
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
                source={require("../images/white.png")}
                style={{
                  marginTop: 120,
                  width: 150,
                  height: 60,
                  resizeMode: "contain",
                  alignSelf: "center",
                  flex: 1,
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  marginTop: 20,
                  fontSize: 20,
                  fontWeight: "500",
                }}
              >
                {"Manarah"}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("auth", { page: "login" })
                }
              >
                <ImageBackground
                  source={require("../images/btn.png")}
                  style={{
                    width: 300,
                    alignItems: "center",
                    marginTop: 50,
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

              {/* <LinearGradient
                  colors={["red", "yellow", "green"]}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    height: 200,
                    width: 350,
                  }}
                >
                  
                </LinearGradient> */}

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("auth", { page: "signup" })
                }
              >
                <ImageBackground
                  source={require("../images/btn.png")}
                  style={{
                    width: 300,
                    marginTop: 15,
                    alignItems: "center",
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
                    {lang.getString("signup-for-account")}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  padding: 20,
                }}
              >
                <Text>{"OR"}</Text>
              </View>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("explore")}
              >
                <ImageBackground
                  source={require("../images/btn.png")}
                  style={{
                    width: 300,
                    alignItems: "center",
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
                    {lang.getString("explore-music")}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>

              <View style={{ flex: 1 }}></View>
              {/* 
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <TypingText
                  key={this.state.typeText}
                  color="white"
                  textSize={20}
                  text={this.state.typeText}
                />
              </View> */}
            </View>
            {/* 
            {PUBLIC_ACCESS ? (
              <Button
                onPress={() => this.props.navigation.navigate(DEFAULT_HOME)}
                block
                danger
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  backgroundColor: "#000",
                }}
              >
                <Text style={{ color: "white", fontSize: 20 }}>
                  {lang.getString("explore-music")}
                </Text>
              </Button>
            ) : null}
 */}
            <View
              style={{
                marginTop: Platform.OS === "ios" ? 40 : 10,
                position: "absolute",
                left: 20,
                top: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>
                {"Login"}
              </Text>
            </View>

            {/* <View
              style={{
                marginTop: Platform.OS === "ios" ? 40 : 10,
                position: "absolute",
                right: 10,
              }}
            >
              <Menu>
                <MenuTrigger>
                  <View style={{ flexDirection: "row", padding: 5 }}>
                    <Image
                      source={this.state.selectedLanguage.icon}
                      style={{ width: 20, height: 15, marginTop: 2 }}
                    />
                    <Text
                      style={{ color: "#fff", fontSize: 15, marginLeft: 5 }}
                    >
                      {this.state.selectedLanguage.name}
                    </Text>
                  </View>
                </MenuTrigger>
                {this.languageOptions()}
              </Menu>
            </View> */}
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
