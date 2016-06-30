var Gimmie = {
    $content: $('.content'),
    $form: $('form'),
    userInput: '',
    userInputIsValid: false,
    appId: '',

    validate: function(input) {
       var regUrl = /^(http|https):\/\/itunes/;
        var regId = /\/id(\d+)/i;
        if ( regUrl.test(this.userInput) && regId.test(this.userInput) ) {
            this.userInputIsValid = true;
            var id = regId.exec(this.userInput);
            this.appId = id[1];
        } else {
            this.userInputIsValid = false;
            this.appId = '';
        }
      },

toggleLoading: function(){
        this.$content.toggleClass('content--loading');
        this.$form.find('button').prop('disabled', function(i, v) { return !v; });
    },

       throwError: function(header, text){
        this.$content
            .html('<p><strong>' + header + '</strong> ' + text + '</p>')
            .addClass('content--error');

        this.toggleLoading();
    },
throwError: function(header, text){

        this.$content.removeClass('content--error-pop');

        this.$content[0].offsetWidth = this.$content[0].offsetWidth;

        this.$content
            .html('<p><strong>' + header + '</strong> ' + text + '</p>')
            .addClass('content--error content--error-pop');

        this.toggleLoading();
    },
    render: function(response){
        var icon = new Image();
        icon.src = response.artworkUrl512;
        icon.onload = function() {
            $('.content')
                .html(this)
                .append('<p><strong>' + response.trackName + '</strong></p>')
                .removeClass('content--error');
            Gimmie.toggleLoading();
        }
    }
  };



$(document).ready(function(){
   // debugger;
 $('form').on('submit', function(e){
        e.preventDefault();
         Gimmie.userInput = $(this).find('input').val();
         Gimmie.validate();
        if( Gimmie.userInputIsValid ) {
         $.ajax({
          url: "https://itunes.apple.com/lookup?id=" + Gimmie.appId,
          dataType: 'JSONP'
          })
         .done(function(response) {
          var response = response.results[0];
          console.log(response);
          // debugger;
          if (response && response.artworkUrl512 != null){
                  Gimmie.render(response);
              } else {
                  Gimmie.throwError(
                      'Invalid Response',
                      'The request you made appears to not have an associated icon. <br> Try a different URL.'
                  );
              }
          })
          .fail(function(data) {
             Gimmie.throwError(
            'iTunes API Error',
            'There was an error retrieving the info. Check the iTunes URL or try again later.'
        );
          });
              } else {
                  // throw an error
              }
              });
});

