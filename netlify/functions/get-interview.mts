import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'

export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  // TODO support more than email
  const id = event.queryStringParameters?.id

  const result = await connection.execute(
    `SELECT u.first_name, c.career_type, c.public_role, c.assimilation, c.decision_making_strategy, c.traits, i.answers from interviews i, users u, charts c where i.id = ? and i.user_id = u.id and c.user_id = u.id`,
    [id]
  )
  // console.log('SELECT result', result)

  if (result.size === 0) {
    return {
      statusCode: 404,
    }
  }

  const row = result.rows[0]
  const body = {
    user: {
      firstName: row.at(0),
    },
    chart: {
      careerType: row.at(1),
      publicRole: row.at(2),
      assimilation: row.at(3),
      decisionMakingStrategy: row.at(4),
      traits: row.at(5),
    },
    answers: row.at(6),
  }
  // console.log('returning', body)

  return { statusCode: 200, body: JSON.stringify(body) }
})
