import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('params', params)

  const { userId, email, firstName, lastName, phoneNumber } = params

  let result
  if (userId) {
    result = await connection.execute(
      'UPDATE users SET email = ?, first_name = ?, last_name = ?, phone_number = ? WHERE user_id = ?) VALUES (?, ?, ?, ?, ?)',
      [email, firstName, lastName, phoneNumber, userId]
    )
  } else {
    result = await connection.execute(
      'INSERT INTO users (email, first_name, last_name, phone_number) VALUES (?, ?, ?, ?)',
      [email, firstName, lastName, phoneNumber]
    )
  }
  console.log('INSERT result', result)

  const user = Object.assign({ userId: result.insertId }, params)

  return Response.json(user, {
    // 200 = UPDATE, 201 = INSERT
    statusCode: userId ? 200 : 201,
  })
})
