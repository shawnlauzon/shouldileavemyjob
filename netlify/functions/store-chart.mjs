import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('Params', params)

  const {
    careerType,
    publicRole,
    assimilation,
    decisionMakingStrategy,
    traits,
  } = params

  const result = await connection.execute(
    `INSERT INTO charts (career_type, public_role, assimilation, decision_making_strategy,\
       traits) VALUES (?, ?, ?, ?, ?)`,
    [
      careerType,
      publicRole.toString(),
      assimilation,
      decisionMakingStrategy,
      JSON.stringify(traits),
    ]
  )
  console.log('INSERT result', result)

  return {
    statusCode: 201,
  }
})
