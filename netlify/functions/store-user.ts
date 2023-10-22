import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  const { body } = event

  if (!body) {
    return {
      statusCode: 400,
      body: 'Missing body',
    }
  }

  const { email, name } = JSON.parse(body)

  const result = await connection.execute(
    'INSERT INTO users (email, name) VALUES (?, ?)',
    [email, name]
  )
  console.log('INSERT result', result)

  return {
    statusCode: 201,
  }
})
