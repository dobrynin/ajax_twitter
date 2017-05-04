const APIUtil = require("./api_util.js");
const FollowToggle = require("./follow_toggle.js");
function UsersSearch(el) {
  this.$el = $(el);
  this.input = this.$el.find("input");
  this.ul = this.$el.find(".users");
  this.input.on("input", this.handleInput.bind(this));
}

UsersSearch.prototype.handleInput = function () {
  const val = this.input.val();
  APIUtil.searchUsers(val).then(this.renderResults.bind(this));
};

UsersSearch.prototype.renderResults = function (users) {
  const $ul = this.ul;
  $ul.empty();
  users.forEach((user) => {

    const button = '<button></button>';
    let followState;
    if (user.followed) {
      followState = "followed";
    } else {
      followState = "unfollowed";
    }
    const options = {
      userId: user.id,
      followState: followState
    };
    const ft = new FollowToggle(button, options);
    const $li = $(`<li></li>`);
    const $a = $(`<a href="/users/${user.id}">${user.username}</a>`);
    $li.append($a);
    $li.append(ft.$el);
    $ul.append($li);
  });
};
module.exports = UsersSearch;
