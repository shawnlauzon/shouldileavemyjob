import type { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'
import * as postmark from 'postmark'

export const handler: Handler = withPlanetscale(async (event, context) => {
  if (!event.body) {
    throw Error('Expected body')
  }

  const {
    planetscale: { connection },
  } = context

  const params = JSON.parse(event.body)
  console.log('params', params)

  const result = await connection.execute(
    'INSERT INTO interviews (user_id, answers) VALUES (?, ?)',
    [params.userId, params.answers]
  )
  const interview = Object.assign({ id: parseInt(result.insertId) }, params)
  console.log('INSERT result', interview)

  // Send an email:
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY || '')

  const actionUrl = event.headers.url + '/result?id=' + interview.id

  const emailResponse = await client.sendEmailWithTemplate({
    From: 'shawn@practicalhumandesign.co',
    To: params.email,
    TemplateAlias: 'welcome',
    TemplateModel: {
      product_url: 'https://practicalhumandesign.co',
      host_url: event.headers.url,
      product_name: 'Practical Human Design',
      name: params.firstName,
      action_url: actionUrl,
      support_email: 'help@practicalhumandesign.co',
      sender_name: 'Shawn',
      company_name: 'Quantum Connecting Technologies Inc',
      company_address: '1800 W 68th St. Suite 118, Hialeah, FL  33014',
    },
  })
  console.log('emailResponse', emailResponse)

  return {
    statusCode: 201,
    body: interview,
  }
})
