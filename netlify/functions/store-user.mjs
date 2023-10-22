import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  //export default async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const { email, firstName } = await request.json()
  console.log('email: ', email)
  console.log('firstName: ', firstName)

  const result = await connection.execute(
    'INSERT INTO users (email, first_name) VALUES (?, ?)',
    [email, firstName]
  )
  console.log('INSERT result', result)

  return new Response(result, {
    statusCode: 201,
  })
})
