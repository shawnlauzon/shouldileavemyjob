import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  // TODO support more than email
  const email = event.queryStringParameters?.email

  const result = await connection.execute(
    `SELECT id from users where email = ?`,
    [email]
  )
  console.log('SELECT result', result)

  return {
    statusCode: 200,
    body: result.size > 0 ? JSON.stringify({ id: result.rows[0].at(0) }) : '',
  }
})
