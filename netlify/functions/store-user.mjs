import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('params', params)

  let result
  let user
  if (params.id) {
    result = await connection.execute(
      'UPDATE users SET email = ? WHERE id = ?) VALUES (?, ?)',
      [params.email, params.id]
    )
    user = Object.assign({}, params)
  } else {
    result = await connection.execute(
      'INSERT INTO users (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)',
      [params.firstName, params.lastName, params.email, params.phoneNumber]
    )
    user = Object.assign({ id: result.insertId }, params)
  }
  console.log('INSERT result', result)

  return Response.json(user, {
    // 200 = UPDATE, 201 = INSERT
    status: params.id ? 200 : 201,
  })
})
