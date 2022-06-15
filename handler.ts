"use strict";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  Callback,
  Handler,
} from "aws-lambda";
import {
  createPayment,
  updatePayment,
  getPayment,
  listPayments,
  deletePayment,
} from "controllers/index";
import { getFunction } from "utils/index";

export const api: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResultV2> => {
  const { functionName } = context;

  switch (getFunction(functionName)) {
    case "createPayment":
      return createPayment(event, context, callback);
    case "updatePayment":
      return updatePayment(event, context, callback);
    case "getPayment":
      return getPayment(event, context, callback);
    case "listPayments":
      return listPayments(event, context, callback);
    case "deletePayment":
      return deletePayment(event, context, callback);
    default:
      break;
  }

  return {
    statusCode: 404,
    body: "",
  };
};
