import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  let query
  let id
  if (event.queryStringParameters?.id) {
    query = `SELECT image from charts where id=?`
    id = event.queryStringParameters.id
  } else if (event.queryStringParameters?.user_id) {
    query = `SELECT image from charts where user_id=?`
    id = event.queryStringParameters.user_id
  } else {
    throw Error('Require id or user_id query parameter')
  }

  const result = await connection.execute(query, [id])

  if (result.size === 0) {
    return {
      statusCode: 404,
    }
  }

  const body = result.rows[0].at(0)

  return {
    statusCode: 200,
    body,
  }
})
