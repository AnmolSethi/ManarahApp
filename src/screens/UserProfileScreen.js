import React from "react";
import BaseScreen from "../utils/BaseScreen";
import {
  Platform,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
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
import update from "immutability-helper/index";
import { Linking } from "react-native";
import { Share } from "react-native";

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
        hasSpotlight: r.status === 1 ? false : true,
      });
    });
  }
  render() {
    console.log(this.item);
    return this.show(
      <Container style={{ flex: 1, backgroundColor: this.theme.darkColor }}>
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
            backgroundColor: this.theme.tabColor,
            padding: 10,
            alignItems: "center",
            alignContent: "stretch",
          }}
        >
          <Text
            style={{
              flex: 1,
              color: this.theme.textColor,
              fontSize: 20,
              alignItems: "center",
            }}
          >
            {this.item.username}
          </Text>
        </View>

        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              alignContent: "space-between",
              marginTop: 20,
              marginBottom: 50,
            }}
          >
            <FastImage
              style={{
                width: 80,
                height: 80,
                marginBottom: 10,
                marginLeft: 20,
                borderColor: this.theme.textColor,
                borderWidth: 1,
                borderRadius: 40,
              }}
              source={{ uri: this.item.avatar }}
            />
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
                  color: this.theme.textColor,
                  fontSize: 20,
                  textAlign: "left",
                }}
              >
                {this.item.full_name}
              </Text>
              <Text
                style={{
                  color: this.theme.textColor,
                  fontSize: 16,
                  textAlign: "left",
                }}
              >
                {this.item.username}
              </Text>
            </View>
            {this.props.userid !== this.item.id ? (
              <View
                style={{
                  width: 100,
                  margin: 20,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 4,
                  height: 40,
                  backgroundColor: this.theme.buttonColor,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.follow();
                  }}
                >
                  <Text style={{ color: this.theme.textColor, fontSize: 18 }}>
                    {this.state.item.is_following === 1
                      ? "Following"
                      : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ height: 10, marginTop: 10 }}></View>
            )}
          </View>

          <Tabs
            tabBarBackgroundColor={this.theme.darkColor}
            renderTabBar={() => (
              <ScrollableTab
                style={{
                  borderBottomWidth: 0,
                  borderTopWidth: 0,
                  borderColor: this.theme.darkColor,
                }}
              />
            )}
            style={{
              paddingTop: 0,
              elevation: 0,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0,
              flex: 1,
              borderWidth: 0,
              backgroundColor: this.theme.darkColor,
            }}
            tabBarUnderlineStyle={{
              height: 0,
              top: -1,
              backgroundColor: this.theme.textColor,
            }}
          >
            <Tab
              heading={lang.getString("all").toUpperCase()}
              tabStyle={{ backgroundColor: this.theme.darkColor }}
              textStyle={{
                color: this.theme.textColor,
              }}
              activeTabStyle={{
                backgroundColor: this.theme.darkColor,
                borderBottomWidth: 2,
                borderRightColor: this.theme.textColor,
              }}
            >
              {this.state.hasSpotlightLoaded ? (
                <View style={{ backgroundColor: this.theme.darkColor }}>
                  <DisplayComponent
                    headerComponent={
                      this.state.hasSpotlight ? (
                        <View
                          style={{
                            backgroundColor: this.theme.darkColor,
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
                              displayType="small-list"
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
                    displayType="small-list"
                  />
                </View>
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
              heading={lang.getString("tracks").toUpperCase()}
              tabStyle={{ backgroundColor: this.theme.darkColor }}
              textStyle={{
                color: this.theme.textColor,
              }}
              activeTabStyle={{
                backgroundColor: this.theme.darkColor,
                borderBottomWidth: 2,
                borderRightColor: this.theme.textColor,
              }}
            >
              <View style={{ backgroundColor: this.theme.darkColor }}>
                <DisplayComponent
                  key={this.item.id}
                  player={this.player}
                  navigation={this.props.navigation}
                  limit={10}
                  type="my-tracks"
                  typeId={this.item.id + "-0"}
                  displayType="small-list"
                />
              </View>
            </Tab>
            <Tab
              heading={lang.getString("playlists").toUpperCase()}
              tabStyle={{ backgroundColor: this.theme.darkColor }}
              textStyle={{
                color: this.theme.textColor,
              }}
              activeTabStyle={{
                backgroundColor: this.theme.darkColor,
                borderBottomWidth: 2,
                borderRightColor: this.theme.textColor,
              }}
            >
              <View style={{ backgroundColor: this.theme.darkColor }}>
                <AlbumComponent
                  player={this.player}
                  navigation={this.props.navigation}
                  type="playlist"
                  typeId={"profile-" + this.item.id}
                />
              </View>
            </Tab>
            <Tab
              heading={"About".toUpperCase()}
              tabStyle={{ backgroundColor: this.theme.darkColor }}
              textStyle={{
                color: this.theme.textColor,
              }}
              activeTabStyle={{
                backgroundColor: this.theme.darkColor,
                borderBottomWidth: 2,
                borderRightColor: this.theme.textColor,
              }}
            >
              <Container style={{ flex: 1, flexDirection: "column" }}>
                <View
                  style={{
                    margin: 20,
                    padding: 20,
                    borderColor: this.theme.tabColor,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: this.theme.textColor,
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {this.item.bio ?? "Bio"}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: 20,
                    alignItems: "center",
                  }}
                >
                  {/* Youtube */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.youtube)}
                  >
                    <FastImage
                      source={require("../images/icons/social/youtube.png")}
                      style={{ height: 25, width: 25, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Twitter */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.twitter)}
                  >
                    <FastImage
                      source={require("../images/icons/social/twitter.png")}
                      style={{ height: 25, width: 25, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Telegram */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.twitter)}
                  >
                    <FastImage
                      source={require("../images/icons/social/telegram.png")}
                      style={{ height: 25, width: 25, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Vimeo */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.vimeo)}
                  >
                    <FastImage
                      source={require("../images/icons/social/vimeo.png")}
                      style={{ height: 25, width: 25, marginRight: 7 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Soundcloud */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.soundcloud)}
                  >
                    <FastImage
                      source={require("../images/icons/social/soundcloud.png")}
                      style={{ height: 25, width: 30, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Instagram */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.instagram)}
                  >
                    <FastImage
                      source={require("../images/icons/social/instagram.png")}
                      style={{ height: 25, width: 25, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Snapchat */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.snapchat)}
                  >
                    <FastImage
                      source={require("../images/icons/social/snapchat.png")}
                      style={{ height: 25, width: 25, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Facebook */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.facebook)}
                  >
                    <FastImage
                      source={require("../images/icons/social/facebook.png")}
                      style={{ height: 25, width: 25, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {/* Website */}
                  <TouchableOpacity
                    onPress={() => this.openLink(this.item.website)}
                  >
                    <FastImage
                      source={require("../images/icons/social/website.png")}
                      style={{ height: 25, width: 25, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>
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
                      borderColor: this.theme.tabColor,
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: this.theme.textColor,
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      {"Followers\n" +
                        (this.item.followers !== null
                          ? this.item.followers
                          : 0)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      height: 80,
                      margin: 5,
                      padding: 20,
                      borderColor: this.theme.tabColor,
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: this.theme.textColor,
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      {"Following\n" +
                        (this.item.following !== null
                          ? this.item.following
                          : 0)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "space-around",
                    marginTop: 20,
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Share.share(
                        {
                          message: lang.getString("share-profile"),
                          url: this.state.details.link,
                          title: lang.getString("share-profile"),
                        },
                        {
                          dialogTitle: lang.getString("share-profile"),
                        }
                      );
                    }}
                  >
                    <FastImage
                      source={require("../images/icons/share_profile.png")}
                      style={{ height: 30, width: 30, marginRight: 5 }}
                    ></FastImage>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("settings", {
                        player: this.player,
                        detail: this.state.details,
                      });
                    }}
                  >
                    <FastImage
                      source={require("../images/icons/edit.png")}
                      style={{ height: 40, width: 40 }}
                    ></FastImage>
                  </TouchableOpacity>
                  {this.item.isOwner === 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("settings", {
                          player: this.player,
                          detail: this.state.details,
                        });
                      }}
                    >
                      <FastImage
                        source={require("../images/icons/block.png")}
                        style={{ height: 40, width: 40 }}
                      ></FastImage>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </Container>
            </Tab>
          </Tabs>
        </ScrollView>
      </Container>
    );
  }

  openLink(link) {
    if (link !== null) {
      Linking.openURL(link);
    } else {
      Linking.openURL("http://manarahapp.com");
    }
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
