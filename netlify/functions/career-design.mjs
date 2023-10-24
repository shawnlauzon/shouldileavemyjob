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
    'CfDJ8EEVtCbDjqBGkUQlp1CtPRp3JMeGfwhjoEjD_8FRQP0cSizEAqgYt6FqOnLVzGpkD9N4g3d_RNO56xlUitLSvuVP3RHdovyj1Qno7NpAbTRv1JXwFYc6rKcLJy378sqtoeHbwpoZUR-kbB4zAnSsSHaapAHixBjJFyCLvKk-PYIsDGZj9ePMrdcFJf4E-c-yOQ'
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
    'CfDJ8EEVtCbDjqBGkUQlp1CtPRp3JMeGfwhjoEjD_8FRQP0cSizEAqgYt6FqOnLVzGpkD9N4g3d_RNO56xlUitLSvuVP3RHdovyj1Qno7NpAbTRv1JXwFYc6rKcLJy378sqtoeHbwpoZUR-kbB4zAnSsSHaapAHixBjJFyCLvKk-PYIsDGZj9ePMrdcFJf4E-c-yOQ'
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
  bg5Headers.append(
    'Cookie',
    '.AspNet.Consent=yes; .AspNetCore.Antiforgery.7BxiT8-Rm8g=CfDJ8PpmqfI5f59Gg-BT-dJ02hB1zdgn61idtBeEFFIYFd0Qu-HwriQKtVLwIC5jm8ysBy-sd2jyo87715ax0h6DXrdHzPB5Pmg4tOoMfh50P_WPopOgPOcCfQ7F0Z9Ki4keMLMZCOd5kHyqSkW8m7NtyaI; .AspNetCore.Antiforgery.Q_cgsSubgpI=CfDJ8EEVtCbDjqBGkUQlp1CtPRpxN9vaN4r10y8uOH6eg2UbcjZ-wB7ZNDg9-SNdgDN3Az_cXsa1c2K5iwHVpYAkW8zqxL4_3aJsCu1-36tUZok8BeCpQGRBGtDYnixKbQOZar-G7J2iDmyRo4QSZIeMdoo; .AspNetCore.Identity.Application=CfDJ8EEVtCbDjqBGkUQlp1CtPRpp2mbTKiNV3OHEv18to6Qc0ITXCPTL8vLUe2Iih28pNM9vb27bm_zb1SVxt0uDdhv4hkRP1yg-cGD7SXjm3Y81L7QbNdBYlUGzqvh_x3k1ta_RBAoIhcpb5mSJDmwn90r84O3E57XtYqzznFx5tc-0kxDppvxKDYuLx3kMuU1_Ap_davZq1Y5lAkPu93fFejhLbTn6xqlcaPDyYS2svNZz-2CTFs867xaEBGi5GxeeL2J87BYVzXXev2R6mK0kOn6KWcrVgmGeGLnZ3Qd4bRouZMg_IvqGg8ePQpOmItbyNtuOi-j0v9ZL2J-B2LIc6hzFs3X0DqMR0CPKPfDMd0hQfHYMOJ2fqxHl2bl8l4trEJ2T58wBhcPTc2hzQPb3KAezKpRHCSliYB00BKmA12FpdRpoxpL-mz1mjCsgfQGI6zJ3U5B8bql-KOvO-M_TNAlogex1TEG0QnGpDuRuhTIoeOLaAkcX4Ds3xV_-GK2aaodJIfKp3P_oLUdm4YDxV49lcNFs4dZWl8CrUQiWYHNrXsiEFg9v1HKWkOhbgapM-Undn8eKLFF48pGHhw_6lsjz2q_6FSakbMuchryiIsMZ_xdtsafPPnbgvC0mBJ_G579lrUcVu1S-Apqo2mEjr4hkhWlSHTfwgMaQGGBsDCbvvFE8Uu7kiHI2YjTtjqRZ4ryszXBmHmx-QiceLbs4otIGx1HPLN1KxRTaxIxm25IUFmpDFSkv3xNSlmZlqU9RWF5EB75YfL1UI2DGSuZGNBq4sAx6OhkHFOUMr71fteRxqV8_C57lI1DNVwxmonIOwsEXAqWd_ABPPGJ_w1p6fsIR3U7VQemQrm2yluSeP-KRxHMp5oMLi_ZWKKCebUnoVgBQU4jxo4cn79jA8vsZqHXn3PrSf9Ok0TyCQWL4VSqyYzElWTRNQWzqYXb_mRFXr-HwIJEYCMdOwmuGm8Z7TtY0V0oWNOz6jBwqQYaQWuCIkcRe8cyw_gAffDBocIvr0Q; _ga=GA1.1.1574294499.1686795887; _ga_BMRG0TVB5F=GS1.1.1697825822.172.0.1697825822.60.0.0; _gat_gtag_UA_159236502_1=1; _gid=GA1.2.702925575.1697584465'
  )

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

  const bg5Data = await bg5Response.json()
  console.log('BG5 data', bg5Data)

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
    signal: AbortSignal.timeout(8000),
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
