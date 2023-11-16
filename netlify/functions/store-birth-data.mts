import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  if (!event.body) {
    throw Error('Expected body')
  }

  const {
    planetscale: { connection },
  } = context

  const params = JSON.parse(event.body)
  console.log('params', params)

  let user
  if (params.id) {
    const result = await connection.execute(
      'UPDATE birth_data SET datetime = ?, country = ?, city = ?, state = ?, updated_at = ? WHERE id = ?',
      [
        params.datetime,
        params.country,
        params.city,
        params.state,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        params.id,
      ]
    )
    user = Object.assign({}, params)
    console.log('UPDATE result', result)
  } else {
    const result = await connection.execute(
      'INSERT INTO birth_data (user_id, datetime, country, city, state) VALUES (?, ?, ?, ?, ?)',
      [
        params.userId,
        params.datetime,
        params.country,
        params.city,
        params.state,
      ]
    )
    user = Object.assign({ id: parseInt(result.insertId) }, params)
    console.log('INSERT result', result)
  }

  return {
    statusCode: params.id ? 200 : 201,
    body: user,
  }
})
