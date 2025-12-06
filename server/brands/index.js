import universal from "./universal.js";

const brandMap = {
  universal,
};

export function getBrandConfig(name = "universal") {
  return brandMap[name] || brandMap.universal;
}
