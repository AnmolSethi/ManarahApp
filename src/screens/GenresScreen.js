import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import lang from "../utils/lang";
import { Container, Content, Header } from "native-base";
import { Platform } from "react-native";
import DisplayComponent from "../components/DisplayComponent";
import { ActivityIndicator } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import EmptyComponent from "../utils/EmptyComponent";
import { TouchableOpacity } from "react-native";

class GenresScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.activeMenu = "genres";
    this.state = {
      ...this.state,
    };
    this.loadGenres();
  }

  displayGenres() {
    if (this.state.genres.length > 0) {
      let result = this.state.genres;
      let content = [];
      for (let i = 0; i < result.length; i++) {
        let genre = result[i];
        content.push(
          <View
            style={{
              backgroundColor: this.theme.contentVariationBg,
              height: 200,
            }}
          >
            <View
              key={genre.id}
              style={{
                borderBottomWidth: 10,
                borderBottomColor: this.theme.borderLineColor,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  margin: 10,
                  color: this.theme.brandPrimary,
                }}
              >
                {genre.name}
              </Text>
              <DisplayComponent
                player={this.player}
                navigation={this.props.navigation}
                type="genre"
                typeId={genre.id}
                displayType="small-list"
              />
            </View>
          </View>
        );
      }
      return <View>{content}</View>;
    } else {
      return <ActivityIndicator style={{ alignSelf: "center" }} size="large" />;
    }
  }

  render() {
    return this.show(
      <Container style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            height: 48,
            backgroundColor: this.theme.tabColor,
            padding: 10,
            flexDirection: "row",
            justifyContent: "center",
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
            {lang.getString("genres")}
          </Text>
        </View>

        <View>
          <FlatGrid
            keyExtractor={(item) => item.id}
            items={this.state.genres}
            extraData={this.state}
            itemDimension={100}
            spacing={15}
            style={{
              height: 300,
            }}
            onEndReachedThreshold={0.5}
            fixed={false}
            ListEmptyComponent={
              !this.state.genres.length !== 0 ? (
                <Text />
              ) : (
                <EmptyComponent text={lang.getString("no_playlists_found")} />
              )
            }
            renderItem={({ item, index }) => this.displayGridItem(item)}
          />
        </View>

        {/* <Content>{this.displayGenres()}</Content> */}
      </Container>
    );
  }

  displayGridItem(item) {
    console.log(item);
    if (item === false) return null;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("latestTracks", {
            player: this.player,
            type: "genre",
            typeId: item.id,
            title: item.name,
          });
        }}
      >
        <View
          style={{
            backgroundColor: this.theme.tabColor,
            padding: 10,
            borderRadius: 2,
          }}
        >
          <Text
            style={{
              color: this.theme.textColor,
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
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
})(GenresScreen);
