import { withPlanetscale } from '@netlify/planetscale'
import * as postmark from 'postmark'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('params', params)

  const result = await connection.execute(
    'INSERT INTO interviews (user_id, answers) VALUES (?, ?)',
    [params.userId, params.answers]
  )
  const interview = Object.assign({ id: parseInt(result.insertId) }, params)
  console.log('INSERT result', interview)

  // Send an email:
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY)

  const actionUrl = context.site.url + '/result?id=' + interview.id

  const emailResponse = await client.sendEmailWithTemplate({
    From: 'shawn@practicalhumandesign.co',
    To: params.email,
    TemplateAlias: 'welcome',
    TemplateModel: {
      product_url: 'https://practicalhumandesign.co',
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

  return Response.json(interview, {
    status: 201,
  })
})
