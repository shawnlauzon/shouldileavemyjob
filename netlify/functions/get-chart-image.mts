import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  console.log('url: ', event.headers.url)
  console.log('clientContext', context.clientContext)
  console.log('headers', event.headers)
  console.log('rawUrl', event.rawUrl)

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: Record<string, any> = result.rows[0]
  const image = row['image']

  return {
    statusCode: 200,
    body: JSON.stringify(image),
  }
})
