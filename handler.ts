"use strict";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import AWS, { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({ region: process.env.REGION });

const { IS_OFFLINE } = process.env;

const dynamoDbOfflineOptions = {
  region: "localhost",
  endpoint: "http://localhost:8000",
};

const db = IS_OFFLINE
  ? new DynamoDB.DocumentClient(dynamoDbOfflineOptions)
  : new DynamoDB.DocumentClient();

const TableName = `${process.env.STAGE}_payments`;

export const createPayment: Handler = async (
  event: APIGatewayProxyEventV2
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
        TableName,
        Item: payment,
      })
      .promise()
      .catch((e) => {
        throw new Error(e);
      });

    return {
      statusCode: 200,
      body: JSON.stringify(payment),
    };
  } catch (e) {
    console.error("[PAYMENTS API] - CREATE", e);

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Unable to create payment",
        error: e.message,
      }),
    };
  }
};

export const updatePayment: Handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const id = event.pathParameters.id;
    const data = JSON.parse(event.body);

    const response = await db
      .update({
        TableName,
        Key: { id },
        UpdateExpression:
          "set customer = :customer, amount = :amount, product = :product",
        ExpressionAttributeValues: {
          ":customer": data.customer,
          ":amount": data.amount,
          ":product": data.product,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise()
      .then((response) => response.Attributes)
      .catch((e) => {
        throw new Error(e);
      });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (e) {
    console.error("[PAYMENTS API] - UPDATE", e);

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Unable to update payment",
        error: e.message,
      }),
    };
  }
};

export const getPayment: Handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const id = event.pathParameters.id;

    const data = await db
      .get({
        TableName,
        Key: {
          id,
        },
      })
      .promise()
      .then((response) => response.Item)
      .catch((e) => {
        throw new Error(e);
      });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.error("[PAYMENTS API] - GET", e);

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Unable to get payment",
        error: e.message,
      }),
    };
  }
};

export const listPayments: Handler =
  async (): Promise<APIGatewayProxyResultV2> => {
    try {
      const data = await db
        .scan({ TableName })
        .promise()
        .then((response) => response.Items)
        .catch((e) => {
          throw new Error(e);
        });

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (e) {
      console.error("[PAYMENTS API] - LIST", e);

      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Unable to get payments",
          error: e.message,
        }),
      };
    }
  };

export const deletePayment: Handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const id = event.pathParameters.id;

    await db
      .delete({
        TableName,
        Key: {
          id,
        },
      })
      .promise()
      .catch((e) => {
        throw new Error(e);
      });

    return {
      statusCode: 200,
      body: "",
    };
  } catch (e) {
    console.error("[PAYMENTS API] - DELETE", e);

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Unable to delete payment",
        error: e.message,
      }),
    };
  }
};
