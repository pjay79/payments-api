'use strict';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from 'aws-lambda';
import AWS, { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({ region: process.env.REGION });

const db = new DynamoDB.DocumentClient();

const TableName = `${process.env.STAGE}_payments`;

export const createPayment: Handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const data = JSON.parse(event.body);

  const payment = {
    id: uuidv4(),
    customer: data.customer,
    amount: data.amount,
    product: data.product
  }

  await db
    .put({
      TableName,
      Item: payment,
    })
    .promise().catch(err => console.error(err))

  return { 
    statusCode: 200, 
    body: JSON.stringify(payment),
  }
};

export const updatePayment: Handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const id = event.pathParameters.id;
  const data = JSON.parse(event.body);

  const response = await db
    .update({
      TableName,
      Key: { id },
      UpdateExpression: "set customer = :customer, amount = :amount, product = :product",
      ExpressionAttributeValues: {
        ":customer": data.customer, 
        ":amount": data.amount, 
        ":product": data.product, 
      },
      ReturnValues: "ALL_NEW"
    })
    .promise()
    .then(response => response.Attributes)
    .catch(error => console.error(error))

  return { 
    statusCode: 200, 
    body: JSON.stringify(response),
  }
};

export const getPayment: Handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const id = event.pathParameters.id;
  
  const data = await db
    .get({
      TableName,
      Key: {
        id,
      },
    })
    .promise()
    .then(response => response.Item)
    .catch(error => console.error(error))

  return { 
    statusCode: 200, 
    body: JSON.stringify(data),
  }
};

export const listPayments: Handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  
  const data = await db
    .scan({ TableName })
    .promise()
    .then(response => response.Items)
    .catch(error => console.error(error))

  return { 
    statusCode: 200, 
    body: JSON.stringify(data),
  }
};

export const deletePayment: Handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const id = event.pathParameters.id;

  await db
    .delete({
      TableName,
      Key: {
        id,
      },
    })
    .promise().catch(error => console.error(error))

  return { 
    statusCode: 200, 
    body: ''
  }
};

