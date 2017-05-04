/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(1);
const UsersSearch = __webpack_require__(3);
const TweetCompose = __webpack_require__(4);

$(() => {
  $(".follow-toggle").each(function(index, el) {
    new FollowToggle(el);
  });
  $(".users-search").each(function(index, el) {
    new UsersSearch(el);
  });
  $(".tweet-compose").each(function(index, el) {
    new TweetCompose(el);
  });
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(2);

function FollowToggle(el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") ||
                      options.followState;
  this.render();
  this.$el.click(this.handleClick.bind(this));
}

FollowToggle.prototype.render = function () {
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const APIUtil = {
  followUser: id => {
    return $.ajax({
      method: "POST",
      url: `/users/${id}/follow`,
      dataType: "json",
    });
  },

  unfollowUser: id => {
    return $.ajax({
      method: "DELETE",
      url: `/users/${id}/follow`,
      dataType: "json",
    });
  },

  searchUsers: (queryVal) => {
    return $.ajax({
      method: "GET",
      url: "/users/search",
      dataType: "json",
      data: {
        query: queryVal
      },
    });
  },

  createTweet: (data) => {
    return $.ajax({
      method: "POST",
      url: "/tweets",
      dataType: "json",
      data: data
    });
  }
};

module.exports = APIUtil;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(2);
const FollowToggle = __webpack_require__(1);
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(2);

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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map