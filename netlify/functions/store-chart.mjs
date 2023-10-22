import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const {
    type,
    profile,
    cross,
    definition,
    innerAuthority,
    birthDateLocal,
    birthPlace,
    traits,
  } = await request.json()

  const result = await connection.execute(
    `INSERT INTO charts (career_type, public_role, life_work, assimilation, decision_making_strategy,\
       birth_date_local, birth_place, traits) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
