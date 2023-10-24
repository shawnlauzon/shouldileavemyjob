import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  // TODO support more than email
  const url = new URL(request.url)
  const email = url.searchParams.get('email')

  const result = await connection.execute(
    `SELECT id from users where email = ?`,
    [email]
  )
  console.log('SELECT result', result)

  return Response.json(result.size > 0 ? { id: result.rows[0].id } : null, {
    status: 200,
  })
})
