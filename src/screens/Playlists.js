import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { Container, Header } from "native-base";
import { Platform } from "react-native";
import AlbumComponent from "../components/AlbumComponent";

class Playlists extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    };
  }

  render() {
    return this.show(
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
            justifyContent: "center",
            width: "100%",
            height: 48,
            backgroundColor: this.theme.tabColor,
            padding: 10,
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: this.theme.textColor,
              fontSize: 17,
              marginLeft: 10,
              marginTop: 3,
            }}
          >
            {"Playlists"}
          </Text>
        </View>

        <AlbumComponent
          noCache={true}
          key={""}
          player={this.player}
          navigation={this.props.navigation}
          type="playlist"
          typeId={"search-" + ""}
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
})(Playlists);
