import { withPlanetscale } from '@netlify/planetscale'
import * as postmark from 'postmark'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('params', params)

  const result = await connection.execute(
    'INSERT INTO interviews (user_id, answers, conclusion) VALUES (?, ?, ?)',
    [params.userId, params.answers, params.conclusion]
  )
  const interview = Object.assign({ id: parseInt(result.insertId) }, params)
  console.log('INSERT result', interview)

  // Send an email:
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY)

  const link = context.site.url + '/result?interview=' + interview.id
  const emailResponse = await client.sendEmail({
    From: 'shawn@quantumconnecting.com',
    To: params.email,
    Subject: 'Your result for Should I Leave My Job',
    HtmlBody: `<p><strong>Hi ${params.firstName}!</strong></p><p>Your result is ready. <a href=${link}>Click here</a>\
    to find out the answer to "should I leave my job?"</p>`,
    MessageStream: 'outbound',
  })
  console.log('emailResponse', emailResponse)

  return Response.json(interview, {
    status: 201,
  })
})
