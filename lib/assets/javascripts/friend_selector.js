//= require lib/quicksilver
//= require_tree ./templates
//= require_self

(function(){

  var friend = Backbone.Model.extend({});
  var friend_collection = Backbone.Collection.extend({
    model: friend,
    fetch: function(){
      var self = this;
      FB.api('me/friends?fields=id,name', function(res){
        if(res.data){ self.reset(res.data);}
      });
    }
  });

  var view = Backbone.View.extend({
    el: ".friend_selector",

    template: JST['templates/friend_selector'],
    item_template: JST['templates/friend_selector_item'],

    events:{
      "keyup #fs_search": "handle_search",
      "focus #fs_search": "focus",
      "blur #fs_search": "blur",
      "mouseenter .friends li": "handle_mouseenter_item",
      "mouseleave .friends li": "handle_mouseleave_item",
      "click .friends li": "handle_click_item"
    },

    initialize: function(){
      if(!this.el) return;
      this.configure();
      this.friends = new friend_collection();
      this.friends.bind("reset", this.render, this);
      this.loading(true);
      this.friends.fetch();
    },

    configure: function(){
      this.limit = this.$el.data('limit') || 1;
      this.max_results = this.$el.data('max-results') || 5;
    },

    render: function(){
      this.loading(false);
      var context = {friends: this.friends.toJSON()};
      this.el.innerHTML = this.template(context);
      this.friend_list = this.$el.find('.friends');
      this.input = this.$el.find("#fs_search");

      // unbind blur on search field so it doesn't hide
      // the friend list when we click on a friend
      this.friend_list.on('mouseenter', _.bind(function(){
        this.$el.undelegate("#fs_search", "blur");
      },this));

      // rebind blur event when exiting the list and close
      // it behind us
      this.friend_list.on('mouseleave', _.bind(function(){
        this.$el.delegate("#fs_search", "blur", this.blur);
        this.blur();
      },this));
    },

    error: function(e){
      this.$el.find('#fs_error').html(e);
    },

    focus: function(){
      this.update_selector();
    },

    blur: function(){
      this.friend_list.hide();
      this.input.val('');
    },

    loading: function(loading){
      if(loading){
        this.$el.addClass('loading');
      }
      else{
        this.$el.removeClass('loading');
      }
    },

    handle_mouseenter_item: function(e){
      var item = $(e.currentTarget);
      item.addClass('focus').siblings().removeClass('focus');
    },

    handle_mouseleave_item: function(e){
      var item = $(e.currentTarget);
      item.parent().children().removeClass('focus');
      this.$el.delegate("blur", "#fs_search", this.blur);
    },

    handle_click_item: function(e){
      var item = $(e.currentTarget);
      this.handle_select_item(item);
    },

    handle_search: function(e){
      var friends = this.friend_list.children();
      switch(e.keyCode){
        case 40: this.navigate_down(friends); break;
        case 38: this.navigate_up(friends); break;
        case 13:
          this.handle_select_item(friends.filter(".focus").first());
          e.preventDefault();
          return false;
        case 27: this.blur(); break;
        default: this.update_selector();
      }
    },

    update_selector: function(){
      this.$el.find('#fs_error').empty();
      var friends = this.filter();
      this.friend_list.html(this.item_template({friends: friends.toJSON()}));
      return (friends.length > 0) ? this.friend_list.show() : this.friend_list.hide();
    },

    handle_select_item: function(item){
      if(!item) return;

      var fbid = item.attr("data-fbid");
      if(item.hasClass('selected')){
        this.deselect_friend(fbid);
        item.removeClass('selected');
      } else {
        if(this.limit == 1){
          // if we can only select one friend
          // switch the selection
          var self = this;
          item.siblings().filter('.selected').each(function(){
            $(this).removeClass('selected');
            self.deselect_friend($(this).attr('data-fbid'));
          });
        }
        else if(this.limit <= this.get_selection().length){
          // if we have reached the selection limit
          // show an error
          this.error(I18n.t("friend_selector.error.selection_limit"));
          return;
        }
        // lastly just select the target
        item.addClass('selected');
        this.select_friend(fbid);
      }
    },

    navigate_down: function(friends){
      var focus = friends.filter('.focus');
      if(focus.length > 0){
        focus.removeClass('focus');
        focus.next().addClass("focus");
      }
      else{
        friends.first().addClass('focus');
      }
    },

    navigate_up: function(friends){
      var focus = friends.filter('.focus');
      if(focus.length > 0){
        focus.removeClass('focus');
        focus.prev().addClass("focus");
      }
      else{
        friends.last().addClass('focus');
      }
    },

    select_friend: function(fbid){
      var model = this.friends.get(fbid);
      model.set({selected:true});
      this.trigger("select", model);
    },

    deselect_friend: function(fbid){
      var model = this.friends.get(fbid);
      model.set({selected:false});
      this.trigger("deselect", model);
    },

    get_selection: function(){
      return this.friends.filter(function(model){ return model.get('selected') === true; });
    },

    filter: function(){
      var matches = [], term = $.trim(this.input.val()).toLowerCase();
      if(term !== ""){
        matches = this.friends.select(function(model){
          var score = model.get('name').toLowerCase().score(term);
          model.set({score: score});
          return score > 0.0;
        });
        matches = _.sortBy(matches, function(model) { return model.get('score') * -1; });
        matches = matches.slice(0,this.max_results);
      }
      return new friend_collection(matches);
    }

  });

  this.FriendSelector = view;
  this.FriendSelector.collection = friend_collection;
}).call(this);
