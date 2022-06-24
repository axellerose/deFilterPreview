var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const { filter } = req.query;
    let resp = await axios.get("https://cloud.coms.opap.gr/custom-filter", {
      params: {
        filter,
      }
    });
    console.log(resp, resp.data);
    res.status(200).send(resp.data);

t
  } catch (e) {
    console.error("Filter eroror", e)
    res.status(500).send();
  }



});

module.exports = router;
