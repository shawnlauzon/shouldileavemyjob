import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  const { body } = event

  if (!body) {
    return {
      statusCode: 400,
      body: 'Missing body',
    }
  }

  const {
    type,
    profile,
    cross,
    definition,
    innerAuthority,
    birthDateLocal,
    birthPlace,
    traits,
  } = JSON.parse(body)

  const result = await connection.execute(
    `INSERT INTO charts (careerType, publicRole, lifeWork, assimilation, decisionMakingStrategy,\
       birthDateLocal, birthPlace, traits) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      type,
      profile,
      cross,
      definition,
      innerAuthority,
      birthDateLocal,
      birthPlace,
      traits,
    ]
  )
  console.log('INSERT result', result)

  return {
    statusCode: 201,
  }
})
