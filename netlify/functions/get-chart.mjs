import { withPlanetscale } from '@netlify/planetscale'

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  let query
  let id
  const url = new URL(request.url)
  if (url.searchParams.has('id')) {
    query = `SELECT image from charts where id=?`
    id = url.searchParams.get('id')
  } else if (url.searchParams.has('user_id')) {
    query = `SELECT image from charts where user_id=?`
    id = url.searchParams.get('user_id')
  } else {
    throw Error('Require id or user_id query parameter')
  }

  const result = await connection.execute(query, [id])

  if (result.size === 0) {
    return Response.json(null, { status: 404 })
  }

  const row = result.rows[0]
  const body = row.image

  return Response.json(body, { status: 200 })
})
