const APIUtil = require("./api_util.js");

function FollowToggle(el) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id");
  this.followState = this.$el.data("initial-follow-state");
  this.render();
  this.$el.click(this.handleClick.bind(this));
}

FollowToggle.prototype.render = function () {
  console.log(this.$el);
  if (this.followState === "followed") {
    this.$el.attr("disabled", false);
    this.$el.text("Unfollow!");
  } else if (this.followState === "unfollowed") {
    this.$el.attr("disabled", false);
    this.$el.text("Follow!");
  }
  if (this.followState === "following" || this.followState === "unfollowing") {
    this.$el.attr("disabled", true);
  }
};

FollowToggle.prototype.handleClick = function (e) {
  e.preventDefault();
  if (this.followState === "followed") {
    this.followState = "unfollowing";
    this.render();
    APIUtil.unfollowUser(this.userId).then(() => {
      this.followState = "unfollowed";
      this.render();
    });
  } else {
    this.followState = "following";
    this.render();
    APIUtil.followUser(this.userId).then(() => {
      this.followState = "followed";
      this.render();
    });
  }
};

module.exports = FollowToggle;
