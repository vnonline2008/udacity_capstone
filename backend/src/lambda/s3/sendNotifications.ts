import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { createLogger } from '../../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { S3Handler, S3Event } from 'aws-lambda'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('sendNotifications')
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const connectionTable = process.env.CONNECTION_TABLE
const stage = process.env.STAGE
const apiId = process.env.API_ID
const connectionParam = {
    apiVersion: '2018-11-29',
    endpoint: `${apiId}.execute-api.us-east-2.amazonaws.com/${stage}`
}

const apiGateway = new XAWS.ApiGatewayManagementApi(connectionParam)

export const handler: S3Handler = async (event: S3Event) => {
    logger.info('[Send] S3 upload image notification')
    for (const record of event.Records) {
        const key = record.s3.object.key
        const connections = await docClient.scan({
            TableName: connectionTable
        }).promise()
        const payload = {imageId: key}

        for (const connect of connections.Items) {
            const connectId = connect.id
            await sendMessageToClient(connectId, payload)
            logger.info('[Sent] S3 upload image notification')
        }
    }
}

async function sendMessageToClient (connectId, payload) {
    try{
        logger.info(`[Sending] connectId: ${connectId} & payload: ${payload}`)
        await apiGateway.postToConnection({
            ConnectionId: connectId,
            Data: JSON.stringify(payload)
        }).promise()
        logger.info(`[Sent] connectId: ${connectId} & payload: ${payload}`)
    } catch (e) {
        logger.info(`[Sent] Failed to connectId: ${connectId} & payload: ${payload}`)
        logger.info(`[Error] ${JSON.stringify(e)}`)
        logger.info(`[Delete] deleting connection: ${connectId}`)
        if (e.statusCode === 410) {
            await docClient.delete({
                TableName: connectionTable,
                Key: {id: connectId}
            }).promise()
        }
    }
}