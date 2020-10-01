import * as prettier from "prettier";
import { defaults } from "lodash";

const DEFAULT_BEAUTIFY_OPTIONS = { parser: "babel-ts" };

export type Beautify = ((source: string) => string) | boolean | undefined;

export type BeautifyOptions = prettier.Options;

export function beautifyCode(
  beautify: Beautify,
  source: string,
  options: BeautifyOptions = {}
): string {
  // Backwards compatible js_beautify
  if (beautify === undefined || beautify === true) {
    return prettier.format(source, defaults(options, DEFAULT_BEAUTIFY_OPTIONS));
  }

  // Run the beautify function if it has been provided
  if (typeof beautify === "function") {
    return beautify(source);
  }

  // Return original source if no beautify option was given
  return source;
}
