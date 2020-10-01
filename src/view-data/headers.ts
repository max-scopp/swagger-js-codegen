import { HttpOperation, Swagger } from "../swagger/Swagger";
import { TypeSpecParameter } from "./parameter";

export interface Header {
  name: string;
  isSingleton: boolean;
  value?: string;
}

export function getHeadersForMethod(
  op: HttpOperation,
  params: TypeSpecParameter[],
  swagger: Swagger
): Header[] {
  const headers: Header[] = [];
  const produces = op.produces || swagger.produces;

  if (produces) {
    headers.push({
      name: "Accept",
      value: `'${produces.join(", ")}'`,
      isSingleton: true,
    });
  }

  const consumes = op.consumes || swagger.consumes;
  if (consumes) {
    const preferredContentType = consumes[0] || "";
    headers.push({
      name: "Content-Type",
      value: `'${preferredContentType}'`,
      isSingleton: true,
    });
  }

  const headerParams = params.filter((param) => param.isHeaderParameter);

  headers.push(
    ...headerParams.map((param) => ({ name: param.name, isSingleton: false }))
  );

  return headers;
}
