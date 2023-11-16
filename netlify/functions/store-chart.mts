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
  console.log('Params', params)

  const {
    userId,
    careerType,
    publicRole,
    assimilation,
    decisionMakingStrategy,
    lifeWork,
    traits,
    image,
  } = params

  const result = await connection.execute(
    `INSERT INTO charts (user_id, career_type, public_role, assimilation, decision_making_strategy,\
       life_work, traits, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      careerType,
      publicRole.join('/'),
      assimilation,
      decisionMakingStrategy,
      lifeWork,
      JSON.stringify(traits),
      image,
    ]
  )
  console.log('INSERT result', result)

  const chart = Object.assign({ id: result.insertId }, params)

  return {
    statusCode: 201,
    body: JSON.stringify(chart),
  }
})
