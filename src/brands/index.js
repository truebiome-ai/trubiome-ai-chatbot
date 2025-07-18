// brands/index.js

import biocidin from "./biocidin.js";

const brandMap = {
  biocidin,
  // future brands go here, like:
  // "gutgenius": import("./gutgenius.js")
};

export default function getBrandConfig(name = "biocidin") {
  return brandMap[name] || brandMap["biocidin"];
}
