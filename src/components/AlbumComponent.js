import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text, Toast } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import EmptyComponent from "../utils/EmptyComponent";
import Api from "../api";
import FastImage from "react-native-fast-image";
import update from "immutability-helper";
import { offlineSchema } from "../store/realmSchema";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "react-native";
import { Platform } from "react-native";
import { Share } from "react-native";

class AlbumComponent extends BaseScreen {
  type = "";
  typeId = "";
  offset = 0;
  limit = 10;
  cacheFilter = "";

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      term: this.props.term,
    };
    this.type = this.props.type;
    this.typeId = this.props.typeId;
    this.limit = this.props.limit !== undefined ? this.props.limit : 10;
    this.cacheFilter =
      this.props.cacheFilter !== undefined
        ? this.props.cacheFilter
        : "playlist";
    this.component = this.props.component;
    this.noCache = this.props.noCache === undefined ? false : true;
    this.loadLists(false);
  }

  loadLists(paginate) {
    this.updateState({ fetchFinished: false });
    let offset = this.offset;
    this.offset = this.limit + this.offset;
    if (!paginate && !this.cacheLoaded) {
      this.cacheLoaded = true;
      if (!this.noCache) {
        Realm.open({ path: "albums.realm", schema: [offlineSchema] }).then(
          (realm) => {
            let name = this.type + this.typeId + this.cacheFilter;
            let data = realm
              .objects("offline_schema")
              .filtered("id='" + name + "'");
            let value = null;
            for (let p of data) {
              value = p;
            }
            if (value !== null) {
              let lists = [];
              let data = JSON.parse(value.value);
              lists.push(...data);
              this.updateState({ itemLists: lists, fetchFinished: true });
            }
          }
        );
      }
    }

    Api.get("list/playlist", {
      userid: this.props.userid,
      key: this.props.apikey,
      type: this.type,
      type_id: this.typeId,
      offset: offset,
      limit: this.limit,
    })
      .then((result) => {
        let lists = [];
        if (paginate) {
          //more
          lists.push(...this.state.itemLists);
          lists.push(...result);
        } else {
          lists.push(...result);
          if (!this.noCache) {
            Realm.open({ path: "albums.realm", schema: [offlineSchema] }).then(
              (realm) => {
                realm.write(() => {
                  let name =
                    this.state.type + this.state.typeId + this.cacheFilter;
                  realm.create(
                    "offline_schema",
                    { id: name, value: JSON.stringify(lists) },
                    true
                  );
                });
                //realm.close();
              }
            );
          }
        }
        this.updateState({
          itemLists: lists,
          fetchFinished: true,
          itemListNotEnd: result.length > 1 ? true : false,
        });
      })
      .catch(() => {
        this.updateState({ fetchFinished: true, itemListNotEnd: true });
      });
  }

  render() {
    return (
      <FlatList
        keyExtractor={(item) => item.id}
        data={this.state.itemLists}
        style={{ flex: 1 }}
        ref="_flatList"
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (this.state.itemLists.length > 0 && !this.state.itemListNotEnd) {
            this.loadLists(true);
          }
          return true;
        }}
        extraData={this.state}
        refreshing={this.state.refreshing}
        onRefresh={() => {
          this.offset = 0;
          this.updateState({ refreshing: true });
          this.loadLists(false);
        }}
        ListHeaderComponent={
          this.props.headerComponent !== undefined
            ? this.props.headerComponent
            : null
        }
        ListFooterComponent={
          <View>
            {this.state.fetchFinished ? (
              <Text />
            ) : (
              <ActivityIndicator size="large" />
            )}
          </View>
        }
        ListEmptyComponent={
          !this.state.fetchFinished ? (
            <Text />
          ) : (
            <EmptyComponent text={lang.getString("no_tracks_found")} />
          )
        }
        renderItem={({ item, index }) => {
          return this.displaySmallListItem1(item);
        }}
      />
    );
  }

  displaySmallListItem1(item) {
    return (
      <View
        style={{
          backgroundColor: this.theme.tabColor,
          margin: 10,
          borderRadius: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.openPlaylist(item);
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
            <TouchableOpacity
              onPress={() => {
                this.openProfile(item.user);
              }}
            >
              <FastImage
                style={{
                  width: 70,
                  height: 70,
                  marginTop: 4,
                  borderRadius: 35,
                }}
                source={{
                  uri: item.art,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 10, flexDirection: "row" }}>
              <View
                style={{ flex: 1, marginLeft: 10, flexDirection: "column" }}
              >
                <Text
                  style={{
                    color: "#94A7AF",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {item.user.username}
                </Text>
                <Text
                  style={{
                    color: this.theme.textColor,
                    fontSize: 16,
                    textAlign: "left",
                    marginTop: 6,
                    marginBottom: 6,
                  }}
                >
                  {item.name}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      item.hasLiked = item.hasLiked === 1 ? 0 : 1;
                      if (item.hasLiked === 1) {
                        Toast.show({
                          text: lang.getString("you-love-this"),
                          textStyle: {
                            color: this.theme.brandPrimary,
                            textAlign: "center",
                          },
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
                        type: "playlist",
                        type_id: item.id,
                      });
                    }}
                  >
                    <Image
                      source={require("../images/icons/Likes.png")}
                      style={{ height: 20, width: 20, marginRight: 5 }}
                    ></Image>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      let message = lang.getString("share-playlist");
                      if (Platform.OS !== "ios") message += " " + item.link;
                      Share.share(
                        {
                          message: message,
                          url: this.item.link,
                          title: lang.getString("share-playlist"),
                        },
                        {
                          dialogTitle: lang.getString("share-playlist"),
                        }
                      );
                    }}
                  >
                    <Image
                      source={require("../images/icons/Share.png")}
                      style={{ height: 20, width: 20, marginRight: 5 }}
                    ></Image>
                  </TouchableOpacity>

                  <Image
                    source={require("../images/icons/go_to_track.png")}
                    style={{ height: 20, width: 20, marginRight: 5 }}
                  ></Image>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
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
})(AlbumComponent);
