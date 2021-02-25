import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { Platform, View, TouchableOpacity, Share } from "react-native";
import { Icon, Text, Container, Content, Header, Toast } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import Api from "../api";
import FastImage from "react-native-fast-image";
import update from "immutability-helper/index";
import Modal from "react-native-modal";
import { Image } from "react-native";
import Video from "react-native-video";
// import { PLAYER_STATES } from "react-native-media-controls";

class VideoPlayerComponent extends BaseScreen {
  video = null;

  constructor(props) {
    super(props);
    this.video = this.props.navigation.getParam("video");
    this.state = {
      ...this.state,
      loading: true,
      item: this.video,
      videos: [],
      commentModalVisible: false,
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      paused: false,
      screenType: "content",
    };

    this.item = this.video;
    this.component = this.props.navigation.getParam("component");
    this.registerViewPlays();
  }

  registerViewPlays() {
    Api.get("add/video/play", {
      userid: this.props.userid,
      key: this.props.apikey,
      id: this.video.id,
    });

    Api.get("add/video/view", {
      userid: this.props.userid,
      key: this.props.apikey,
      id: this.video.id,
    });

    Api.get("suggest/videos", {
      userid: this.props.userid,
      key: this.props.apikey,
      id: this.video.id,
    }).then((result) => {
      this.updateState({ videos: result });
    });
  }

  onPaused = () => {
    this.setState({
      paused: !this.state.paused,
    });
  };

  render() {
    return this.show(
      <Container
        style={{
          flex: 1,
          backgroundColor: this.theme.darkColor,
          width: "100%",
        }}
      >
        <Modal
          isVisible={this.state.infoModalVisible}
          onSwipe={() => this.updateState({ infoModalVisible: false })}
          swipeDirection="down"
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
          </View>
        </Modal>

        <View
          style={{
            position: "absolute",
            // top: 40,
            // left: 40,
            padding: 20,
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{ position: "absolute", left: 20, top: 15 }}
          >
            <Image
              source={require("../images/icons/arrow_down.png")}
              style={{ height: 25, width: 25 }}
            ></Image>
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            top: 40,
            width: "100%",
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
              marginBottom: 20,
            }}
          >
            {this.item.title}
          </Text>
          <Video
            paused={this.state.paused}
            source={{ uri: this.item.streamurl }}
            style={{
              width: "100%",
              height: 200,
              backgroundColor: "#000",
              borderRadius: 10,
            }}
            resizeMode="cover"
          ></Video>
          {/* <MediaControls
            duration={this.state.duration}
            isLoading={this.state.isLoading}
            mainColor="#333"
            onFullScreen={this.onFullScreen}
            onPaused={this.onPaused}
            onReplay={this.onReplay}
            onSeek={this.onSeek}
            onSeeking={this.onSeeking}
            playerState={this.state.playerState}
            progress={this.state.currentTime}
            toolbar={this.renderToolbar()}
          /> */}
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

            <TouchableOpacity onPress={this.onPaused}>
              <Image
                source={
                  !this.state.paused
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
      </Container>

      // <Container style={{ backgroundColor: this.theme.contentVariationBg }}>
      //   <Modal
      //     isVisible={this.state.commentModalVisible}
      //     onSwipe={() => this.updateState({ commentModalVisible: false })}
      //     style={{ margin: 0 }}
      //   >
      //     <View style={{ flex: 1, backgroundColor: this.theme.whiteColor }}>
      //       <Header
      //         hasTabs
      //         noShadow
      //         style={{
      //           paddingTop: Platform.OS === "ios" ? 18 : 0,
      //           backgroundColor: this.theme.headerBg,
      //           height: Platform.OS === "ios" ? 15 : 0,
      //         }}
      //       ></Header>
      //       <CommentComponent
      //         navigation={this.props.navigation}
      //         type="video"
      //         trackId={this.item.id}
      //         component={this}
      //         track={this.item}
      //       />
      //     </View>
      //   </Modal>
      //   <Header
      //     hasTabs
      //     noShadow
      //     style={{
      //       paddingTop: Platform.OS === "ios" ? 18 : 0,
      //       backgroundColor: this.theme.headerBg,
      //       height: Platform.OS === "ios" ? 15 : 0,
      //     }}
      //   ></Header>
      //   <View
      //     style={{
      //       width: "100%",
      //       height: 48,
      //       backgroundColor: this.theme.greyHeaderBg,
      //       padding: 10,
      //       flexDirection: "row",
      //     }}
      //   >
      //     <TouchableOpacity
      //       onPress={() => {
      //         this.props.navigation.goBack();
      //       }}
      //     >
      //       <Icon
      //         name="arrow-round-back"
      //         style={{ color: this.theme.blackColor, fontSize: 30 }}
      //       />
      //     </TouchableOpacity>
      //     <Text
      //       numberOfLines={1}
      //       style={{
      //         color: this.theme.blackColor,
      //         fontSize: 17,
      //         marginLeft: 10,
      //         marginTop: 5,
      //       }}
      //     >
      //       {this.video.title}
      //     </Text>
      //   </View>
      //   <Content style={{ backgroundColor: this.theme.contentVariationBg }}>
      //     <View style={{ width: "100%", height: 300, backgroundColor: "#000" }}>
      //       <WebView
      //         onLoadEnd={() => {
      //           this.updateState({ loading: false });
      //         }}
      //         source={{ uri: this.video.streamurl }}
      //         style={{ width: "100%", height: 300, backgroundColor: "#000" }}
      //       />
      //       {this.state.loading && (
      //         <View
      //           style={{
      //             ...StyleSheet.absoluteFillObject,
      //             backgroundColor: "#000000",
      //             alignItems: "center",
      //             justifyContent: "center",
      //           }}
      //         >
      //           <ActivityIndicator />
      //         </View>
      //       )}
      //     </View>

      //     <View style={{ flexDirection: "row", marginTop: 15 }}>
      //       <View style={{ flexDirection: "row", flex: 1 }}>
      //         <TouchableOpacity
      //           onPress={() => {
      //             this.like();
      //           }}
      //           style={{ padding: 5, marginLeft: 15 }}
      //         >
      //           <Icon
      //             name="heart"
      //             type="SimpleLineIcons"
      //             style={{
      //               fontSize: 20,
      //               color:
      //                 this.state.item.hasLiked === 1
      //                   ? this.theme.brandPrimary
      //                   : this.theme.blackColor,
      //             }}
      //           />
      //         </TouchableOpacity>
      //         <TouchableOpacity
      //           onPress={() => {
      //             this.updateState({ commentModalVisible: true });
      //           }}
      //           style={{ padding: 5, marginLeft: 15 }}
      //         >
      //           <Icon
      //             name="bubble"
      //             type="SimpleLineIcons"
      //             style={{ fontSize: 20, color: this.theme.blackColor }}
      //           />
      //         </TouchableOpacity>
      //         <TouchableOpacity
      //           onPress={() => {
      //             let message = lang.getString("share-video-message");
      //             if (Platform.OS !== "ios") message += " " + this.item.link;
      //             Share.share(
      //               {
      //                 message: message,
      //                 url: this.item.link,
      //                 title: lang.getString("share-video"),
      //               },
      //               {
      //                 dialogTitle: lang.getString("share-video"),
      //               }
      //             );
      //           }}
      //           style={{ padding: 5, marginLeft: 15 }}
      //         >
      //           <Icon
      //             name="share"
      //             type="SimpleLineIcons"
      //             style={{ fontSize: 20, color: this.theme.blackColor }}
      //           />
      //         </TouchableOpacity>
      //       </View>
      //       <View style={{ flexDirection: "row" }}>
      //         <Icon
      //           name="heart"
      //           type="SimpleLineIcons"
      //           style={{ fontSize: 17, color: this.theme.blackColor }}
      //         />
      //         <Text style={{ marginLeft: 5, color: this.theme.blackColor }}>
      //           {this.state.item.likeCount}
      //         </Text>

      //         <Icon
      //           name="eye"
      //           type="SimpleLineIcons"
      //           style={{
      //             fontSize: 17,
      //             color: this.theme.blackColor,
      //             marginLeft: 7,
      //           }}
      //         />
      //         <Text
      //           style={{
      //             marginLeft: 5,
      //             marginRight: 7,
      //             color: this.theme.blackColor,
      //           }}
      //         >
      //           {this.state.item.views}
      //         </Text>

      //         <Icon
      //           name="control-play"
      //           type="SimpleLineIcons"
      //           style={{
      //             fontSize: 17,
      //             color: this.theme.blackColor,
      //             marginLeft: 7,
      //           }}
      //         />
      //         <Text
      //           style={{
      //             marginLeft: 5,
      //             marginRight: 7,
      //             color: this.theme.blackColor,
      //           }}
      //         >
      //           {this.state.item.plays}
      //         </Text>
      //       </View>
      //     </View>

      //     <View
      //       style={{
      //         flexDirection: "row",
      //         borderTopColor: this.theme.greyColor,
      //         borderTopWidth: 0.5,
      //         marginTop: 15,
      //         padding: 10,
      //         backgroundColor: this.theme.lightGreyColor,
      //       }}
      //     >
      //       <TouchableOpacity style={{}} onPress={() => {}}>
      //         <FastImage
      //           style={{
      //             width: 40,
      //             height: 40,
      //             borderRadius: 100,
      //             borderColor: "#D1D1D1",
      //             borderWidth: 1,
      //           }}
      //           source={{
      //             uri: this.state.item.user.avatar,
      //           }}
      //           resizeMode={FastImage.resizeMode.cover}
      //         />
      //       </TouchableOpacity>

      //       <Text
      //         style={{
      //           marginLeft: 10,
      //           marginTop: 10,
      //           fontSize: 15,
      //           color: this.theme.blackColor,
      //         }}
      //       >
      //         {this.state.item.user.full_name}
      //       </Text>
      //     </View>

      //     {this.state.videos.length > 0 ? (
      //       <View style={{ marginTop: 10, padding: 10 }}>
      //         <Text
      //           style={{
      //             fontSize: 15,
      //             color: this.theme.blackColor,
      //             marginBottom: 10,
      //           }}
      //         >
      //           {lang.getString("suggested-videos")}
      //         </Text>

      //         {this.displayVideos()}
      //       </View>
      //     ) : null}
      //   </Content>
      // </Container>
    );
  }

  displayVideos() {
    let views = [];

    for (let i = 0; i < this.state.videos.length; i++) {
      let video = this.state.videos[i];
      views.push(
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.push("videoPlayer", {
              video: video,
              component: this,
              player: this.player,
            });
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <FastImage
              style={{
                width: 40,
                height: 40,
                borderColor: "#D1D1D1",
                borderWidth: 1,
              }}
              source={{
                uri: video.art,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  marginLeft: 10,
                  marginTop: 10,
                  fontSize: 15,
                  color: this.theme.blackColor,
                }}
              >
                {video.title}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 7 }}
            >
              <Icon
                name="heart"
                type="SimpleLineIcons"
                style={{ fontSize: 14, color: this.theme.blackColor }}
              />
              <Text style={{ marginLeft: 5, color: this.theme.blackColor }}>
                {video.likeCount}
              </Text>
              <Icon
                name="control-play"
                type="SimpleLineIcons"
                style={{
                  fontSize: 14,
                  color: this.theme.blackColor,
                  marginLeft: 7,
                }}
              />
              <Text
                style={{
                  marginLeft: 5,
                  marginRight: 7,
                  color: this.theme.blackColor,
                }}
              >
                {video.plays}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return <View>{views}</View>;
  }

  like() {
    if (!this.component.isLoggedIn()) return this.component.showLoginAlert();
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
      type: "video   ",
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
})(VideoPlayerComponent);
