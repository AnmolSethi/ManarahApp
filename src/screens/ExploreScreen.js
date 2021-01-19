import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, Text, TouchableOpacity } from "react-native";
import { Container, Icon, Item, Input, Header } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import DisplayComponent from "../components/DisplayComponent";
import PeopleComponent from "../components/PeopleComponent";
import AlbumComponent from "../components/AlbumComponent";
import { ScrollView } from "react-native";
import { Button } from "react-native";
import { FlatGrid } from "react-native-super-grid";

class ExploreScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.activeMenu = "browse";
    this.state = {
      ...this.state,
      term: "",
    };
    this.loadTags();
  }

  render() {
    return this.show(
      <Container
        style={{ flex: 1, backgroundColor: this.theme.contentVariationBg }}
      >
        <Header
          searchBar
          rounded
          hasTabs
          style={{
            paddingBottom: 20,
            backgroundColor: this.theme.headerBg,
            height: 65,
          }}
        >
          <Item style={{ backgroundColor: "rgba(0,0,0,0.2)", top: 10 }}>
            <Icon style={{ color: "#E3E3E3" }} name="ios-search" />
            <Input
              style={{ color: "#E3E3E3" }}
              value={this.state.term}
              onChangeText={(t) => {
                this.updateState({ term: t });
                this.forceUpdate();
              }}
              placeholder={lang.getString("search_placeholder")}
            />
            <Icon
              style={{ color: "#303A4F" }}
              name="music-tone"
              type="SimpleLineIcons"
            />
          </Item>
        </Header>

        <ScrollView>
          <View style={{ height: 390 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
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
                {lang.getString("made-for-you")}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("latestTracks", {
                    player: this.player,
                    type: "global-spotlight",
                    displayType: "small-list",
                    title: lang.getString("made-for-you"),
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    margin: 10,
                    color: this.theme.brandPrimary,
                  }}
                >
                  {"View All"}
                </Text>
              </TouchableOpacity>
            </View>
            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={5}
              type="global-spotlight"
              typeId=""
              displayType="small-list"
            />
          </View>

          <View style={{ height: 340 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
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
                {"Top Artists"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("artist", {
                    player: this.player,
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    margin: 10,
                    color: this.theme.brandPrimary,
                  }}
                >
                  {"View All"}
                </Text>
              </TouchableOpacity>
            </View>
            <PeopleComponent
              noCache={true}
              key={this.state.term}
              type="artists"
              term={this.state.term}
              player={this.player}
              navigation={this.props.navigation}
              limit={6}
            />
          </View>
          <View style={{ height: 450 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
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
                {"Latest Tracks"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("latestTracks", {
                    player: this.player,
                    type: "latest",
                    displayType: "small-list",
                    title: "Latest Tracks",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    margin: 10,
                    color: this.theme.brandPrimary,
                  }}
                >
                  {"View All"}
                </Text>
              </TouchableOpacity>
            </View>

            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={6}
              type="latest"
              typeId=""
              displayType="small-list"
            />
          </View>

          <View style={{ height: 680 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
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
                {"Top 50"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("latestTracks", {
                    player: this.player,
                    type: "charts-top",
                    typeId: "all/this-week",
                    title: "Top 50",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    margin: 10,
                    color: this.theme.brandPrimary,
                  }}
                >
                  {"View All"}
                </Text>
              </TouchableOpacity>
            </View>

            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={10}
              type="charts-top"
              typeId="all/this-week"
              offset={0}
              displayType="small-list"
            />
          </View>

          <View style={{ height: 220 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
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
                {"Playlists"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("playlists", {
                    player: this.player,
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    margin: 10,
                    color: this.theme.brandPrimary,
                  }}
                >
                  {"View All"}
                </Text>
              </TouchableOpacity>
            </View>

            <AlbumComponent
              noCache={true}
              key={this.state.term}
              player={this.player}
              navigation={this.props.navigation}
              type="playlist"
              typeId={"search-" + this.state.term}
            />
          </View>

          <View style={{ height: 300 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "500",
                margin: 10,
                color: this.theme.brandPrimary,
              }}
            >
              {"Trending Tags"}
            </Text>
            <FlatGrid
              keyExtractor={(item) => item.id}
              items={this.state.tagsList}
              extraData={this.state}
              itemDimension={100}
              spacing={15}
              style={{
                borderRadius: 8,
              }}
              onEndReachedThreshold={0.5}
              fixed={false}
              ListEmptyComponent={
                !this.state.tagsList.length !== 0 ? (
                  <Text />
                ) : (
                  <EmptyComponent text={lang.getString("no_playlists_found")} />
                )
              }
              renderItem={({ item }) => this.displayGridItem(item)}
            />
          </View>
        </ScrollView>
      </Container>
    );
  }

  displayGridItem(item) {
    if (item === false) return null;
    return (
      <Button
        title={"#" + item.title}
        color={this.theme.brandPrimary}
        style={{
          color: "white",
          fontWeight: "700",
          fontStyle: "italic",
        }}
        onPress={() =>
          this.props.navigation.navigate("showTags", {
            typeId: item.title,
          })
        }
      >
        {"#" + item.title}
      </Button>
    );
  }

  displayGenres() {
    if (this.state.genres.length > 0) {
      let result = this.state.genres;
      let content = [];
      for (let i = 0; i < result.length; i++) {
        let genre = result[i];
        content.push(
          <View style={{ backgroundColor: this.theme.contentVariationBg }}>
            <View
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
                limit={4}
                type="genre"
                typeId={genre.id}
                displayType="horizontal-grid"
              />
            </View>
          </View>
        );
      }
      return <View>{content}</View>;
    }
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
})(ExploreScreen);
