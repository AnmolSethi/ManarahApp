import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, Text, TouchableOpacity } from "react-native";
import { Container, Content, Form, Input, Item, Toast } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import Api from "../api";
import { Image } from "react-native";

class SettingsScreen extends BaseScreen {
  constructor(props) {
    super(props);

    this.user = this.props.navigation.getParam("detail");
    this.state = {
      ...this.state,
      name: this.user.full_name,
      bio: this.user.bio,
      website: this.user.website,
      city: this.user.city,
      twitter: this.user.twitter,
      facebook: this.user.facebook,
      youtube: this.user.youtube,
      vimeo: this.user.vimeo,
      soundcloud: this.user.soundcloud,
      instagram: this.user.instagram,
      loading: false,
    };
  }

  save() {
    if (this.state.name === "") {
      Toast.show({
        text: lang.getString("your-name-cannot-empty"),
        type: "danger",
      });
      return;
    }

    Api.get("account/save", {
      userid: this.props.userid,
      key: this.props.apikey,
      name: this.state.name,
      website: this.state.website,
      city: this.state.city,
      bio: this.state.bio,
      facebook: this.state.facebook,
      twitter: this.state.twitter,
      instagram: this.state.instagram,
      soundcloud: this.state.soundcloud,
      youtube: this.state.youtube,
      vimeo: this.state.vimeo,
    }).then(() => {
      Toast.show({
        text: lang.getString("account-settings-saved"),
      });
    });
  }

  render() {
    return this.show(
      <Container style={{ backgroundColor: this.theme.contentVariationBg }}>
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
            {lang.getString("edit-profile")}
          </Text>

          <View style={{ flex: 1 }}></View>
        </View>

        <Content
          style={{
            backgroundColor: this.theme.darkColor,
            alignContent: "center",
          }}
        >
          <Form style={{ padding: 10 }}>
            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("full-name")}
                value={this.state.name}
                onChangeText={(t) => this.updateState({ name: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("bio")}
                value={this.state.bio}
                onChangeText={(t) => this.updateState({ bio: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("city")}
                value={this.state.city}
                onChangeText={(t) => this.updateState({ city: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("facebook-handle")}
                value={this.state.facebook}
                onChangeText={(t) => this.updateState({ facebook: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("twitter-handle")}
                value={this.state.twitter}
                onChangeText={(t) => this.updateState({ twitter: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("instagram-handle")}
                value={this.state.instagram}
                onChangeText={(t) => this.updateState({ instagram: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("soundcloud-handle")}
                value={this.state.soundcloud}
                onChangeText={(t) => this.updateState({ soundcloud: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("vimeo-handle")}
                value={this.state.vimeo}
                onChangeText={(t) => this.updateState({ vimeo: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("youtube-handle")}
                value={this.state.youtube}
                onChangeText={(t) => this.updateState({ youtube: t })}
              />
            </Item>

            <Item
              floatingLabel
              style={{
                marginBottom: 10,
                backgroundColor: this.theme.textFieldColor,
              }}
            >
              <Input
                style={{ color: this.theme.textColor }}
                placeholder={lang.getString("website")}
                value={this.state.website}
                onChangeText={(t) => this.updateState({ website: t })}
              />
            </Item>

            <TouchableOpacity onPress={() => this.save()}>
              <View
                style={{
                  width: 300,
                  alignItems: "center",
                  marginBottom: 10,
                  height: 40,
                  justifyContent: "center",
                  backgroundColor: "#3F5C57",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 18,
                    color: this.theme.textColor,
                  }}
                >
                  {lang.getString("save-settings")}
                </Text>
              </View>
            </TouchableOpacity>
          </Form>
        </Content>
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
})(SettingsScreen);
