import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Container, Item, Input, Header } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import DisplayComponent from "../components/DisplayComponent";
import PeopleComponent from "../components/PeopleComponent";
import AlbumComponent from "../components/AlbumComponent";
import { ScrollView } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import { Image } from "react-native";

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
      <Container style={{ flex: 1, backgroundColor: this.theme.darkColor }}>
        <Header
          searchBar
          rounded
          hasTabs
          style={{
            paddingBottom: 20,
            backgroundColor: this.theme.tabColor,
            height: 65,
          }}
        >
          <Item style={{ backgroundColor: this.theme.darkColor, top: 10 }}>
            <Image
              source={require("../images/icons/search.png")}
              style={{ height: 20, width: 20, marginLeft: 10, marginRight: 20 }}
            ></Image>
            <Input
              style={{ color: this.theme.textColor }}
              value={this.state.term}
              onChangeText={(t) => {
                this.updateState({ term: t });
                this.forceUpdate();
              }}
              placeholder={lang.getString("search_placeholder")}
            />
          </Item>
        </Header>

        <ScrollView>
          <View style={{}}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.heading_text}>
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
                <Text style={styles.heading_text}>{"View All"}</Text>
              </TouchableOpacity>
            </View>
            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={3}
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
              <Text style={styles.heading_text}>{"Top Artists"}</Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("artist", {
                    player: this.player,
                  });
                }}
              >
                <Text style={styles.heading_text}>{"View All"}</Text>
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
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.heading_text}>{"Latest Tracks"}</Text>

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
                <Text style={styles.heading_text}>{"View All"}</Text>
              </TouchableOpacity>
            </View>

            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={5}
              type="latest"
              typeId=""
              displayType="small-list"
            />
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.heading_text}>{"Top 50"}</Text>

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
                <Text style={styles.heading_text}>{"View All"}</Text>
              </TouchableOpacity>
            </View>

            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={5}
              type="charts-top"
              typeId="all/this-week"
              offset={0}
              displayType="small-list"
            />
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.heading_text}>{"Playlists"}</Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("playlists", {
                    player: this.player,
                  });
                }}
              >
                <Text style={styles.heading_text}>{"View All"}</Text>
              </TouchableOpacity>
            </View>

            <AlbumComponent
              noCache={true}
              key={this.state.term}
              player={this.player}
              navigation={this.props.navigation}
              type="playlist"
              limit={3}
              typeId={"search-" + this.state.term}
            />
          </View>

          <View style={{ height: 200 }}>
            <Text style={styles.heading_text}>{"Trending Tags"}</Text>
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
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("showTags", {
            typeId: item.title,
          })
        }
      >
        <View style={{ backgroundColor: this.theme.darkColor }}>
          <Text style={{ color: this.theme.textColor, textAlign: "left" }}>
            {"#" + item.title}
          </Text>
        </View>
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  heading_text: {
    fontSize: 16,
    fontWeight: "normal",
    margin: 10,
    color: "#FFD3AE",
  },
});

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
