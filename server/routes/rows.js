var express = require('express')
var router = express.Router()
const axios = require('axios')

/* GET users listing. */
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

module.exports = router
