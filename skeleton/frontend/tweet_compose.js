const APIUtil = require("./api_util.js");

function TweetCompose(el) {
  this.$el = $(el);
  this.$el.submit(this.submit.bind(this.$el));
}

TweetCompose.prototype.submit = function (e) {
  e.preventDefault();
  APIUtil.createTweet(this.serializeJSON());
  $(":input").attr("disabled", true);
};

TweetCompose.prototype.clearInput = () => {

};

TweetCompose.prototype.handleSuccess = function () {

};

module.exports = TweetCompose;
