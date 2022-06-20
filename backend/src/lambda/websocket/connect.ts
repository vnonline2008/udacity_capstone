import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('websocket-connect')
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const connectionTable = process.env.CONNECTION_TABLE

export const handler: APIGatewayProxyHandler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`[Connect] Creating connection`)
    const connectId = event.requestContext.connectionId
    const timeStamp = new Date().toISOString()
    const item = {
        id: connectId,
        timeStamp
    }
    await docClient.put({
        TableName: connectionTable,
        Item: item
    }).promise()
    logger.info(`[Connect] Created connection`)
    return {
        statusCode: 200,
        body: ''
    }
})