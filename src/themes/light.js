import { Platform, Dimensions, PixelRatio } from "react-native";
import platform from "../../native-base-theme/variables/platform";

export default light = {
  ...platform,
  tabBarTextColor: "#6b6b6b",
  tabBarTextSize: Platform.OS === "ios" ? 14 : 11,

  brandPrimary: "#ed9520",
  primaryTransparent: "rgba(250,0,82,0.2)",
  accentColor: "#141821",
  tabBarActiveTextColor: "#ed9520",
  tabActiveBgColor: "#F8F8F8",
  footerTabTextColor: "#141821",
  footerDefaultBg: "#F3F3F3",
  statusColor: "rgba(0,0,0,0.1)",

  // Tab
  tabDefaultBg: "#141821",
  topTabBarTextColor: "#FFF",
  topTabBarActiveTextColor: "#ed9520",
  topTabBarBorderColor: "#ed9520",
  topTabBarActiveBorderColor: "#ed9520",
  activeTab: "#141821",
  sTabBarActiveTextColor: "#ed9520",

  // Tabs
  tabBgColor: "#F8F8F8",

  headerBg: "#141821",

  borderLineColor: "#D4D4D4",

  //Container
  containerBgColor: "#fff",

  accountStatBg: "#F8F8F8",

  headerBorderTopColor: "#E2E2E2",
  contentBg: "#FFF",
  contentVariationBg: "#fff",
  contentVariationBorderColor: "#F5F5F5",
  greyColor: "#D1D1D1",
  lightGreyColor: "#F8F8F8",
  titleColor: "#141821",
  titleColorDark: "#000",
  whiteColor: "#fff",
  blackColor: "#000",
  greyHeaderBg: "#F8F8F8",

  brandTopColor: "#FDDBD3",

  toast: {
    danger: {
      backgroundColor: "#FA0052",
      width: 300,
      height: Platform.OS === "ios" ? 50 : 100,
      color: "#ffffff",
      fontSize: 15,
      lineHeight: 2,
      lines: 4,
      borderRadius: 15,
      fontWeight: "bold",
      yOffset: 40,
    },
    success: {
      backgroundColor: "#2ecc71",
      width: 300,
      height: Platform.OS === "ios" ? 50 : 100,
      color: "#ffffff",
      fontSize: 15,
      lineHeight: 2,
      lines: 4,
      borderRadius: 15,
      fontWeight: "bold",
      yOffset: 40,
    },
    warning: {
      backgroundColor: "#f39c12",
      width: 300,
      height: Platform.OS === "ios" ? 50 : 100,
      color: "#ffffff",
      fontSize: 15,
      lineHeight: 2,
      lines: 4,
      borderRadius: 15,
      fontWeight: "bold",
      yOffset: 40,
    },
    info: {
      backgroundColor: "#3498db",
      width: 300,
      height: Platform.OS === "ios" ? 50 : 100,
      color: "#ffffff",
      fontSize: 15,
      lineHeight: 2,
      lines: 4,
      borderRadius: 15,
      fontWeight: "bold",
      yOffset: 40,
    },
    brand: {
      backgroundColor: "#FA0052",
      width: 300,
      height: Platform.OS === "ios" ? 50 : 100,
      color: "#ffffff",
      fontSize: 15,
      lineHeight: 2,
      lines: 4,
      borderRadius: 15,
      fontWeight: "bold",
      yOffset: 40,
    },
  },
};
