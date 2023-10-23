import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('Params', params)

  const {
    userId,
    careerType,
    publicRole,
    assimilation,
    decisionMakingStrategy,
    traits,
  } = params

  const result = await connection.execute(
    `INSERT INTO charts (user_id, career_type, public_role, assimilation, decision_making_strategy,\
       traits) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      careerType,
      publicRole.toString(),
      assimilation,
      decisionMakingStrategy,
      JSON.stringify(traits),
    ]
  )
  console.log('INSERT result', result)

  const chart = Object.assign({ id: result.insertId }, params)

  return Response.json(chart, {
    status: 201,
  })
})
