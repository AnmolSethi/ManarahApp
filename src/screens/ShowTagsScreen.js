import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import { connect } from "react-redux";
import Api from "../api";
import { Container, Header } from "native-base";
import { Platform } from "react-native";
import DisplayComponent from "../components/DisplayComponent";
import { Image } from "react-native";

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
      <Container style={{ flex: 1, backgroundColor: this.theme.darkColor }}>
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
            backgroundColor: this.theme.tabColor,
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
              <Image
                source={require("../images/icons/back.png")}
                style={{ height: 30, width: 30 }}
              ></Image>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              flex: 1,
              color: this.theme.textColor,
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
