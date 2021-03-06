import React from "react";
import BaseScreen from "../utils/BaseScreen";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text } from "native-base";
import lang from "../utils/lang";
import { connect } from "react-redux";
import { FlatGrid } from "react-native-super-grid";
import EmptyComponent from "../utils/EmptyComponent";
import Api from "../api";
import FastImage from "react-native-fast-image";
import { offlineSchema } from "../store/realmSchema";

class PeopleComponent extends BaseScreen {
  type = "";
  typeId = "";
  term = "";
  offset = 0;
  limit = 6;
  cacheFilter = "";
  limitList = false;

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      term: this.props.term,
    };
    this.type = this.props.type;
    this.limitList =
      this.props.limitList !== undefined ? this.props.limitList : false;
    this.userid =
      this.props.theUserid !== undefined ? this.props.theUserid : "";
    this.term = this.props.term !== undefined ? this.props.term : "";
    this.limit = this.props.limit !== undefined ? this.props.limit : 6;
    this.cacheFilter =
      this.props.cacheFilter !== undefined ? this.props.cacheFilter : "";
    this.component = this.props.component;
    this.noCache = this.props.noCache === undefined ? false : true;
  }

  componentDidMount() {
    this.loadLists(false);
  }

  loadLists(paginate) {
    this.updateState({ fetchFinished: false });
    let offset = this.offset;
    this.offset = this.limit + this.offset;
    if (!paginate && !this.cacheLoaded) {
      this.cacheLoaded = true;
      if (!this.noCache) {
        Realm.open({ path: "peoples.realm", schema: [offlineSchema] }).then(
          (realm) => {
            let name = this.type + this.userid + this.cacheFilter;
            let data = realm
              .objects("offline_schema")
              .filtered("id='" + name + "'");
            let value = null;
            for (let p of data) {
              value = p;
            }
            if (value !== null) {
              let lists = [];
              let data = JSON.parse(value.value);
              lists.push(...data);
              this.updateState({ itemLists: lists, fetchFinished: true });
            }
            //realm.close();
          }
        );
      }
    }

    Api.get("people/list", {
      userid: this.props.userid,
      key: this.props.apikey,
      type: this.type,
      theuserid: this.userid,
      term: this.term,
      offset: offset,
      limit: this.limit,
    })
      .then((result) => {
        let lists = [];
        if (paginate) {
          //more
          for (let i = 0; i < 6; i++) {
            lists.push(this.state.itemLists[i]);
          }
          lists.push(...result);
        } else {
          lists.push(...result);
          if (!this.noCache) {
            Realm.open({ path: "peoples.realm", schema: [offlineSchema] }).then(
              (realm) => {
                realm.write(() => {
                  let name = this.type + this.userid + this.cacheFilter;
                  realm.create(
                    "offline_schema",
                    { id: name, value: JSON.stringify(lists) },
                    true
                  );
                });
              }
            );
          }
        }
        this.updateState({
          itemLists: lists,
          fetchFinished: true,
          itemListNotEnd: result.length < 1 ? true : false,
        });
      })
      .catch(() => {
        this.updateState({ fetchFinished: true, itemListNotEnd: true });
      });
  }

  render() {
    return (
      <FlatGrid
        keyExtractor={(item, index) => item[index].full_name}
        items={this.state.itemLists}
        extraData={this.state}
        itemDimension={100}
        spacing={15}
        scrollEnabled={false}
        style={{ backgroundColor: this.theme.contentVariationBg }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (
            this.state.itemLists.length > 0 &&
            !this.state.itemListNotEnd &&
            this.state.limitList
          ) {
            this.loadLists(true);
          }
          return true;
        }}
        fixed={true}
        style={{ height: 200 }}
        ListFooterComponent={
          <View style={{ paddingVertical: 20 }}>
            {this.state.fetchFinished ? (
              <Text />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator
                  style={{ alignSelf: "center" }}
                  size="large"
                />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !this.state.fetchFinished ? (
            <Text />
          ) : (
            <EmptyComponent text={lang.getString("no_members_found")} />
          )
        }
        renderItem={({ item, index }) => this.displayGridItem(item)}
      />
    );
  }

  displayGridItem(item) {
    if (item === false) return null;
    return (
      <View style={{ flex: 1, alignContent: "center" }}>
        <TouchableOpacity
          onPress={() => {
            this.openProfile(item);
          }}
        >
          <FastImage
            style={{
              width: "100%",
              height: 100,
              marginBottom: 10,
              borderColor: "#D1D1D1",
              borderWidth: 1,
              borderRadius: 50,
            }}
            source={{
              uri: item.avatar,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.openProfile(item);
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              color: this.theme.textColor,
              fontWeight: "500",
            }}
          >
            {item.full_name}
          </Text>
        </TouchableOpacity>
      </View>
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
})(PeopleComponent);
