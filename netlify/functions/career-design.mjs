export default async (request) => {
  const requestParams = await request.json()
  console.log('requestParams', requestParams)

  const dateTimeStr = requestParams.date + 'T' + requestParams.time
  const birthDate = new Date(dateTimeStr)

  const bg5Body = new URLSearchParams()
  bg5Body.append('City', requestParams.city)
  bg5Body.append(
    'Country',
    requestParams.country +
      (requestParams.country === 'United States'
        ? ' - ' + requestParams.state
        : '')
  )

  bg5Body.append('Month', birthDate.getMonth() + 1)
  bg5Body.append('Day', birthDate.getDate())
  bg5Body.append('Year', birthDate.getFullYear())
  bg5Body.append('Hour', birthDate.getHours())
  bg5Body.append('Minute', birthDate.getMinutes())
  bg5Body.append(
    '__RequestVerificationToken',
    process.env.BG5_VERIFICATION_TOKEN
  )

  console.log('Passing to BG5:', bg5Body)

  const finalResult = {}

  const bg5Headers = new Headers()
  bg5Headers.append(
    'sec-ch-ua',
    '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"'
  )
  bg5Headers.append(
    'RequestVerificationToken',
    process.env.BG5_VERIFICATION_TOKEN
  )
  bg5Headers.append('sec-ch-ua-mobile', '?0')
  bg5Headers.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
  )
  bg5Headers.append(
    'Content-Type',
    'application/x-www-form-urlencoded; charset=UTF-8'
  )
  bg5Headers.append('Accept', 'application/json; q=0.01')
  bg5Headers.append('X-Requested-With', 'XMLHttpRequest')
  bg5Headers.append('sec-ch-ua-platform', '"macOS"')
  bg5Headers.append('Sec-Fetch-Site', 'same-origin')
  bg5Headers.append('Sec-Fetch-Mode', 'cors')
  bg5Headers.append('Sec-Fetch-Dest', 'empty')
  bg5Headers.append('host', 'bg5businessinstitute.com')
  bg5Headers.append('Cookie', process.env.BG5_COOKIE)

  const bg5Request = {
    method: 'POST',
    headers: bg5Headers,
    body: bg5Body,
    redirect: 'follow',
  }

  let bg5Response

  try {
    bg5Response = await fetch(
      'https://bg5businessinstitute.com/get-your-chart',
      bg5Request
    )
  } catch (e) {
    console.error('Failure fetching career design', e)
  }

  console.log('BG5 status: ', bg5Response.status)

  if (bg5Response.status !== 200) {
    console.log('BG5 statusText: ', bg5Response.statusText)
    const text = await bg5Response.text()
    console.log('BG5 text', text)
    return new Response(text, {
      status: bg5Response.status,
      statusText: bg5Response.statusText,
    })
  }

  const bg5Data = await bg5Response.json()
  // console.log('BG5 data', bg5Data)

  Object.assign(finalResult, bg5Data)
  delete finalResult.image

  const imageData = bg5Data.image
  console.log('Length of image is', imageData.length)

  const ocrHeaders = new Headers()
  ocrHeaders.append('apikey', process.env.OCR_SPACE_API_KEY)
  ocrHeaders.append('Accept', 'application/json; q=0.01')

  const ocrBody = new FormData()
  ocrBody.append('base64Image', 'data:image/png;base64,' + imageData)
  ocrBody.append('OCREngine', '2')

  const ocrRequest = {
    method: 'POST',
    headers: ocrHeaders,
    body: ocrBody,
    redirect: 'follow',
    signal: AbortSignal.timeout(5000),
  }

  // WARN I have seen this take up to 26 seconds to complete, which then causes
  // the function to timeout. Nothing to do about this; even the PRO Netlify
  // version has a max 28 second timeout. However the PRO space time is much
  // faster, so can upgrade to that when needed.
  try {
    const ocrResponse = await fetch(
      'https://api.ocr.space/parse/image',
      ocrRequest
    )
    const ocrData = await ocrResponse.json()
    console.log('ocrData', ocrData)
    const parsedText = ocrData.ParsedResults[0].ParsedText

    // Match each trait.quality
    const regex = /(\d+\.\d+)/gm

    finalResult.traits = parsedText.match(regex)
  } catch (e) {
    console.error('Failure performing OCR', e)
  }

  console.log('Returning', finalResult)

  // Netlify Functions need to return an object with a statusCode
  // Other properties such as headers or body can also be included.
  return Response.json(finalResult)
}
