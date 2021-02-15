import React from "react";

import { View, Platform } from "react-native";
import BaseScreen from "./BaseScreen";

export default class StatusBarBackground extends BaseScreen {
  render() {
    return (
      <View
        style={{
          height: Platform.OS === "ios" ? 18 : 0,
          backgroundColor: this.theme.darkColor,
          zIndex: 11,
        }}
      />
    );
  }
}
