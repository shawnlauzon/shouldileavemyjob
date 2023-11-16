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
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, updated_at = ? WHERE id = ?',
      [
        params.firstName,
        params.lastName,
        params.email,
        params.phoneNumber,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        params.id,
      ]
    )
    user = Object.assign({}, params)
    console.log('UPDATE result', result)
  } else {
    const result = await connection.execute(
      'INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)',
      [params.firstName, params.lastName, params.email]
    )
    user = Object.assign({ id: parseInt(result.insertId) }, params)
    console.log('INSERT result', result)
  }

  return {
    statusCode: params.id ? 200 : 201,
    body: JSON.stringify(user),
  }
})
