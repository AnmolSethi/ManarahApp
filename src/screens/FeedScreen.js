import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { Container, Content } from "native-base";
import { connect } from "react-redux";
import DisplayComponent from "../components/DisplayComponent";
import PleaseLoginComponent from "../utils/PleaseLoginComponent";
import { View, Text } from "react-native";

class FeedScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.activeMenu = "feed";
    this.state = {
      ...this.state,
    };

    this.props.navigation.addListener("didFocus", () => {
      this.updateState({ player: this.player.track !== null ? true : false });
      this.player.updateComponent(this.component);
      this.updateState({
        playing: this.player.playing,
        isPaused: this.player.isPaused,
      });
      this.checkAuth();
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
            {"Feed"}
          </Text>
        </View>
        <Content style={{ backgroundColor: this.theme.darkColor }}>
          {this.props.userid === null || this.props.userid === "" ? (
            <PleaseLoginComponent navigation={this.props.navigation} />
          ) : (
            <DisplayComponent
              type="feed"
              navigation={this.props.navigation}
              typeId=""
              displayType="small-list"
            />
          )}
        </Content>
        {/* <Tabs
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
            zIndex: 99,
            backgroundColor: this.theme.contentVariationBg,
            borderBottomWidth: 0,
            borderTopWidth: 0,
            borderColor: this.theme.headerBorderTopColor,
            elevation: 0,
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0,
            flex: 1,
            borderWidth: 0,
          }}
          tabBarUnderlineStyle={{ height: 3, bottom: 0 }}
        >
          <Tab heading={lang.getString("home").toUpperCase()}>
            <Content style={{ backgroundColor: this.theme.contentVariationBg }}>
              {ADMOB_ID !== "" ? (
                <View style={{ padding: 10 }}>
                  <AdMobBanner
                    adSize="fullBanner"
                    adUnitID={ADMOB_ID}
                    testDevices={[AdMobBanner.simulatorId]}
                    onAdFailedToLoad={(error) => console.error(error)}
                  />
                </View>
              ) : null}

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
                    {lang.getString("charts-new-hot")}
                  </Text>
                  <DisplayComponent
                    player={this.player}
                    navigation={this.props.navigation}
                    limit={10}
                    type="charts-new-hot"
                    typeId="all/this-week"
                    displayType="lists"
                  />
                </View>
              </View>
            </Content>
          </Tab>
          <Tab heading={lang.getString("feed").toUpperCase()}>
            <Content style={{ backgroundColor: this.theme.contentVariationBg }}>
              {this.props.userid === null || this.props.userid === "" ? (
                <PleaseLoginComponent navigation={this.props.navigation} />
              ) : (
                <DisplayComponent
                  type="feed"
                  navigation={this.props.navigation}
                  typeId=""
                  displayType="feed-list"
                />
              )}
            </Content>
          </Tab>
          <Tab heading={lang.getString("top-charts").toUpperCase()}>
            <Content style={{ backgroundColor: this.theme.contentVariationBg }}>
              {ADMOB_ID !== "" ? (
                <View style={{ padding: 10 }}>
                  <AdMobBanner
                    adSize="fullBanner"
                    adUnitID={ADMOB_ID}
                    testDevices={[AdMobBanner.simulatorId]}
                    onAdFailedToLoad={(error) => console.error(error)}
                  />
                </View>
              ) : null}
              <View style={{ backgroundColor: this.theme.contentVariationBg }}>
                <View>
                  <DisplayComponent
                    player={this.player}
                    navigation={this.props.navigation}
                    limit={10}
                    type="charts-top"
                    typeId="all/this-week"
                    displayType="lists"
                  />
                </View>
              </View>
            </Content>
          </Tab>
          <Tab heading={lang.getString("new-releases").toUpperCase()}>
            <Content style={{ backgroundColor: this.theme.contentVariationBg }}>
              {ADMOB_ID !== "" ? (
                <View style={{ padding: 10 }}>
                  <AdMobBanner
                    adSize="fullBanner"
                    adUnitID={ADMOB_ID}
                    testDevices={[AdMobBanner.simulatorId]}
                    onAdFailedToLoad={(error) => console.error(error)}
                  />
                </View>
              ) : null}
              <View style={{ backgroundColor: this.theme.contentVariationBg }}>
                <View>
                  <DisplayComponent
                    player={this.player}
                    navigation={this.props.navigation}
                    limit={10}
                    type="latest"
                    typeId=""
                    displayType="vertical-grid"
                  />
                </View>
              </View>
            </Content>
          </Tab>
        </Tabs> */}
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
})(FeedScreen);
