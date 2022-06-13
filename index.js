const express = require('express')
const multer = require('multer')
const path = require('path')
const moment = require('moment')
const { HOST, REVEALED } = require('./src/constants')
const db = require('./src/database')
const fs = require('fs')

const PORT = process.env.PORT || 80

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.send('alive');
})
app.use('/images', express.static('./storage/images'));

app.get('/api/token/:token_id', function(req, res) {
  const tokenId = parseInt(req.params.token_id).toString()

  if (parseInt(tokenId) < 1 || parseInt(tokenId) > 410) {
    errorData = {
      'Error' : 'Token ID does not exist'
    }
    res.send(errorData)
    return;
  }


  fs.readFile('./storage/metadata/' + tokenId + '.json', (err, fileObj) => {
    if (err) throw err;
    let file = JSON.parse(fileObj);
    let jsonAttributes = file['attributes'];
    let tierName;
    
    if(parseInt(tokenId) >= 1 && parseInt(tokenId) <= 10) {
        // Add baller tier to first 10
        if(REVEALED) {
          jsonAttributes[jsonAttributes.length] = {"trait_type": "Tier", "value": "Baller"};
        } else {
          jsonAttributes = [];
          jsonAttributes[0] = {"trait_type": "Tier", "value": "Baller"};
        }
        tierName = "Baller";
    } else {
      // Add diamond tier to the rest
      if(REVEALED) {
        jsonAttributes[jsonAttributes.length] = {"trait_type": "Tier", "value": "Diamond"};
      } else {
        jsonAttributes = [];
        jsonAttributes[0] = {"trait_type": "Tier", "value": "Diamond"};
      }
      
      tierName = "Diamond";
    }

    // "image": `${HOST}/${tokenId}.png`, ---> save for reveal
    const data = {
      "name": `${tierName} Hobotizen #${tokenId}`,
      "description": "TMC NFT is blending real world utilities with Web3 by empowering our community with exclusive tools and resources to become self-made millionaires. Owning one gives you access to real estate alpha, private deals, and the power to network with like-minded individuals and successful millionaires who share their skills and experiences.",
      "image": `${HOST}/unrevealed-placeholder.gif`,
      "attributes": jsonAttributes,
    }
    res.send(data)

  });


 
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})
