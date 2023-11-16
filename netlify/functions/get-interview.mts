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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: Record<string, any> = result.rows[0]
  const body = {
    user: {
      firstName: row['first_name'],
    },
    chart: {
      careerType: row['career_type'],
      publicRole: row['public_role'],
      assimilation: row['assimilation'],
      decisionMakingStrategy: row['decision_making_strategy'],
      traits: row['traits'],
    },
    answers: row['answers'],
  }
  // console.log('returning', body)

  return { statusCode: 200, body: JSON.stringify(body) }
})
