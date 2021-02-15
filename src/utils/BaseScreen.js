import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  WebView,
  Image,
} from "react-native";
import {
  Container,
  Footer,
  FooterTab,
  Button,
  Icon,
  Header,
  Toast,
} from "native-base";
import lang from "../utils/lang";
import { BASE_URL, DEFAULT_LANG, DEFAULT_THEME } from "../config";
import { StyleProvider } from "native-base";
import getTheme from "../../native-base-theme/components";
import dark from "../themes/dark";
import Player from "./Player";
import update from "immutability-helper";
import FastImage from "react-native-fast-image";
import { MaterialDialog } from "react-native-material-dialog";
import Modal from "react-native-modal";
import PlaylistAddComponent from "../components/PlaylistAddComponent";
import { trackSchema } from "../store/realmSchema";
import Util from "./Util";
import Api from "../api";
import storage from "../store/storage";

const Realm = require("realm");
var RNFS = require("react-native-fs");
class BaseScreen extends Component {
  activeMenu = "explore";
  theme = dark;
  device = "android";
  cacheLoaded = false;
  player = null;
  constructor(props) {
    super(props);
    this.device = Platform.OS === "ios" ? "ios" : "android";
    if (this.props.language !== undefined) {
      lang.setLanguage(this.props.language);
    } else {
      lang.setLanguage(DEFAULT_LANG);
    }

    this.component = this;

    if (this.props.player !== undefined) {
      this.player = this.props.player;
    } else if (
      this.props.navigation !== undefined &&
      this.props.navigation.getParam("player", null) !== null
    ) {
      this.player = this.props.navigation.getParam("player", null);
    } else {
      this.player = new Player(this);
    }
    this.defaultTheme =
      this.props.setup !== undefined
        ? this.props.setup.default_mode
        : DEFAULT_THEME;
    if (this.props.theme !== undefined && this.props.theme !== null) {
      this.defaultTheme = this.props.theme;
    }

    if (this.props.setup !== undefined) {
      //set values from server
      this.theme.brandPrimary = this.props.setup.primary_color;
      this.theme.primaryTransparent = this.props.setup.transparent_primary;
      this.theme.accentColor = this.theme.headerBg = this.theme.tabDefaultBg = this.props.setup.accent_color;
    }

    if (this.props.navigation !== undefined) {
      this.props.navigation.addListener("didFocus", () => {
        this.updateState({ player: this.player.track !== null ? true : false });
        this.player.updateComponent(this.component);
        this.updateState({
          playing: this.player.playing,
          isPaused: this.player.isPaused,
        });
        this.checkAuth();
      });
    }

    this.state = {
      notifications: 0,
      countNotifications: 0,
      countMessages: 0,
      fetching: false,
      refreshing: false,
      itemDetails: null,
      itemLists: [],
      tagsList: [],
      tagsListSongs: [],
      itemListNotEnd: false,
      fetchFinished: false,
      player: this.player.track !== null ? true : false,
      playing: this.player.playing,
      isPaused: this.player.isPaused,
      loginAlertVisible: false,
      playlistModalVisible: false,
      playlistTrackId: null,
      downloading: [],
      downloaded: [],
      videoModalVisible: false,
      videoItem: null,
      genres: [],
      selectedGenre: null,
      paymentModalVisible: false,
      paymentModalType: "",
      paymentModalTypeId: "",
      paymentModalPrice: "",
      premiumAlertVisible: false,
      buyType: "",
      buyTypeId: "",
      buyPrice: "",
      details: null,
    };

    this.loadDownloads();
    this.player.updateComponent(this);
    this.loadDetails();
    this.loadTags();
  }

  componentWillMount() {}

  checkAuth() {
    //console.log("Api-Key " + this.props.apikey);
    Api.get("check/auth", {
      userid: this.props.userid,
      key: this.props.apikey,
    })
      .then((r) => {
        if (r.status === 1) {
          this.updateState({
            notifications: r.total,
            countNotifications: r.notifications,
            countMessages: r.messages,
          });
        } else {
          if (this.props.userid !== "" && this.props.userid !== undefined) {
            storage.logout(); //force logout the user
          }
        }
      })
      .catch(() => {
        //console.log(e);
      });
  }

  loadDownloads() {
    Realm.open({ schema: [trackSchema] }).then((realm) => {
      let tracks = realm.objects("track_download");
      let downloading = [];
      let downloaded = [];
      for (let i = 0; i < tracks.length; i++) {
        let d = tracks[i];
        if (d.file === "") {
          downloading.push(tracks[i].id);
        } else {
          downloaded.push(tracks[i].id);
        }
      }
      this.updateState({ downloading: downloading, downloaded: downloaded });
    });
  }

  minContent(jsx) {
    return <StyleProvider style={getTheme(this.theme)}>{jsx}</StyleProvider>;
  }

  showContent(jsx) {
    return (
      <StyleProvider style={getTheme(this.theme)}>
        <Container>
          {!this.isLoggedIn() ? (
            <MaterialDialog
              title={lang.getString("you-need-login")}
              visible={this.state.loginAlertVisible}
              okLabel={lang.getString("login")}
              cancelLabel={lang.getString("cancel")}
              onOk={() => {
                this.setState({ loginAlertVisible: false });
                this.props.navigation.navigate("auth");
              }}
              onCancel={() => this.setState({ loginAlertVisible: false })}
            />
          ) : null}
          <MaterialDialog
            title={lang.getString("you-need-to-purchase-suscribe")}
            visible={this.state.premiumAlertVisible}
            okLabel={lang.getString("buy-now")}
            cancelLabel={lang.getString("cancel")}
            onOk={() => {
              this.updateState({ premiumAlertVisible: false });
            }}
            onCancel={() => {
              this.updateState({ premiumAlertVisible: false });
            }}
          >
            <Text></Text>
          </MaterialDialog>
          {this.displayPlaylistModal()}
          {this.displayPaymentModal()}
          {jsx}
        </Container>
      </StyleProvider>
    );
  }

  loadDetails() {
    Api.get("user/detail", {
      id: this.props.userid,
      userid: this.props.userid,
      key: this.props.apikey,
    }).then((r) => {
      this.updateState({ details: r });
    });
  }

  show(jsx) {
    return (
      <StyleProvider style={getTheme(this.theme)}>
        <Container>
          {!this.isLoggedIn() ? (
            <MaterialDialog
              title={lang.getString("you-need-login")}
              visible={this.state.loginAlertVisible}
              okLabel={lang.getString("login")}
              cancelLabel={lang.getString("cancel")}
              onOk={() => {
                this.setState({ loginAlertVisible: false });
                this.props.navigation.navigate("auth");
              }}
              onCancel={() => this.setState({ loginAlertVisible: false })}
            >
              <Text></Text>
            </MaterialDialog>
          ) : null}
          {this.displayPlaylistModal()}
          {this.displayPaymentModal()}
          <MaterialDialog
            title={lang.getString("you-need-to-purchase-suscribe")}
            visible={this.state.premiumAlertVisible}
            okLabel={lang.getString("buy-now")}
            cancelLabel={lang.getString("cancel")}
            onOk={() => {
              this.updateState({ premiumAlertVisible: false });
              this.showPaymentModal(
                this.state.buyType,
                this.state.buyTypeId,
                this.state.buyPrice
              );
            }}
            onCancel={() => {
              this.updateState({ premiumAlertVisible: false });
            }}
          >
            <Text></Text>
          </MaterialDialog>
          <View style={{ flex: 1 }}>{jsx}</View>
          {this.state.player || this.state.player.playing ? (
            <View
              style={{
                width: "100%",
                height: 50,
                backgroundColor: this.theme.darkColor,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.play(
                    this.player.track,
                    this.player.type,
                    this.player.typeId
                  );
                }}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    backgroundColor: this.theme.darkColor,
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../images/icons/music_video.png")}
                    style={{ height: 30, width: 30 }}
                  ></Image>

                  {/* <View
                    style={{
                      flexDirection: "column",
                      marginLeft: 5,
                      paddingRight: 13,
                      flex: 1,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "white",
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      {this.player.track.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ color: "white", fontSize: 12, marginTop: 5 }}
                    >
                      {this.player.track.reposter.full_name}
                    </Text>
                  </View> */}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.player.goPrevious();
                      }}
                    >
                      <Image
                        source={require("../images/icons/previous.png")}
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
                          width: 25,
                          height: 25,
                          marginLeft: 20,
                          marginRight: 20,
                        }}
                      ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.player.goNext();
                      }}
                    >
                      <Image
                        source={require("../images/icons/next.png")}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      ></Image>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      color: this.theme.textColor,
                      fontSize: 15,
                      textAlign: "right",
                    }}
                  >
                    {this.player.track.title}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <Footer>
            <FooterTab>
              <Button
                style={{ borderRadius: 0 }}
                transparent
                vertical
                onPress={() =>
                  this.props.navigation.navigate("explore", {
                    player: this.player,
                  })
                }
              >
                <Image
                  source={require("../images/icons/explore.png")}
                  style={{ width: 20, height: 20, marginBottom: 2 }}
                ></Image>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color:
                      this.activeMenu === "browse"
                        ? this.theme.brandPrimary
                        : this.theme.blackColor,
                  }}
                >
                  {lang.getString("browse")}
                </Text>
              </Button>

              <Button
                style={{ borderRadius: 0 }}
                transparent
                vertical
                onPress={() =>
                  this.props.navigation.navigate("feed", {
                    player: this.player,
                  })
                }
              >
                <Image
                  source={require("../images/icons/feed.png")}
                  style={{ width: 20, height: 20, marginBottom: 2 }}
                ></Image>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color:
                      this.activeMenu === "feed"
                        ? this.theme.brandPrimary
                        : this.theme.blackColor,
                  }}
                >
                  {lang.getString("feed")}
                </Text>
              </Button>

              <Button
                style={{ borderRadius: 0 }}
                vertical
                onPress={() =>
                  this.props.navigation.navigate("artist", {
                    player: this.player,
                  })
                }
              >
                <Image
                  source={require("../images/icons/artist.png")}
                  style={{ width: 20, height: 20, marginBottom: 2 }}
                ></Image>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color:
                      this.activeMenu === "artists"
                        ? this.theme.brandPrimary
                        : this.theme.blackColor,
                  }}
                >
                  {lang.getString("artists")}
                </Text>
              </Button>

              <Button
                style={{ borderRadius: 0 }}
                vertical
                onPress={() =>
                  this.props.navigation.navigate("genres", {
                    player: this.player,
                  })
                }
              >
                <Image
                  source={require("../images/icons/genres.png")}
                  style={{ width: 20, height: 20, marginBottom: 2 }}
                ></Image>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color:
                      this.activeMenu === "genres"
                        ? this.theme.brandPrimary
                        : this.theme.blackColor,
                  }}
                >
                  {lang.getString("genres")}
                </Text>
              </Button>

              <Button
                style={{ borderRadius: 0, position: "relative" }}
                vertical
                onPress={() => {
                  if (!this.isLoggedIn()) {
                    this.props.navigation.navigate("account", {
                      player: this.player,
                    });
                  } else {
                    if (this.state.details != null)
                      this.openProfile(this.state.details);
                  }
                }}
              >
                <Image
                  source={require("../images/icons/library.png")}
                  style={{ width: 20, height: 20, marginBottom: 2 }}
                ></Image>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color:
                      this.activeMenu === "userProfile"
                        ? this.theme.brandPrimary
                        : this.theme.blackColor,
                  }}
                >
                  {lang.getString("my-profile")}
                </Text>
                {this.state.notifications > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 5,
                      width: 10,
                      height: 10,
                      borderRadius: 100,
                      backgroundColor: this.theme.brandPrimary,
                    }}
                  ></View>
                ) : null}
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }

  updateState(va) {
    //Toast.toastInstance = null;
    this.setState(va);
  }

  displayPlaylistModal() {
    return (
      <Modal
        isVisible={this.state.playlistModalVisible}
        onSwipe={() => this.updateState({ playlistModalVisible: false })}
        style={{ margin: 0 }}
        swipeDirection="down"
      >
        <PlaylistAddComponent
          trackId={this.state.playlistTrackId}
          component={this}
          navigation={this.props.navigation}
        />
      </Modal>
    );
  }

  displayPaymentModal() {
    let url =
      BASE_URL +
      "pay?type=" +
      this.state.paymentModalType +
      "&type_id=" +
      this.state.paymentModalTypeId +
      "&price=" +
      this.state.paymentModalPrice +
      "&userid=" +
      this.props.userid +
      "&key=" +
      this.props.apikey;
    injectedJs = `
      window.postMessage(window.location.href);
    `;
    return (
      <Modal
        isVisible={this.state.paymentModalVisible}
        onSwipe={() => this.updateState({ paymentModalVisible: false })}
        style={{ margin: 0 }}
        swipeDirection="down"
      >
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
              width: "100%",
              height: 48,
              backgroundColor: this.theme.greyHeaderBg,
              padding: 10,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.updateState({ paymentModalVisible: false });
              }}
            >
              <Icon
                name="close"
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
              {lang.getString("pay-now")}
            </Text>
          </View>

          <WebView
            source={{ uri: url }}
            startInLoadingState
            key={1}
            bounces={false}
            javaScriptEnabled={true}
            allowUniversalAccessFromFileURLs={true}
            userAgent={
              "Mozilla/5.0 (Linux; Android 4.4.4; One Build/KTU84L.H4) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/28.0.0.20.16;]"
            }
            onNavigationStateChange={(e) => {
              if (
                e.url.match("api/pay/success") ||
                e.url.match("api/pay/failed")
              ) {
                this.updateState({
                  paymentModalVisible: false,
                });
                if (e.url.match("api/pay/success")) {
                  this.successPayment();
                }

                if (e.url.match("api/pay/failed")) {
                  this.failedPayment();
                }
              }
            }}
          />
        </Container>
      </Modal>
    );
  }

  showBuyNow(type, typeId, price) {
    this.updateState({
      buyType: type,
      buyTypeId: typeId,
      buyPrice: price,
      premiumAlertVisible: true,
    });
  }

  successPayment() {
    Toast.show({
      text: lang.getString("payment-success"),
    });
  }

  failedPayment() {
    Toast.show({
      text: lang.getString("payment-failed"),
      type: "danger",
    });
  }

  showPaymentModal(type, typeId, price) {
    if (this.props.userid !== null) {
      this.updateState({
        paymentModalType: type,
        paymentModalTypeId: typeId,
        paymentModalPrice: price,
        paymentModalVisible: true,
      });
    } else {
      return this.showLoginAlert();
    }
  }

  openVideo(video) {
    this.player.pausePlayer();
    this.props.navigation.navigate("videoPlayer", {
      video: video,
      component: this,
      player: this.player,
    });
  }

  addToPlaylist(track) {
    if (!this.isLoggedIn()) return this.showLoginAlert();
    this.updateState({
      playlistTrackId: track,
      playlistModalVisible: true,
    });
  }

  play(item, type, typeId, index) {
    try {
      if (index === undefined) {
        this.state.itemLists = this.player.currentPlayList;
        this.limit = this.player.currentPlayListLimit;
        this.offset = this.player.currentPlayListOffset;
        this.player.track = item;
      }
      this.props.navigation.navigate("player", {
        item: item,
        type: type,
        typeId: typeId,
        index: index !== undefined ? index : this.player.currentPlayIndex,
        playList: index !== undefined ? null : this.player.currentPlayList,
        playLimit:
          index !== undefined ? null : this.player.currentPlayListLimit,
        playOffset:
          index !== undefined ? null : this.player.currentPlayListOffset,
        component: this,
        player: this.player,
        canPrepare: index !== undefined ? true : false,
      });
    } catch (e) {}
  }

  openPlaylist(item) {
    this.props.navigation.navigate("albumProfile", {
      item: item,
      component: this,
      player: this.player,
    });
  }

  openProfile(item) {
    this.props.navigation.push("userprofile", {
      item: item,
      component: this,
      player: this.player,
    });
  }

  validatePlayer() {
    this.player.updateComponent(this);
  }

  minimizePlayer(player) {
    this.player = player;
    this.updateState(
      update(this.state, {
        player: { $set: true },
      })
    );
  }

  isLoggedIn() {
    return !(this.props.userid === "" || this.props.userid === null);
  }

  gotoLogin() {
    this.props.navigation.navigate("auth");
  }

  showLoginAlert() {
    this.updateState({
      loginAlertVisible: true,
    });
  }

  isDownloading(id) {
    return Util.inArray(id, this.state.downloading);
  }

  isDownloaded(id) {
    return Util.inArray(id, this.state.downloaded);
  }

  download(item) {
    let downloading = [];
    downloading.push(...this.state.downloading);
    downloading.push(item.id);
    this.updateState({ downloading: downloading });

    Api.get("get/download/detail", {
      userid: this.props.userid,
      key: this.props.apikey,
      id: item.id,
    })
      .then((result) => {
        //console.log(`${RNFS.DocumentDirectoryPath} documentPath` );
        let savePath = `${RNFS.DocumentDirectoryPath}/` + result.name;
        RNFS.downloadFile({
          fromUrl: result.url,
          toFile: `${RNFS.DocumentDirectoryPath}/` + result.name,
          begin: (data) => {
            Realm.open({ schema: [trackSchema] }).then((realm) => {
              realm.write(() => {
                realm.create("track_download", {
                  id: parseInt(item.id),
                  details: JSON.stringify(item),
                  file: "",
                  jobid: data.jobId,
                });
              });
            });
          },
          background: true,
          progressDivider: 1,
        })
          .promise.then(() => {
            // console.log('downloadone')
            Realm.open({ schema: [trackSchema] }).then((realm) => {
              realm.write(() => {
                realm.create(
                  "track_download",
                  {
                    id: parseInt(item.id),
                    file: savePath,
                  },
                  true
                );
              });
            });
            this.loadDownloads();
          })
          .catch(() => {
            //console.log('Download failed');
            return Promise.reject(e);
          });
      })
      .catch(() => {
        let downloading = [];
        let ar = Util.deleteFromArray(item.id, this.state.downloading);
        downloading.push(...ar);
        this.updateState({ downloading: downloading });
        //console.log(e)
      });
  }

  deleteDownload(item) {
    //console.log('Deleting here')
    Realm.open({ schema: [trackSchema] }).then((realm) => {
      //console.log('Deleting here')
      realm.write(() => {
        let tracks = realm
          .objects("track_download")
          .filtered('id="' + parseInt(item.id) + '"');
        if (tracks.length > 0) {
          RNFS.stopDownload(tracks[0].jobid);
          realm.delete(tracks);

          this.loadDownloads();
        }
      });
    });
  }

  loadTags() {
    Api.get("get/trandingtag", {
      userid: this.props.userid,
      key: this.props.apikey,
      limit: 10,
    }).then((result) => {
      let lists = [];
      lists.push(...result);
      this.updateState({
        tagsList: lists,
      });
    });
  }

  loadGenres() {
    // this.state.genres.clear();
    Api.getWithCache(
      "genres",
      {
        userid: this.props.userid,
        key: this.props.apikey,
      },
      (result) => {
        this.updateState(
          update(this.state, {
            genres: { $set: result },
            selectedGenre: { $set: result[0].id },
          })
        );
      }
    );
  }
}

export default BaseScreen;
