import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { Container, Header } from "native-base";
import { Platform } from "react-native";
import DisplayComponent from "../components/DisplayComponent";

class LatestTracks extends BaseScreen {
  typeId = "";
  term = "";
  offset = 0;
  limit = 10;
  cacheFilter = "";

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      term: this.props.term,
    };

    this.type = "latest";
    this.userid =
      this.props.theUserid !== undefined ? this.props.theUserid : "";
    this.term = this.props.term !== undefined ? this.props.term : "";
    this.limit = 10;
    this.cacheFilter =
      this.props.cacheFilter !== undefined ? this.props.cacheFilter : "";
    this.component = this.props.component;
    this.noCache = true;
  }

  render() {
    return this.show(
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
            justifyContent: "center",
            width: "100%",
            height: 48,
            backgroundColor: this.theme.accentColor,
            padding: 10,
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              marginLeft: 10,
              marginTop: 3,
            }}
          >
            {"Latest Tracks"}
          </Text>
        </View>

        <DisplayComponent
          player={this.player}
          navigation={this.props.navigation}
          limit={100}
          type="latest"
          typeId=""
          displayType="vertical-grid"
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
})(LatestTracks);
