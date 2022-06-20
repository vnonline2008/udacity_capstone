import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('websocket-disconnect')
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const connectionTable = process.env.CONNECTION_TABLE

export const handler: APIGatewayProxyHandler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`[Disconnect] Deleting connection`)
    const connectId = event.requestContext.connectionId
    const key = { id: connectId }
    await docClient.delete({
        TableName: connectionTable,
        Key: key
    }).promise()
    logger.info(`[Disconnect] Deleted connection`)
    return {
        statusCode: 200,
        body: ''
    }
})