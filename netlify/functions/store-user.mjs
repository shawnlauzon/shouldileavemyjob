import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
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

  return Response.json(user, {
    // 200 = UPDATE, 201 = INSERT
    status: params.id ? 200 : 201,
  })
})
