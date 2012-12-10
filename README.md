# FriendSelector

Provides a basic facebook friend selector.

## Installation

Add this line to your application's Gemfile:

    gem 'friend_selector'

And then execute:

    $ bundle


## Usage

  require friend selector in you application.js

  `//= require friend_selector`

  and require the stylesheet in your application.css.scss

  `@import 'friend_selector';`

  The friend selector will give you a search box that you can use to select friends
  just add this html to your view:

    `<div class="friend_selector"></div>`

  By default it limits you to 1 friend and shows 5 results
  You can change some options by adding data attributes e.g.

    `<div class="friend_selector" data-limit="2" data-max-results="10"></div>`

  To hook it up, do something like this

```
    var friend_selector = new FriendSelector();
    friend_selector.on("select", function(friend_model){ console.log(model);}, this);
    friend_selector.on("deselect", function(friend_model){ console.log(model);}, this);
```

  The plugin just provides events for the selection of items,
  it doesn't decide how you display them because that can be quite different from app to app

  You can get a full list of selected friends by calling:
    `friend_selector.get_selection();`

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
