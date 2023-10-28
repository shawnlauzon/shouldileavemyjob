import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  // TODO support more than email
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  const result = await connection.execute(
    `SELECT u.first_name, c.career_type, c.public_role, c.assimilation, c.decision_making_strategy, c.traits, i.answers from interviews i, users u, charts c where i.id = ? and i.user_id = u.id and c.user_id = u.id`,
    [id]
  )
  // console.log('SELECT result', result)

  if (result.size === 0) {
    return Response.json(null, { status: 404 })
  }

  const row = result.rows[0]
  const body = {
    user: {
      firstName: row.first_name,
    },
    chart: {
      careerType: row.career_type,
      publicRole: row.public_role,
      assimilation: row.assimilation,
      decisionMakingStrategy: row.decision_making_strategy,
      traits: row.traits,
    },
    answers: result.rows[0].answers,
  }
  // console.log('returning', body)

  return Response.json(body, { status: 200 })
})
