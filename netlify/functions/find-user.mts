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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: Record<string, any> = result.rows[0]

  return {
    statusCode: 200,
    body:
      result.size > 0
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          JSON.stringify({ id: row['id'] })
        : '',
  }
})
