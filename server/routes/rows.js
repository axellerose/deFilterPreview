var express = require('express')
var router = express.Router()
const axios = require('axios')
require('dotenv').config()

/* GET rows count. */
router.get('/', async (req, res, next) => {
  try {
    const { filter } = req.query
    let resp = await axios.get("https://cloud.coms.opap.gr/custom-filter", {
      params: {
        filter,
      }
    })
    const rows = resp.data
    console.log(resp.data)
    res.status(200).json(rows)

    chrome.storage.local.set('filterData', {
      filterData: resp.data
    })
  } catch (e) {
    console.error("Filter eroror", e)
    res.status(500).send()
  }
})

router.post('/gettoken', async (req, res, next) => {
  try {
    // const body = {
    //   "grant_type": "client_credentials",
    //   "client_id": process.env.client_id,
    //   "client_secret": process.env.client_secret,
    //   "account_id": process.env.mid
    // }

    let resp = await axios.post(
      `https://${process.env.subdomain}.auth.marketingcloudapis.com/v2/token`, {

      body: {
        "grant_type": "client_credentials",
        "client_id": process.env.client_id,
        "client_secret": process.env.client_secret,
        "account_id": process.env.mid
      }

    })
    console.log(resp.data)
  } catch (error) {

  }
})

router.post('/token', async (req, res, next) => {
  let resp = await axios.post(`https://${process.env.subdomain}.auth.marketingcloudapis.com/v2/token`, {
    "grant_type": "client_credentials",
    "client_id": process.env.client_id,
    "client_secret": process.env.client_secret,
    "account_id": process.env.mid
  })

  console.log(resp)
  res.status(200).json(resp.data)
})

// send DE name to back

// post request token

// save token

// token + xml POST

// generate customer key + name

// ObjectID get

module.exports = router
