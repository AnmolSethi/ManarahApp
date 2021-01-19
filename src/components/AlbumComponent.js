import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import EmptyComponent from "../utils/EmptyComponent";
import Api from "../api";
import { BASE_CURRENCY } from "../config";
import FastImage from "react-native-fast-image";
import { offlineSchema } from "../store/realmSchema";
import { FlatList } from "react-native-gesture-handler";

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
          itemListNotEnd: result.length < 1 ? true : false,
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
          <View style={{ paddingVertical: 20 }}>
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
          return this.displaySmallListItem(item, index);
        }}
      />

      // <FlatGrid
      //   keyExtractor={(item) => item.id}
      //   items={this.state.itemLists}
      //   extraData={this.state}
      //   scrollEnabled={true}
      //   itemDimension={100}
      //   spacing={15}
      //   style={{ backgroundColor: this.theme.contentVariationBg }}
      //   onEndReachedThreshold={0.5}
      //   onEndReached={() => {
      //     if (this.state.itemLists.length > 0 && !this.state.itemListNotEnd) {
      //       this.loadLists(true);
      //     }
      //     return true;
      //   }}
      //   fixed={false}
      //   style={{ height: 200 }}
      //   ListFooterComponent={
      //     <View style={{ paddingVertical: 20 }}>
      //       {this.state.fetchFinished ? (
      //         <Text />
      //       ) : (
      //         <View
      //           style={{
      //             justifyContent: "center",
      //             alignContent: "center",
      //             width: "100%",
      //             alignItems: "center",
      //           }}
      //         >
      //           <ActivityIndicator
      //             style={{ alignSelf: "center" }}
      //             size="large"
      //           />
      //         </View>
      //       )}
      //     </View>
      //   }
      //   ListEmptyComponent={
      //     !this.state.fetchFinished ? (
      //       <Text />
      //     ) : (
      //       <EmptyComponent text={lang.getString("no_playlists_found")} />
      //     )
      //   }
      //   renderItem={({ item, index }) => this.displayGridItem(item)}
      // />
    );
  }

  displaySmallListItem(item, index) {
    if (item === false) return null;

    return (
      <TouchableOpacity
        onPress={() => {
          this.openPlaylist(item);
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
          <FastImage
            style={{ width: 40, height: 40, marginTop: 4 }}
            source={{
              uri: item.art,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{ flex: 1, marginLeft: 10, flexDirection: "column" }}>
            <Text
              style={{
                color: this.theme.blackColor,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                color: this.theme.greyColor,
                fontSize: 13,
                marginTop: 5,
              }}
            >
              {item.user.full_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // displayGridItem(item) {
  //   if (item === false) return null;
  //   return (
  //     <View style={{ flex: 1 }}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           this.openPlaylist(item);
  //         }}
  //       >
  //         <FastImage
  //           style={{
  //             width: "100%",
  //             height: 130,
  //             marginBottom: 10,
  //             borderColor: "#D1D1D1",
  //             borderWidth: 1,
  //           }}
  //           source={{
  //             uri: item.art,
  //           }}
  //           resizeMode={FastImage.resizeMode.cover}
  //         >
  //           {this.props.setup.enable_store && item.price > 0 ? (
  //             <View
  //               style={{
  //                 backgroundColor: this.theme.brandPrimary,
  //                 padding: 5,
  //                 borderRadius: 100,
  //                 width: 80,
  //                 margin: 7,
  //                 alignContent: "center",
  //               }}
  //             >
  //               <Text
  //                 numberOfLines={1}
  //                 style={{ color: "#fff", alignSelf: "center" }}
  //               >
  //                 {BASE_CURRENCY}
  //                 {item.price}
  //               </Text>
  //             </View>
  //           ) : null}
  //         </FastImage>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => {
  //           this.openPlaylist(item);
  //         }}
  //       >
  //         <Text
  //           numberOfLines={1}
  //           style={{
  //             fontSize: 15,
  //             color: this.theme.blackColor,
  //             fontWeight: "500",
  //           }}
  //         >
  //           {item.name}
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }
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
