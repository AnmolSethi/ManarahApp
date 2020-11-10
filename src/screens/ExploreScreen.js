import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, Text } from "react-native";
import { Container, Icon, Item, Input, Header } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import DisplayComponent from "../components/DisplayComponent";
import PeopleComponent from "../components/PeopleComponent";
import AlbumComponent from "../components/AlbumComponent";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { Button } from "react-native";
import Api from "../api";
import { FlatGrid } from "react-native-super-grid";
import { TouchableOpacity } from "react-native";

// http://manarahapp.com/?userid=AnmolSethi&key=o0q0aOmm4M0JEA&p=api/o0q0aOmm4M0JEA/load/tracks&type=charts-top&limit=50&offset=0&type_id=all/this-week

// http://manarahapp.com/?userid=AnmolSethi&key=o0q0aOmm4M0JEA&p=api/o0q0aOmm4M0JEA/get/trandingtag&limit=10

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
          <View>
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
            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={4}
              type="global-spotlight"
              typeId=""
              displayType="horizontal-grid"
            />
          </View>

          <View style={{ height: 340 }}>
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
          <View style={{ height: 410 }}>
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
            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={6}
              type="latest"
              typeId=""
              displayType="vertical-grid"
            />
          </View>

          <View style={{ height: 3160 }}>
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
            <DisplayComponent
              player={this.player}
              navigation={this.props.navigation}
              limit={50}
              type="charts-top"
              typeId="all/this-week"
              offset={0}
              displayType="small-list"
            />
          </View>

          <View style={{ height: 240 }}>
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
              style={{ backgroundColor: this.theme.contentVariationBg }}
              onEndReachedThreshold={0.5}
              fixed={false}
              style={{ height: 200 }}
              ListEmptyComponent={
                !this.state.tagsList.length !== 0 ? (
                  <Text />
                ) : (
                  <EmptyComponent text={lang.getString("no_playlists_found")} />
                )
              }
              renderItem={({ item, index }) => this.displayGridItem(item)}
            />
          </View>
        </ScrollView>

        {/* {this.state.term === "" ? (
          <Tabs
            locked={Platform.OS === "ios" ? false : true}
            renderTabBar={() => (
              <ScrollableTab
                style={{
                  borderBottomWidth: 0,
                  borderTopWidth: 0,
                  borderColor: light.headerBorderTopColor,
                }}
              />
            )}
            style={{
              paddingTop: 0,
              backgroundColor: this.theme.contentVariationBg,
              elevation: 0,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0,
              flex: 1,
              borderWidth: 0,
            }}
            tabBarUnderlineStyle={{ height: 3, bottom: 0 }}
          >
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("explore").toUpperCase()}
            >
              <DisplayComponent
                player={this.player}
                navigation={this.props.navigation}
                limit={10}
                type="latest"
                typeId=""
                displayType="vertical-grid"
              />
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("genres").toUpperCase()}
            >
              <Content>{this.displayGenres()}</Content>
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("artists").toUpperCase()}
            >
              <PeopleComponent
                type="artists"
                player={this.player}
                navigation={this.props.navigation}
                limit={10}
              />
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("playlists").toUpperCase()}
            >
              <AlbumComponent
                player={this.player}
                navigation={this.props.navigation}
                type="playlist"
                typeId="discover"
              />
            </Tab>
             <Tab style={{ backgroundColor: this.theme.contentVariationBg }} heading={lang.getString('albums').toUpperCase()}>
                    <AlbumComponent player={this.player} navigation={this.props.navigation} type="album" typeId="discover" />
                </Tab> 
          </Tabs>
        ) : (
          <Tabs
            renderTabBar={() => (
              <ScrollableTab
                style={{
                  borderBottomWidth: 0,
                  borderTopWidth: 0,
                  borderColor: light.headerBorderTopColor,
                }}
              />
            )}
            style={{
              paddingTop: 0,
              elevation: 0,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0,
              flex: 1,
              borderWidth: 0,
            }}
            tabBarUnderlineStyle={{ height: 0, top: -1 }}
          >
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("tracks").toUpperCase()}
            >
              <DisplayComponent
                noCache={true}
                key={this.state.term}
                player={this.player}
                navigation={this.props.navigation}
                limit={10}
                type="search"
                typeId={this.state.term}
                displayType="vertical-grid"
              />
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("people").toUpperCase()}
            >
              <PeopleComponent
                noCache={true}
                key={this.state.term}
                type="people"
                term={this.state.term}
                player={this.player}
                navigation={this.props.navigation}
                limit={10}
              />
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("artists").toUpperCase()}
            >
              <PeopleComponent
                noCache={true}
                key={this.state.term}
                type="artists"
                term={this.state.term}
                player={this.player}
                navigation={this.props.navigation}
                limit={10}
              />
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("playlists").toUpperCase()}
            >
              <AlbumComponent
                noCache={true}
                key={this.state.term}
                player={this.player}
                navigation={this.props.navigation}
                type="playlist"
                typeId={"search-" + this.state.term}
              />
            </Tab>
            <Tab
              style={{ backgroundColor: this.theme.contentVariationBg }}
              heading={lang.getString("albums").toUpperCase()}
            >
              <AlbumComponent
                noCache={true}
                key={this.state.term}
                player={this.player}
                navigation={this.props.navigation}
                type="album"
                typeId={"search-" + this.state.term}
              />
            </Tab>
          </Tabs>
        )} */}
      </Container>
    );
  }

  displayGridItem(item) {
    if (item === false) return null;
    return (
      <Button
        title={"#" + item.title}
        style={{
          color: "white",
          fontWeight: "700",
          fontStyle: "italic",
          backgroundColor: "#000",
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

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "500",
    margin: 15,
    color: "white",
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
