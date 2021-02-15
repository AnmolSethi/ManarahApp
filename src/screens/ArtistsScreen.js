import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { connect } from "react-redux";
import { View, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import lang from "../utils/lang";
import { FlatGrid } from "react-native-super-grid";
import EmptyComponent from "../utils/EmptyComponent";
import Api from "../api";
import FastImage from "react-native-fast-image";
import { offlineSchema } from "../store/realmSchema";
import { Container } from "native-base";

class ArtistScreen extends BaseScreen {
  type = "artists";
  typeId = "";
  term = "";
  offset = 0;
  limit = 10;
  cacheFilter = "";

  constructor(props) {
    super(props);
    this.activeMenu = "artists";
    this.state = {
      ...this.state,
      details: null,
      toggle: true,
      term: this.props.term,
    };

    this.type = "artists";
    this.userid =
      this.props.theUserid !== undefined ? this.props.theUserid : "";
    this.term = this.props.term !== undefined ? this.props.term : "";
    this.limit = 10;
    this.cacheFilter =
      this.props.cacheFilter !== undefined ? this.props.cacheFilter : "";
    this.component = this.props.component;
    this.noCache = true;

    this.loadLists(false);
  }

  loadLists(paginate) {
    this.updateState({ fetchFinished: false });
    let offset = this.offset;
    this.offset = this.limit + this.offset;
    if (!paginate && !this.cacheLoaded) {
      this.cacheLoaded = true;
      if (!this.noCache) {
        Realm.open({ path: "peoples.realm", schema: [offlineSchema] }).then(
          (realm) => {
            let name = this.type + this.userid + this.cacheFilter;
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

    Api.get("people/list", {
      userid: this.props.userid,
      key: this.props.apikey,
      type: this.type,
      theuserid: this.userid,
      term: this.term,
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
            Realm.open({ path: "peoples.realm", schema: [offlineSchema] }).then(
              (realm) => {
                realm.write(() => {
                  let name = this.type + this.userid + this.cacheFilter;
                  realm.create(
                    "offline_schema",
                    { id: name, value: JSON.stringify(lists) },
                    true
                  );
                });
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
    return this.show(
      <Container style={{ flex: 1, backgroundColor: this.theme.darkColor }}>
        <View
          style={{
            justifyContent: "center",
            width: "100%",
            height: 48,
            backgroundColor: this.theme.tabColor,
            padding: 10,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: this.theme.textColor,
              fontSize: 17,
              marginLeft: 10,
              marginTop: 3,
              fontWeight: "bold",
            }}
          >
            {lang.getString("artists")}
          </Text>
        </View>
        <FlatGrid
          keyExtractor={(item) => item.id}
          items={this.state.itemLists}
          extraData={this.state}
          itemDimension={150}
          spacing={15}
          style={{
            backgroundColor: this.theme.darkColor,
            height: 200,
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.state.itemLists.length > 0 && !this.state.itemListNotEnd) {
              this.loadLists(true);
            }
            return true;
          }}
          fixed={false}
          ListFooterComponent={
            <View style={{ paddingVertical: 20 }}>
              {this.state.fetchFinished ? (
                <Text />
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator
                    style={{ alignSelf: "center" }}
                    size="large"
                  />
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            !this.state.fetchFinished ? (
              <Text />
            ) : (
              <EmptyComponent text={lang.getString("no_members_found")} />
            )
          }
          renderItem={({ item }) => this.displayGridItem(item)}
        />
      </Container>
    );
  }

  displayGridItem(item) {
    if (item === false) return null;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.theme.darkColor,
          alignContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.openProfile(item);
          }}
        >
          <FastImage
            style={{
              width: "100%",
              height: 150,
              marginBottom: 10,
              borderColor: this.theme.textColor,
              borderWidth: 1,
              borderRadius: 110,
            }}
            source={{
              uri: item.avatar,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              color: this.theme.textColor,
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {item.full_name}
          </Text>
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
})(ArtistScreen);
