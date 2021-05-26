const express = require('express')
const app = express()
const port = 3000
const {
  google
} = require('googleapis')
const request = require('request')
const cors = require('cors')
const urlParse = require('url-parse')
const queryParse = require('query-string')
const bodyParser = require('body-parser')
const axios = require('axios')
// const { response } = require('express')

app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
// clientID 329953458846-g91hdj53b2ojs8ck775r7h77c98tm5ql.apps.googleusercontent.com
// ClientSecret C-4DybcdMnORlveADEuoDaXn
app.get("/getUrlTing", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    //client id
    '329953458846-g91hdj53b2ojs8ck775r7h77c98tm5ql.apps.googleusercontent.com',
    //client secret
    'C-4DybcdMnORlveADEuoDaXn',
    // link to redirect
    "http://localhost:3000/test"
  )
  const scopes = ["https://www.googleapis.com/auth/itness.heart_rate.read"]

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
      callbackUrl: req.body.callbackUrl,
      userID: req.body.userid
    })
  })

  request(url, (err, response, body) => {
    console.log("error: ", err)
    console.log("statCode: ", response && response.statusCode)
    res.send({
      url
    })
  })
})

app.get('/test', async (req, res) => {
  const queryURL = new urlParse(req.url)
  const code = queryParse.parse(queryURL.query).code
  // console.log(code)
  const oauth2Client = new google.auth.OAuth2(
    //client id
    '329953458846-g91hdj53b2ojs8ck775r7h77c98tm5ql.apps.googleusercontent.com',
    //client secret
    'C-4DybcdMnORlveADEuoDaXn',
    // link to redirect
    "http://localhost:3000/test"
  )

  const tokens = await oauth2Client.getToken(code)
  console.log(tokens.tokens.access_token)
  // console.log(tokens)
  res.send('HELLO')
  // try {
  //   const result = await axios({
  //     method: 'POST',
  //     headers: {
  //       'Authorization': 'Bearer ' + tokens.tokens.access_token
  //     },
  //     "Content-Type": "application/json",
  //     // url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
  //     url: `https://www.googleapis.com/fitness/v1/users/me/dataSources`,
  //     // data: {
  //     //   aggregateBy : [
  //     //     {
  //     //       dataTypeName: "com.google.step_count.delta",
  //     //       dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
  //     //     }
  //     //   ],
  //     //   bucketByTime : {durationMillis: 86400000},
  //     //   startTimeMillis: 1621814399,
  //     //   endTimeMillis: 1621987199
  //     // }
  //   })
  //   console.log(result.data)
  //   // var stepArray = result.data.bucket

  // } catch (e) {
  //   console.log(e)
  // }
  // try {
  //   for (const dataSet of stepArray) {
  //     console.log(dataSet)
  //   }
  // } catch (e) {
  //   console.log(e)
  // }
})

app.listen(port, () => {
  console.log(`listenning on ${port}`)
})