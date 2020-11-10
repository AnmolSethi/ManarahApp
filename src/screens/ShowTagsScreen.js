import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Icon, Text } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import { FlatGrid } from "react-native-super-grid";
import EmptyComponent from "../utils/EmptyComponent";
import Api from "../api";
import FastImage from "react-native-fast-image";
import { BASE_CURRENCY } from "../config";
import { Container, Header } from "native-base";
import { Platform } from "react-native";

class ShowTagsScreen extends BaseScreen {
  typeId = "";
  offset = 0;
  limit = 50;

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      typeId: this.props.navigation.getParam("typeId"),
    };

    this.loadLists();
  }

  loadLists() {
    this.updateState({ fetchFinished: false });

    Api.get("load/tracks", {
      userid: this.props.userid,
      key: this.props.apikey,
      type: "search",
      type_id: this.state.typeId,
      limit: 50,
      offset: 0,
    })
      .then((result) => {
        let lists = [];
        lists.push(...result);
        this.updateState({
          tagsListSongs: lists,
          fetchFinished: true,
          itemListNotEnd: result.length < 1 ? true : false,
          refreshing: false,
        });
      })
      .catch(() => {
        this.updateState({
          fetchFinished: true,
          itemListNotEnd: true,
          refreshing: false,
        });
      });
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Header
          hasTabs
          noShadow
          style={{
            paddingTop: Platform.OS === "ios" ? 18 : 0,
            backgroundColor: this.theme.accentColor,
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

          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: this.theme.blackColor,
              fontSize: 20,
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            {"#" + this.state.typeId}
          </Text>

          <View style={{ flex: 1 }}></View>
        </View>

        <FlatGrid
          keyExtractor={(item) => item.id}
          items={this.state.tagsListSongs}
          extraData={this.state}
          itemDimension={130}
          spacing={15}
          onEndReachedThreshold={0.5}
          fixed={false}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.offset = 0;
            this.updateState({ refreshing: true });
            this.loadLists();
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
              <Text></Text>
            ) : (
              <EmptyComponent text={lang.getString("no_tracks_found")} />
            )
          }
          renderItem={({ item, index }) =>
            this.displayGridItem(item, index, true)
          }
        />
      </Container>
    );
  }
  displayGridItem(item, index, vertical) {
    if (item === false) return null;

    return (
      <View style={{ width: vertical ? null : 140, flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            this.play(item, this.state.type, this.state.typeId, index);
          }}
        >
          <FastImage
            style={{
              borderRadius: 5,
              width: "100%",
              height: 130,
              marginBottom: 10,
              borderColor: "#D1D1D1",
              borderWidth: 1,
            }}
            source={{
              uri: item.art_md,
            }}
            resizeMode={FastImage.resizeMode.cover}
          > 
            {this.props.setup.enable_store &&
            item.price !== "0.00" &&
            item.price > 0 ? (
              <View
                style={{
                  backgroundColor: this.theme.brandPrimary,
                  padding: 5,
                  borderRadius: 100,
                  width: 80,
                  margin: 7,
                  alignContent: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{ color: "#fff", alignSelf: "center" }}
                >
                  {BASE_CURRENCY}
                  {item.price}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                width: 40,
                height: 40,
                borderRadius: 100,
                alignContent: "center",
                position: "absolute",
                left: 50,
                top: 50,
              }}
            >
              <Icon
                name="play"
                style={{
                  color: this.theme.accentColor,
                  alignSelf: "center",
                  marginTop: 5,
                  marginLeft: 2,
                }}
              />
            </View>
          </FastImage>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.play(item, this.state.type, this.state.typeId, index);
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              color: this.theme.blackColor,
              fontWeight: "bold",
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
        {item.user !== undefined ? (
          <TouchableOpacity
            onPress={() => {
              this.openProfile(item.user);
            }}
          >
            <Text
              numberOfLines={1}
              note
              style={{ marginTop: 5, fontSize: 15, fontWeight: "400" }}
            >
              {item.user.full_name}
            </Text>
          </TouchableOpacity>
        ) : null}
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
})(ShowTagsScreen);
