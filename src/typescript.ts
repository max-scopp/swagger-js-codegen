import { Swagger, SwaggerSchema, SwaggerType } from "./swagger/Swagger";
import { isAnyTypeSpec, makeAnyTypeSpec } from "./type-mappers/any";
import { isArray, makeArrayTypeSpec } from "./type-mappers/array";
import { isBoolean, makeBooleanTypeSpec } from "./type-mappers/boolean";
import { isDateTypeSpec, makeDateTypeSpec } from "./type-mappers/date";
import {
  isDictionary,
  makeDictionaryTypeSpec,
} from "./type-mappers/dictionary";
import { isEnum, makeEnumTypeSpec } from "./type-mappers/enum";
import { isNumber, makeNumberTypeSpec } from "./type-mappers/number";
import { makeObjectTypeSpec } from "./type-mappers/object";
import { isReference, makeReferenceTypeSpec } from "./type-mappers/reference";
import { isSchema } from "./type-mappers/schema";
import { isString, makeStringTypeSpec } from "./type-mappers/string";
import { isVoidType, makeVoidTypeSpec } from "./type-mappers/void";
import { TypeSpec } from "./typespec";

/**
 * Recursively converts a swagger type description into a typescript type, i.e., a model for our mustache
 * template. By adding typescript type information.
 *
 * Not all type are currently supported, but they should be straightforward to add.
 *
 * @param swaggerType a swagger type definition, i.e., the right hand side of a swagger type definition.
 * @param swagger the full swagger spec object
 * @returns a recursive structure representing the type, which can be used as a template model.
 */
export function convertType(
  swaggerType: SwaggerType,
  swagger: Swagger
): TypeSpec {
  if (isSchema(swaggerType)) {
    return convertType(swaggerType.schema, swagger);
  } else if (isReference(swaggerType)) {
    return makeReferenceTypeSpec(swaggerType);
  } else if (isEnum(swaggerType)) {
    return makeEnumTypeSpec(swaggerType);
  } else if (isDateTypeSpec(swaggerType)) {
    return makeDateTypeSpec(swaggerType);
  } else if (isString(swaggerType)) {
    return makeStringTypeSpec(swaggerType);
  } else if (isNumber(swaggerType)) {
    return makeNumberTypeSpec(swaggerType);
  } else if (isBoolean(swaggerType)) {
    return makeBooleanTypeSpec(swaggerType);
  } else if (isArray(swaggerType)) {
    return makeArrayTypeSpec(swaggerType, swagger);
  } else if (isDictionary(swaggerType)) {
    // case where a it's a Dictionary<string, someType>
    return makeDictionaryTypeSpec(swaggerType, swagger);
  } else if (isAnyTypeSpec(swaggerType)) {
    return makeAnyTypeSpec(swaggerType);
  } else if (isVoidType(swaggerType)) {
    return makeVoidTypeSpec(swaggerType);
  }

  // Remaining types are created as objects
  return makeObjectTypeSpec(swaggerType, swagger);
}

/**
 * TODO: Add Docs
 *
 * @param swaggerType a swagger type definition, i.e., the right hand side of a swagger type definition.
 * @param swagger the full swagger spec object
 * @returns a recursive structure representing the type, which can be used as a template model.
 */
export function convertSchemaToModelType(
  swaggerType: SwaggerSchema,
  swagger: Swagger
): string | undefined {
  const type = convertType(swaggerType.schema, swagger);

  if (!type.isAtomic) {
    if (type.isArray && type.elementType) {
      return type.elementType.target;
    } else {
      return type.target;
    }
  }
}

/**
 * Recursively converts an Array of swagger type description into a typescript type,
 * i.e., a model for our mustache template. By adding typescript type information.
 *
 * @param {SwaggerType[]} swaggerTypes - An array of SwaggerTypes.
 * @param {Swagger} swagger - A Swagger schema.
 * @returns {TypeSpec[]} An array of TypeSpecs.
 */
export const convertTypes = (
  swaggerTypes: SwaggerType[],
  swagger: Swagger
): TypeSpec[] =>
  swaggerTypes.map((swaggerType) => convertType(swaggerType, swagger));
