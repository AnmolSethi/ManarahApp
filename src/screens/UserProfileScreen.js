import React from "react";
import BaseScreen from "../utils/BaseScreen";
import {
  Platform,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import {
  Icon,
  Text,
  Container,
  Header,
  Tabs,
  Tab,
  ScrollableTab,
  Toast,
} from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import Api from "../api";
import FastImage from "react-native-fast-image";
import DisplayComponent from "../components/DisplayComponent";
import AlbumComponent from "../components/AlbumComponent";
import light from "../themes/light";
import update from "immutability-helper/index";
import { SocialIcon } from "react-native-elements";
import { Linking } from "react-native";

class UserProfileScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam("item");
    this.component = this.props.navigation.getParam("component");
    this.activeMenu = "userProfile";

    this.state = {
      ...this.state,
      item: this.item,
      hasSpotlightLoaded: false,
      hasSpotlight: false,
    };

    this.activeMenu = this.props.userid === this.item.id ? "userProfile" : "";
    this.confirmSpotlight();
  }

  confirmSpotlight() {
    Api.get("has/spotlight", {
      userid: this.props.userid,
      key: this.props.apikey,
      theuserid: this.item.id,
    }).then((r) => {
      this.updateState({
        hasSpotlightLoaded: true,
        hasSpotlight: r.status === 1 ? true : false,
      });
    });
  }
  render() {
    return this.show(
      <Container
        style={{ flex: 1, backgroundColor: this.theme.contentVariationBg }}
      >
        <Header
          hasTabs
          noShadow
          style={{
            paddingTop: Platform.OS === "ios" ? 18 : 0,
            backgroundColor: this.theme.headerBg,
            height: Platform.OS === "ios" ? 15 : 0,
          }}
        ></Header>
        <View
          style={{
            height: 50,
            backgroundColor: this.theme.headerBg,
            padding: 10,
            flexDirection: "row",
            alignContent: "stretch",
          }}
        >
          {this.props.userid !== this.item.id ? (
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon
                  name="arrow-round-back"
                  style={{ color: this.theme.blackColor, fontSize: 30 }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}></View>
          )}

          <Text
            style={{
              flex: 1,
              color: this.theme.whiteColor,
              fontSize: 20,
              alignItems: "center",
            }}
          >
            {this.item.username}
          </Text>

          {this.props.userid === this.item.id ? (
            <View style={{ alignItems: "flex-end", flex: 1 }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("account", {
                    player: this.player,
                  })
                }
              >
                <Icon
                  name="settings"
                  style={{
                    color: this.theme.whiteColor,
                    fontSize: 30,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}></View>
          )}
        </View>

        <ScrollView>
          {this.props.userid !== this.item.id ? (
            <View style={{ width: 100, margin: 20, height: 40 }}>
              <Button
                color={this.theme.brandPrimary}
                title={
                  this.state.item.is_following === 1 ? "Following" : "Follow"
                }
                style={{ fontSize: 20, color: this.theme.brandPrimary }}
                onPress={() => {
                  this.follow();
                }}
              >
                {this.state.item.is_following === 1 ? "Following" : "Follow"}
              </Button>
            </View>
          ) : (
            <View style={{ height: 10, marginTop: 10 }}></View>
          )}

          <View style={{ flexDirection: "row", alignContent: "space-between" }}>
            <View
              style={{
                flex: 2,
                marginLeft: 20,
                marginRight: 20,
                alignContent: "center",
              }}
            >
              <Text
                style={{
                  color: this.theme.blackColor,
                  fontSize: 20,
                  textAlign: "right",
                }}
              >
                {this.item.full_name}
              </Text>
              <Text
                style={{
                  color: this.theme.blackColor,
                  fontSize: 16,
                  textAlign: "right",
                }}
              >
                {this.item.username}
              </Text>
            </View>
            <FastImage
              style={{
                width: 80,
                height: 80,
                marginBottom: 10,
                marginRight: 20,
                borderColor: "#D1D1D1",
                borderWidth: 1,
                borderRadius: 40,
              }}
              source={{ uri: this.item.avatar }}
            />
          </View>

          <View
            style={{
              margin: 20,
              padding: 20,
              borderColor: this.theme.blackColor,
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: this.theme.blackColor,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {this.item.bio ?? "Bio"}
            </Text>
          </View>

          <View
            style={{
              height: 40,
            }}
          >
            <Text
              style={{
                color: this.theme.blackColor,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {this.item.website ?? "Website"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignContent: "space-around",
              marginLeft: 20,
              alignItems: "center",
              marginRight: 20,
              marginBottom: 20,
            }}
          >
            <SocialIcon
              type="facebook"
              onPress={() => {
                if (this.item.facebook !== null) {
                  Linking.openURL(this.item.facebook);
                } else {
                  Linking.openURL("http://manarahapp.com");
                }
              }}
            ></SocialIcon>
            <SocialIcon
              type="twitter"
              onPress={() => {
                if (this.item.twitter !== null) {
                  Linking.openURL(this.item.twitter);
                } else {
                  Linking.openURL("http://manarahapp.com");
                }
              }}
            ></SocialIcon>
            <SocialIcon
              type="youtube"
              onPress={() => {
                if (this.item.youtube !== null) {
                  Linking.openURL(this.item.youtube);
                } else {
                  Linking.openURL("http://manarahapp.com");
                }
              }}
            ></SocialIcon>
            <SocialIcon
              type="vimeo"
              onPress={() => {
                if (this.item.vimeo !== null) {
                  Linking.openURL(this.item.vimeo);
                } else {
                  Linking.openURL("http://manarahapp.com");
                }
              }}
            ></SocialIcon>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignContent: "space-around",
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 80,
                margin: 5,
                padding: 20,
                borderColor: this.theme.blackColor,
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: this.theme.blackColor,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {"Following\n" +
                  (this.item.following !== null ? this.item.following : 0)}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                height: 80,
                margin: 5,
                padding: 20,
                borderColor: this.theme.blackColor,
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: this.theme.blackColor,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {"Followers\n" +
                  (this.item.followers !== null ? this.item.followers : 0)}
              </Text>
            </View>
          </View>

          <Tabs
            renderTabBar={() => (
              <ScrollableTab
                style={{
                  borderBottomWidth: 0,
                  borderTopWidth: 0,
                  borderColor: light.headerBorderTopColor,
                }}
              />
            )}
            style={{
              paddingTop: 0,
              backgroundColor: this.theme.contentVariationBg,
              elevation: 0,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0,
              flex: 1,
              borderWidth: 0,
            }}
            tabBarUnderlineStyle={{ height: 0, top: -1 }}
          >
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("all").toUpperCase()}
            >
              {this.state.hasSpotlightLoaded ? (
                <DisplayComponent
                  headerComponent={
                    this.state.hasSpotlight ? (
                      <View
                        style={{
                          backgroundColor: this.theme.contentVariationBg,
                        }}
                      >
                        <View
                          style={{
                            borderBottomWidth: 10,
                            borderBottomColor: "#F8F8F8",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: "500",
                              margin: 10,
                              color: this.theme.brandPrimary,
                            }}
                          >
                            {lang.getString("spotlight")}
                          </Text>
                          <DisplayComponent
                            player={this.player}
                            navigation={this.props.navigation}
                            limit={5}
                            type="my-spotlight"
                            typeId={this.item.id}
                            displayType="horizontal-grid"
                          />
                        </View>
                      </View>
                    ) : null
                  }
                  key={this.item.id}
                  player={this.player}
                  navigation={this.props.navigation}
                  limit={10}
                  type="my-stream"
                  typeId={this.item.id}
                  displayType="feed-list"
                />
              ) : (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject, // your color
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("tracks").toUpperCase()}
            >
              <DisplayComponent
                key={this.item.id}
                player={this.player}
                navigation={this.props.navigation}
                limit={10}
                type="my-tracks"
                typeId={this.item.id + "-0"}
                displayType="vertical-grid"
              />
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("playlists").toUpperCase()}
            >
              <AlbumComponent
                player={this.player}
                navigation={this.props.navigation}
                type="playlist"
                typeId={"profile-" + this.item.id}
              />
            </Tab>
            {/* <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("albums").toUpperCase()}
            >
              <AlbumComponent
                player={this.player}
                navigation={this.props.navigation}
                type="album"
                typeId={"profile-" + this.item.id}
              />
            </Tab> */}
          </Tabs>
        </ScrollView>
      </Container>
    );
  }

  follow() {
    if (!this.isLoggedIn()) return this.showLoginAlert();
    let item = this.item;
    item.is_following = item.is_following === 1 ? 0 : 1;
    this.item = item;
    if (item.is_following === 1) {
      Toast.show({
        text: lang.getString("you-follow-this"),
        textStyle: { color: this.theme.brandPrimary, textAlign: "center" },
      });
    }
    this.updateState(
      update(this.state, {
        item: { $set: item },
      })
    );

    Api.get("user/follow", {
      userid: this.props.userid,
      key: this.props.apikey,
      id: this.item.id,
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
})(UserProfileScreen);
