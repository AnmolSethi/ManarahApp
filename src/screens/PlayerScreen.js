import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { Platform, View, Text, TouchableOpacity, Share } from "react-native";
import { Container, Icon, Header, Content, Toast } from "native-base";
import lang from "../utils/lang";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import CommentComponent from "../components/CommentComponent";
import Api from "../api";
import DisplayComponent from "../components/DisplayComponent";
import update from "immutability-helper";
import TrackProgressComponent from "../components/TrackProgressComponent";
import { BASE_CURRENCY, TRACK_PLAY_ACCESS } from "../config";
import { Image } from "react-native";

class PlayerScreen extends BaseScreen {
  item = null;
  type = "";
  typeId = "";
  needsPrapare = true;

  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam("item");
    this.type = this.props.navigation.getParam("type");
    this.typeId = this.props.navigation.getParam("typeId");
    this.component = this.props.navigation.getParam("component");
    this.player.currentPlayList =
      this.props.navigation.getParam("playList") !== null
        ? this.props.navigation.getParam("playList")
        : this.component.state.itemLists;
    this.player.currentPlayListLimit =
      this.props.navigation.getParam("playLimit") !== null
        ? this.props.navigation.getParam("playLimit")
        : this.component.limit;
    this.player.currentPlayListOffset =
      this.props.navigation.getParam("playOffset") !== null
        ? this.props.navigation.getParam("playOffset")
        : this.component.offset;
    this.player.currentPlayIndex = this.props.navigation.getParam("index");

    this.comp = this;

    if (
      this.player.track !== null &&
      typeof this.player.track === "object" &&
      this.player.track.id === this.item.id
    )
      this.needsPrapare = false;
    if (this.props.navigation.getParam("canPrepare") === false) {
      this.needsPrapare = false;
      this.player = this.props.navigation.getParam("player");
    } else {
      this.player.setTrack(this.item, this.type, this.typeId);
    }

    setTimeout(() => {
      if (
        this.needsPrapare &&
        (this.item.canPlay === 1 ||
          TRACK_PLAY_ACCESS === 1 ||
          this.type === "radio")
      ) {
        this.player.prepare();
      }
    }, 300);
    this.state = {
      ...this.state,
      infoModalVisible: false,
      commentModalVisible: false,
      item: this.item,
      nextupModalVisible: false,
    };

    this.props.navigation.addListener("didFocus", () => {
      this.updateState({ player: this.player.track !== null ? true : false });
      this.player.updateComponent(this.comp);
      this.updateState({
        playing: this.player.playing,
        isPaused: this.player.isPaused,
      });

      if (this.type !== "radio") this.loadTrackDetails();
    });
    if (this.type !== "radio") this.loadTrackDetails();
  }

  reload(item, index, component) {
    this.item = item;
    this.needsPrapare = true;
    this.player.currentPlayIndex = index;
    this.component = component;
    this.player.currentPlayList = component.state.itemLists;
    this.player.currentPlayListLimit = component.limit;
    this.player.currentPlayListOffset = component.offset;
    this.player.setTrack(this.item, this.type, this.typeId);
    this.player.stopPlaying();
    this.player.actualPlaying = false;
    //console.log(item);
    if (
      this.needsPrapare &&
      (this.item.canPlay === 1 ||
        TRACK_PLAY_ACCESS === 1 ||
        this.type === "radio")
    ) {
      this.player.prepare();
    } else {
      this.showBuyNow("track", this.item.id, this.item.price);
    }
    this.state = {
      ...this.state,
      infoModalVisible: false,
      commentModalVisible: false,
      item: this.item,
      nextupModalVisible: false,
    };
    //this.player.startPlaying();

    if (this.type !== "radio") this.loadTrackDetails();
  }

  loadTrackDetails() {
    Api.get("track/details", {
      userid: this.props.userid,
      key: this.props.apikey,
      id: this.item.id,
    }).then((result) => {
      this.item = result;
      this.updateState(
        update(this.state, {
          item: { $set: result },
        })
      );
    });
  }

  componentDidMount() {
    if (this.needsPrapare) {
      if (
        this.item.canPlay === 1 ||
        TRACK_PLAY_ACCESS === 1 ||
        this.type === "radio"
      ) {
        this.player.updateComponent(this);
        this.player.stopPlaying();
        this.player.startPlaying();
      } else {
        this.showBuyNow("track", this.item.id, this.item.price);
      }
    }
  }

  render() {
    this.player.updateComponent(this);
    return this.showContent(
      <Container style={{ flex: 1, backgroundColor: this.theme.darkColor }}>
        {this.type !== "radio" ? (
          <Modal
            isVisible={this.state.infoModalVisible}
            // onSwipe={() => this.updateState({ infoModalVisible: false })}
            // swipeDirection="down"
            style={{ margin: 0 }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: this.theme.darkColor,
              }}
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
                  width: "100%",
                  height: 50,
                  paddingRight: 25,
                  backgroundColor: this.theme.darkColor,
                  padding: 10,
                  alignContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.updateState({ infoModalVisible: false })}
                >
                  <Image
                    source={require("../images/icons/exit.png")}
                    style={{ height: 30, width: 30 }}
                  ></Image>
                </TouchableOpacity>
              </View>

              <Content
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignContent: "center",
                }}
              >
                <FastImage
                  source={{ uri: this.item.art_lg }}
                  style={{
                    flex: 1,
                    width: 150,
                    height: 150,
                    margin: 20,
                    borderRadius: 75,
                    alignSelf: "center",
                  }}
                />
                <Text
                  style={{
                    color: this.theme.textColor,
                    alignSelf: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {this.item.title}
                </Text>

                <Text
                  style={{
                    color: "#94A7AF",
                    fontSize: 14,
                    fontWeight: "500",
                    alignSelf: "center",
                    marginTop: 10,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  {lang.getString("by") + " " + this.item.user.full_name}
                </Text>

                <View
                  style={{
                    borderColor: this.theme.tabColor,
                    padding: 2,
                    borderWidth: 2,
                    borderRadius: 2,
                  }}
                >
                  <Text
                    style={{
                      color: this.theme.textColor,
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {"#" + this.item.tag}
                  </Text>
                </View>

                <View
                  style={{
                    alignContent: "center",
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: 15,
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      padding: 5,
                      marginLeft: 15,
                      flexDirection: "column",
                    }}
                  >
                    <Image
                      source={require("../images/icons/Likes.png")}
                      style={{ height: 30, width: 30 }}
                    ></Image>
                    <Text
                      style={{
                        color: this.theme.blackColor,
                        marginLeft: 5,
                        textAlign: "center",
                        marginTop: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {this.item.likeCount}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignSelf: "center",
                      padding: 5,
                      marginLeft: 15,
                      flexDirection: "column",
                    }}
                  >
                    <Image
                      source={require("../images/icons/earphone.png")}
                      style={{ height: 30, width: 30 }}
                    ></Image>
                    <Text
                      style={{
                        color: this.theme.blackColor,
                        marginLeft: 5,
                        marginTop: 5,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {this.item.viewCount}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    marginTop: 20,
                    padding: 10,
                    alignContent: "flex-start",
                  }}
                >
                  {this.item.description !== "" ? (
                    <View style={{ flexDirection: "column" }}>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        {lang.getString("description")} :
                      </Text>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontSize: 14,
                          marginTop: 7,
                        }}
                      >
                        {this.item.description}
                      </Text>
                    </View>
                  ) : null}

                  {this.item.record !== "" ? (
                    <View style={{ flexDirection: "column" }}>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        {lang.getString("record-label")} :
                      </Text>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontSize: 14,
                          marginTop: 7,
                        }}
                      >
                        {this.item.record}
                      </Text>
                    </View>
                  ) : null}

                  {this.item.buy !== "" ? (
                    <View style={{ flexDirection: "column" }}>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        {lang.getString("buy-link")} :
                      </Text>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontSize: 14,
                          marginTop: 7,
                        }}
                      >
                        {this.item.buy}
                      </Text>
                    </View>
                  ) : null}

                  {this.item.track_release !== "" ? (
                    <View style={{ flexDirection: "column" }}>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        {lang.getString("release-date")} :
                      </Text>
                      <Text
                        style={{
                          color: this.theme.blackColor,
                          fontSize: 14,
                          marginTop: 7,
                        }}
                      >
                        {this.item.track_release}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Content>
              {/* <TouchableOpacity
                onPress={() => {
                  this.updateState({ infoModalVisible: false });
                }}
                style={{ position: "absolute", right: 10, top: 20 }}
              >
                <Icon
                  name="close"
                  style={{ color: this.theme.blackColor, fontSize: 45 }}
                />
              </TouchableOpacity> */}
            </View>
          </Modal>
        ) : null}

        {this.type !== "radio" ? (
          <Modal
            isVisible={this.state.nextupModalVisible}
            onSwipe={() => this.updateState({ nextupModalVisible: false })}
            style={{ margin: 0 }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: this.theme.contentVariationBg,
              }}
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
              <View style={{ flexDirection: "column", flex: 1 }}>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    backgroundColor: this.theme.greyHeaderBg,
                    padding: 10,
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.updateState({ nextupModalVisible: false });
                    }}
                  >
                    <Icon
                      name="arrow-down"
                      type="SimpleLineIcons"
                      style={{ color: this.theme.blackColor, fontSize: 30 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: this.theme.blackColor,
                      fontSize: 20,
                      marginLeft: 10,
                    }}
                  >
                    {lang.getString("next-up")}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <DisplayComponent
                    cacheFilter="nextup"
                    component={this}
                    player={this.player}
                    navigation={this.props.navigation}
                    limit={20}
                    type={this.type}
                    typeId={this.typeId}
                    displayType="small-list"
                  />
                </View>
              </View>
            </View>
          </Modal>
        ) : null}
        <Modal
          isVisible={this.state.commentModalVisible}
          onSwipe={() => this.updateState({ commentModalVisible: false })}
          style={{ margin: 0 }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: this.theme.darkColor,
            }}
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
            <CommentComponent
              navigation={this.props.navigation}
              type="track"
              trackId={this.item.id}
              component={this}
              track={this.item}
            />
          </View>
        </Modal>
        <View
          style={{
            backgroundColor: this.theme.tabColor,
            flex: 1,
            paddingTop: 15,
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.minimize();
            }}
            style={{ position: "absolute", left: 20, top: 15 }}
          >
            <Image
              source={require("../images/icons/arrow_down.png")}
              style={{ height: 25, width: 25 }}
            ></Image>
          </TouchableOpacity>
          {/* {this.type !== "radio" ? (
              <TouchableOpacity
                onPress={() => {
                  this.updateState({ infoModalVisible: true });
                }}
                style={{ position: "absolute", left: 10, top: 35 }}
              >
                <Icon
                  name="info"
                  type="SimpleLineIcons"
                  style={{ color: "#fff", fontSize: 25 }}
                />
              </TouchableOpacity>
            ) : null} */}

          {/* {this.type !== "radio" ? (
              <TouchableOpacity
                onPress={() => {
                  this.updateState({ nextupModalVisible: true });
                }}
                style={{ position: "absolute", right: 10, top: 35 }}
              >
                <Icon
                  name="playlist"
                  type="SimpleLineIcons"
                  style={{ color: "#fff", fontSize: 25 }}
                />
              </TouchableOpacity>
            ) : null} */}

          {this.type !== "radio" && this.item.price > 0 ? (
            <TouchableOpacity
              onPress={() => {
                this.showPaymentModal("track", this.item.id, this.item.price);
              }}
              style={{ position: "absolute", left: 50, top: 35 }}
            >
              <View
                style={{
                  padding: 4,
                  borderRadius: 10,
                  backgroundColor: this.theme.brandPrimary,
                }}
              >
                <Text style={{ color: "#fff" }}>
                  {BASE_CURRENCY}
                  {this.item.price}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

          <View
            style={{
              position: "absolute",
              top: 40,
              alignSelf: "center",
              alignContent: "center",
              padding: 20,
              flexDirection: "column",
              flex: 1,
            }}
          >
            {/* Title Text */}
            <Text
              style={{
                color: this.theme.textColor,
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {this.item.title}
            </Text>
            {/* Progress Bar */}
            {this.type !== "radio" ? (
              <View
                style={{
                  padding: 10,
                  marginTop: 40,
                  height: 100,
                  alignContent: "center",
                  marginBottom: 0,
                  alignSelf: "center",
                }}
              >
                <TrackProgressComponent
                  key={this.player.track.id}
                  track={this.player.track}
                  player={this.player}
                />
              </View>
            ) : null}

            <View
              style={{
                padding: 20,
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Image
                source={require("../images/icons/previous.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              ></Image>
              <TouchableOpacity
                onPress={() => {
                  if (this.type === "radio") return true;
                  this.player.goPrevious();
                }}
              >
                <Image
                  source={require("../images/icons/fast_backward.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                ></Image>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.validatePlayer();
                  this.player.togglePlay();
                }}
              >
                <Image
                  source={
                    !this.state.isPaused
                      ? require("../images/icons/Pause.png")
                      : require("../images/icons/play_filled.png")
                  }
                  style={{
                    width: 30,
                    height: 30,
                  }}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (this.type === "radio") return true;
                  this.player.goNext();
                }}
              >
                <Image
                  source={require("../images/icons/fast_forward.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                ></Image>
              </TouchableOpacity>
              <Image
                source={require("../images/icons/next.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              ></Image>
            </View>

            {/* Bottom Icons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 15,
              }}
            >
              {/* Like */}
              <TouchableOpacity
                onPress={() => {
                  this.like();
                }}
              >
                <Image
                  source={
                    this.item.hasLiked === 1
                      ? require("../images/icons/liked.png")
                      : require("../images/icons/Likes.png")
                  }
                  style={{ height: 30, width: 30, marginRight: 10 }}
                ></Image>
              </TouchableOpacity>
              {/* Share */}
              <TouchableOpacity
                onPress={() => {
                  let message = lang.getString("share-track-message");
                  if (Platform.OS !== "ios") message += " " + this.item.link;
                  Share.share(
                    {
                      message: message,
                      url: this.item.link,
                      title: lang.getString("share-track"),
                    },
                    {
                      dialogTitle: lang.getString("share-track"),
                    }
                  );
                }}
              >
                <Image
                  source={require("../images/icons/Share.png")}
                  style={{ height: 30, width: 30, marginRight: 10 }}
                ></Image>
              </TouchableOpacity>
              {/* Playlist */}
              <TouchableOpacity
                onPress={() => {
                  this.addToPlaylist(this.item.id);
                }}
              >
                <Image
                  source={require("../images/icons/Add.png")}
                  style={{ height: 30, width: 30, marginRight: 10 }}
                ></Image>
              </TouchableOpacity>
              {/* Listen Later */}
              <Image
                source={require("../images/icons/listen_later.png")}
                style={{ height: 30, width: 30, marginRight: 10 }}
              ></Image>
              {/* Report */}
              <Image
                source={require("../images/icons/Report.png")}
                style={{ height: 30, width: 30, marginRight: 10 }}
              ></Image>
              {/* Info */}
              <TouchableOpacity
                onPress={() => {
                  this.updateState({ infoModalVisible: true });
                }}
              >
                <Image
                  source={require("../images/icons/info.png")}
                  style={{ height: 30, width: 30, marginRight: 10 }}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Container>
    );
  }

  minimize() {
    this.component.minimizePlayer(this.player);
    this.props.navigation.goBack();
  }

  repost() {
    if (!this.isLoggedIn()) return this.showLoginAlert();
    let item = this.item;
    item.hasReposted = item.hasReposted === 1 ? 0 : 1;
    this.item = item;
    this.updateState(
      update(this.state, {
        item: { $set: item },
      })
    );

    if (item.hasReposted === 1) {
      Toast.show({
        text: lang.getString("you-reposted-this"),
        textStyle: { color: this.theme.brandPrimary, textAlign: "center" },
      });
    }
    Api.get("like/item", {
      userid: this.props.userid,
      key: this.props.apikey,
      action: "repost-track",
      track: this.item.id,
    });
  }

  like() {
    if (!this.isLoggedIn()) return this.showLoginAlert();
    let item = this.item;
    item.hasLiked = item.hasLiked === 1 ? 0 : 1;
    this.item = item;
    if (item.hasLiked === 1) {
      Toast.show({
        text: lang.getString("you-love-this"),
        textStyle: { color: this.theme.brandPrimary, textAlign: "center" },
      });
    }
    this.updateState(
      update(this.state, {
        item: { $set: item },
      })
    );

    Api.get("like/item", {
      userid: this.props.userid,
      key: this.props.apikey,
      type: "track",
      type_id: this.item.id,
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
})(PlayerScreen);
