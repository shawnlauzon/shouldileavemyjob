export default async (event, context) => {
  const axios = require('axios')
  const FormData = require('form-data')
  const body = await event.json()
  const payload = body.payload
  const dateTimeStr =
    payload.data['birth-date'] + 'T' + payload.data['birth-time']
  const birthDate = new Date(dateTimeStr)

  const qs = require('qs')
  const bg5Params = qs.stringify({
    Year: birthDate.getFullYear(),
    Month: birthDate.getMonth() + 1,
    Day: birthDate.getDate(),
    Hour: birthDate.getHours(),
    Minute: birthDate.getMinutes(),
    Country:
      payload.data['birth-country'] +
      (payload.data['birth-country'] === 'USA'
        ? ' - ' + payload.data['birth-state']
        : ''),
    City: payload.data['birth-city'],
  })
  console.log('Passing params to BG5', bg5Params)

  const bg5Config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://bg5businessinstitute.com/get-your-chart',
    headers: {
      'sec-ch-ua':
        '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      RequestVerificationToken:
        'CfDJ8PpmqfI5f59Gg-BT-dJ02hA8IXPG4aRRPndgcAQG6SaHZCxXKyXU-uSHeQY6tVH54XATIMTXgfZD6FnFKITAr7RSUITXIz3BI1M2cY4z0Sprf2q4LGMJqZu_sAJFzbyby4OqTsHiknDNNTtppBl57DL93VlFvBhXvYLowDjlmBFJkI5GgbpQYn4GoXvmurE71A',
      'sec-ch-ua-mobile': '?0',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua-platform': '"macOS"',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      host: 'bg5businessinstitute.com',
      Cookie:
        '.AspNet.Consent=yes; .AspNetCore.Antiforgery.7BxiT8-Rm8g=CfDJ8PpmqfI5f59Gg-BT-dJ02hB1zdgn61idtBeEFFIYFd0Qu-HwriQKtVLwIC5jm8ysBy-sd2jyo87715ax0h6DXrdHzPB5Pmg4tOoMfh50P_WPopOgPOcCfQ7F0Z9Ki4keMLMZCOd5kHyqSkW8m7NtyaI; .AspNetCore.Antiforgery.Q_cgsSubgpI=CfDJ8PpmqfI5f59Gg-BT-dJ02hDfFzCVnwt6zlOdFsouY695WuZbRROSrErOs5BPU6tAk-1j38wzlX4hHrqm1WRMspmnsOXp9et61q2a2BNLGr89MOZqkKIlHZEOUB4yOderoM5Nay4Xev7rwPKnIIInTz8; .AspNetCore.Identity.Application=CfDJ8PpmqfI5f59Gg-BT-dJ02hBAt08hGg0QxRzYmMq6tMcwWRkL66PbPrcOYuakxZDRdMvlzsjjuAIeFxQYdzwL2VmZv5mCCQM4D55AEl3qGb2xpqj529ayNsGYixuYF5HMXweHVmn-7BVWByMyGCQDn9y-_hY8K5TuJg7fh7YQtkVO9u0YQN-VqVoYvr6doOyoVhR8ICz-gEt7l2GHGpvEliHqLyzpxDHRn5X0RyALMwr_ISYij9zAYfgtjegkpa6cGbcHxSQqSvCzZR6JVK6fujyngrcGynjD6OfYur42qtnNmX3n3oNO5gkvjD92jvlUCwx0lrhqeykaqJPiUToUnZlcUnocyt3OtlBvF8Ydn5NHS7vgUeyFayX3NwM_sfNr5y8PWo_bvuRTHiKU8_BYipSm_LWTbWbaXTxOeU5h-t0CUuptxH_XmY_DYoQoZl5Rwjda6WCDrLVY0k_v1mskNuk59Jc-c0Pfa79LUe543ZTS3osWLWQ4QPNdE0HQ3L3GgbvsNh6b8rBD8YpD7RB0urk7olJgvplqijoxKTEWaUzQI1mZHJAOE5ZuScMwY4Ya7ECqE6R7Jnlbr6xIwZbiWtrAafiP60LKzPvNp9hxmgQ9LHFkLiDWb9p8iPpDdu4_LJHRCqhQlsVSa6xncq49urWpn-S02FJwMUkVPY82NKrxq1AE5KKU-tQ6PkUNZ7qYLNn83ITEznb5v6OEXSMCz1DGwUY2ogiEQ6gHK6xVsTy4-uf3HRrC-jDUeKEeC-mUoUfpeU0SSmHdqZC7j5atojerY9szEE3gyJKunUfIJstYmVhWu3svwM34u3Vms7j0lFT3taavAX_zWFVepiNPWucOggzu7GL0ChHnYGKWnRL8aSfYKPoQzVEeiDOhh64emhA_Eiw9h8GZ7R7BddXzzQkST0-0nAHmQrHv0EbSPE2Q7oNrSpeXaWb6dDQ_RAudsLL_0I_Gpm535eLHnzOHPv-83DDaCqqc-BQs1b1OvTZHmyQmdv92QH3wLY9z68Y_wg; _ga=GA1.2.1574294499.1686795887; _ga_BMRG0TVB5F=GS1.1.1697406134.158.1.1697406337.59.0.0; _gid=GA1.2.1630910633.1697300043',
    },
    bg5Params,
  }

  const finalResult = {}

  await axios
    .request(bg5Config)
    .then((bg5Response) => {
      Object.assign(finalResult, bg5Response.data)
      delete finalResult.image

      const imageData = bg5Response.data.image
      console.log('Length of image is', imageData.length)

      const ocrParams = new FormData()
      ocrParams.append('base64Image', 'data:image/png;base64,' + imageData)
      ocrParams.append('OCREngine', '2')
      const ocrConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.ocr.space/parse/image',
        headers: {
          apikey: 'K84139848188957',
          ...ocrParams.getHeaders(),
        },
        ocrParams,
      }

      axios
        .request(ocrConfig)
        .then((ocrResponse) => {
          const parsedText = ocrResponse.data.ParsedResults[0].ParsedText

          // Match each trait.quality
          const regex = /(\d+\.\d+)/gm

          finalResult.allTraits = parsedText.match(regex)
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch((error) => {
      console.log(error)
    })

  console.log('Returning', finalResult)

  // Netlify Functions need to return an object with a statusCode
  // Other properties such as headers or body can also be included.
  return new Response(finalResult)
}
