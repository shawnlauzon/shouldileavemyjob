// import type { Handler } from '@netlify/functions'
// import { withPlanetscale } from '@netlify/planetscale'

// export const handler: Handler = withPlanetscale(async (event, context) => {
//   const {
//     planetscale: { connection },
//   } = context

//   const { body } = event

//   if (!body) {
//     return {
//       statusCode: 400,
//       body: 'Missing body',
//     }
//   }

//   const {
//     type,
//     profile,
//     cross,
//     definition,
//     innerAuthority,
//     birthDateLocal,
//     birthPlace,
//     traits,
//   } = JSON.parse(body)

//   const result = await connection.execute(
//     `INSERT INTO charts (career_type, public_role, life_work, assimilation, decision_making_strategy,\
//        birth_date_local, birth_place, traits) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       type,
//       profile,
//       cross,
//       definition,
//       innerAuthority,
//       birthDateLocal,
//       birthPlace,
//       traits,
//     ]
//   )
//   console.log('INSERT result', result)

//   return {
//     statusCode: 201,
//   }
// })
