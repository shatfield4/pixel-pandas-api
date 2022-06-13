const express = require('express')
const multer = require('multer')
const path = require('path')
const moment = require('moment')
const { HOST } = require('./src/constants')
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

app.get('/api/token/:token_id.json', function(req, res) {
  const tokenId = parseInt(req.params.token_id).toString()

  if (parseInt(tokenId) < 0 || parseInt(tokenId) > 8887) {
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
    if(parseInt(tokenId) >= 0 && parseInt(tokenId) < 888) {
        // Adds genesis trait is 0-887
        jsonAttributes[jsonAttributes.length] = {"trait_type": "Type", "value": "Genesis"};
    }
    const data = {
      "name": `Panda Paradise #${tokenId}`,
      "description": "Panda Paradise is a collection of 8,888 unique Panda NFTs - living on the Ethereum blockchain. Your Panda Paradise NFT is also your exclusive ticket into our diverse and growing community, and grants access to holder on benefits, which include future airdrop, utility token mechanisms, and our upcoming sandbox MMORPG. All this will be unlocked by our team of developers and community through our roadmap milestones. Join our Paradise here, https://pandaparadise.io/.",
      "image": `${HOST}/${tokenId}.png`,
      "attributes": jsonAttributes,
    }
    res.send(data)

  });


 
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})
