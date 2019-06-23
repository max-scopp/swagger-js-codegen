import { map, entries } from "lodash";
import { SwaggerType, Swagger } from "../swagger/Swagger";
import { TypeSpec } from "../typespec";
import { convertType } from "../typescript";

export interface Definition {
  readonly name: string;
  readonly description: string | undefined;
  readonly isClass: boolean;
  readonly tsType: TypeSpec;
}

export function makeDefinitionsFromSwaggerDefinitions(
  swaggerDefinitions: { [index: string]: SwaggerType },
  swagger: Swagger
): Definition[] {
  return map(entries(swaggerDefinitions), ([name, swaggerDefinition]) => {
    const tsType = convertType(swaggerDefinition, swagger);
    return {
      name,
      description: swaggerDefinition.description,
      isClass: tsType.isObject,
      tsType
    };
  });
}
