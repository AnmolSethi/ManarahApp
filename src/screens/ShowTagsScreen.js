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
import DisplayComponent from "../components/DisplayComponent";

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
            paddingLeft: 15,
            flexDirection: "row",
            alignContent: "stretch",
          }}
        >
          <View style={{ flex: 1 }}>
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

        <DisplayComponent
          player={this.player}
          navigation={this.props.navigation}
          limit={10}
          type="search"
          typeId={this.state.typeId}
          displayType="small-list"
        />
      </Container>
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
