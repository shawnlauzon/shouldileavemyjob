import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('params', params)

  const result = await connection.execute(
    'INSERT INTO interviews (user_id, answers, conclusion) VALUES (?, ?, ?)',
    [params.userId, params.answers, params.conclusion]
  )
  const interview = Object.assign({ id: parseInt(result.insertId) }, params)
  console.log('INSERT result', interview)

  return Response.json(interview, {
    status: 201,
  })
})
