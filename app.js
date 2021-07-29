var path = require("path");
const fs = require("fs");
const key = fs.readFileSync("./localhost+1-key.pem");
const cert = fs.readFileSync("./localhost+1.pem");
var express = require("express");
var app = express();
const https = require("https");
const server = https.createServer({ key: key, cert: cert }, app);
app.use(express.static(path.join(__dirname, "./public")));
const port = 5000;
app.use(express.static(path.join(__dirname, "./public")));
const got = require("got")
const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '10',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': '132910a6-1569-4fda-854d-1edae8af4f2b'
  },
  json: true,
  gzip: true
};

// rp(requestOptions).then(response => {
//   console.log('API call response:', response);
// }).catch((err) => {
//   console.log('API call error:', err.message);
// });


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/amp-main.html"));
  console.log("showing mail");
  //res.end();
});



app.get("/data", (req, res) => {

  rp(requestOptions).then(response => {
    //console.log('API call response:', response.data);
    let jsondata=[];
      response.data.map((currency_item,index)=>{
        //console.log(currency_item)
        jsondata.push({currency_item})
      })
  res.json({
    items:jsondata
  });
  }).catch((err) => {
    console.log('API call error:', err.message);
  });


  // res.json({
  //   items: [
  //     {
  //       title: "0",
  //     },
  //     {

  //       title: "1",
  //     },
  //     {

  //       title: "2",
  //     },
  //     {

  //       title: "3",
  //     },
  //     {

  //       title: "4",
  //     },

  //   ],
  // });
});

app.get("/test", (req, res) => {

  res.json({
    items: [
      {
        val: "0",
        name:"Facebook"
      },
      {

        val: "1",
        name:"Twitter"

      },
      {

        val: "2",
        name:"Instagram"

      },

    ],
  });
});


app.get("/total-votes", (req, res) => {

  res.json({
    items: [
      {
        count: "count value",
      },

    ],
  });
});

app.get("/close", function (req, res) {

});


///for form testing (by devyuesh)
// router.post('/s/:campaignId/:emailIdentifier', async (req, res) => {
//   const { emailIdentifier, campaignId } = req.params;
//   const { formId } = req.query;
//   const campaignEmailsDao = new CampaignEmailsDao(campaignId);
//   return res.send({
//     result: [
//       {
//         itemValue: '70%',
//       },
//       {
//         itemValue: '20%',
//       },
//       {
//         itemValue: '10%',
//       },
//     ],
//   });
// });
//

app.post('/formsubmit', async (req, res) => {
  // const { emailIdentifier, campaignId } = req.params;
  // const { formId } = req.query;
  // const campaignEmailsDao = new CampaignEmailsDao(campaignId);
  return res.send({
    totalCount:"80",
    
    result: [
      {
        itemValue: '70%',
      },
      {
        itemValue: '20%',
      },
      {
        itemValue: '10%',
      },
    ],
  });
});


///////////////
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
