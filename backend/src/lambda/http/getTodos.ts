import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllByPageIndex } from '../../businessLogic/todos'
import { getUserId, getParams } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let pageIndex:any = getParams(event, 'pageIndex')
    logger.info(`Validate pageIndex ${pageIndex}`)
    // Make sure pageIndex is a number
    if (!(pageIndex instanceof Number) ){
      pageIndex = Number(pageIndex)
    }
    const todos = await getAllByPageIndex(getUserId(event), pageIndex)
    return {
      statusCode: 200,
      body: JSON.stringify({todos})
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
