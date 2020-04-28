var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var appendQuery = require("append-query");

var contentModeratorUrl;

app.use(bodyParser.json());

/**
 * This route hits the text content moderator API with the input parameters and also validates
 * paramters. It returns a JSON response.
 */
app.post("/api/v1/contentmoderator", urlencodedParser, function (req, res) {
  if (
    req.query &&
    (req.query.autocorrect ||
      req.query.PII ||
      req.query.listId ||
      req.query.classify ||
      req.query.language)
  ) {
    contentModeratorUrl = appendQuery(
      "https://eastus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen",
      req.query
    );
  } else {
    contentModeratorUrl =
      "https://eastus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen";
  }
  if (
    req.body == undefined ||
    req.body.data == undefined ||
    Object.keys(req.body.data).length == 0
  ) {
    res.send("Kindly specify the request body.");
    return;
  }
  contentModerate(req.body.data, res);
});

/**
 * This function hits the text content moderator api and returns the response.
 *
 * API - Scans text for offensive content, sexually explicit or suggestive content, profanity, and personal data.
 *
 * @param {string} data
 * @param {Response object} res
 *
 */
function contentModerate(data, res) {
  var request = require("request");
  var options = {
    method: "POST",
    url: contentModeratorUrl,
    headers: {
      "Content-Type": "text/plain",
      "Ocp-Apim-Subscription-Key": "8f93f71c6d0a42bea178f6c27bc8f990",
    },
    body: '{\n "data": ' + data + " \n}",
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.json(JSON.parse(response.body));
  });
}
app.listen(8080);
