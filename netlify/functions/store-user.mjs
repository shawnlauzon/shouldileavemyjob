import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const { email, firstName, lastName, phoneNumber } = await request.json()

  const result = await connection.execute(
    'INSERT INTO users (email, first_name, last_name, phone_number) VALUES (?, ?, ?, ?)',
    [email, firstName, lastName, phoneNumber]
  )
  console.log('INSERT result', result)

  return new Response(result, {
    statusCode: 201,
  })
})
