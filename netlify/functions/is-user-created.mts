import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  // TODO support more than email
  const email = event.queryStringParameters?.email
  console.log('checking for email ', email)

  const result = await connection.execute(
    `SELECT id from users where email = ?`,
    [email]
  )
  console.log('SELECT result', result)

  return {
    statusCode: result.size > 0 ? 200 : 404,
  }
})
