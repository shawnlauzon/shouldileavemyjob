import { withPlanetscale } from '@netlify/planetscale'

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export default withPlanetscale(async (request, context) => {
  const {
    planetscale: { connection },
  } = context

  const params = await request.json()
  console.log('Params', params)

  const {
    userId,
    careerType,
    publicRole,
    assimilation,
    decisionMakingStrategy,
    traits,
    image,
  } = params

  const result = await connection.execute(
    `INSERT INTO charts (user_id, career_type, public_role, assimilation, decision_making_strategy,\
       traits, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      careerType,
      publicRole.join('/'),
      assimilation,
      decisionMakingStrategy,
      JSON.stringify(traits),
      b64toBlob(image),
    ]
  )
  console.log('INSERT result', result)

  const chart = Object.assign({ id: result.insertId }, params)

  return Response.json(chart, {
    status: 201,
  })
})
