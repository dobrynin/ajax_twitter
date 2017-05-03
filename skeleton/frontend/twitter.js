const FollowToggle = require("./follow_toggle.js");

$(() => {
  $(".follow-toggle").each(function(index, el) {
    new FollowToggle(el);
  });
});
