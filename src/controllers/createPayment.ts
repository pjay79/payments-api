"use strict";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  Callback,
  Handler,
} from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { response } from "utils/index";
import { db, tableName } from "models/payments";

const createPayment: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResultV2> => {
  try {
    const data = JSON.parse(event.body);

    const payment = {
      id: uuidv4(),
      customer: data.customer,
      amount: data.amount,
      product: data.product,
    };

    await db
      .put({
        TableName: tableName,
        Item: payment,
      })
      .promise()
      .catch((e) => {
        throw new Error(e);
      });

    return response(200, payment);
  } catch (e) {
    console.error("[PAYMENTS API] - CREATE", e);

    const error = {
      message: "Unable to create payment",
      error: e.message,
    };

    return response(404, error);
  }
};

export default createPayment;
