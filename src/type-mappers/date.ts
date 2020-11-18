import { SwaggerType } from "../swagger/Swagger";
import { makeTypeSpecFromSwaggerType, TypeSpec } from "../typespec";

export interface DateTypeSpec extends TypeSpec {
  readonly isRef: true;
  readonly target: "Date";
}

export const isDateTypeSpec = (swaggerType: SwaggerType): boolean =>
  swaggerType.type === "string" &&
  ["date-time", "date", "time"].indexOf(String(swaggerType.format)) >= 0;

export function makeDateTypeSpec(swaggerType: SwaggerType): DateTypeSpec {
  return {
    ...makeTypeSpecFromSwaggerType(swaggerType),
    isRef: true,
    tsType: "ref",
    target: "Date",
  };
}
