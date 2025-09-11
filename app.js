import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import "react-native-get-random-values"; // <- Required for uuid

const App = () => {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
};

export default registerRootComponent(App);
