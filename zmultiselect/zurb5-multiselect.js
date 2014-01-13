/**
 * ZURB FOUNDATION 5 MULTISELECT PLUGIN 
 * 
 * @author andreamariani.net
 * @mail me@andreamariani.net
 * @twitter @andreamariani2k
 */

(function($) {
    
        //conflitto da risolvere:
        //le prime due funzioni si danno noia

        //todo: click out for close the dropdown
        $(document).mouseup(function (e){
        var container = $(".zselect ul");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.hide();
                //console.log(e.target);
            }
            else{
                //console.log(e.target);
                //console.log('else');
            }
            
        });
        
        
        //open dropdown onclick
        $(document).on('click', '.zselect', function(e){
           var click = $(e.target).prop("tagName");
           //console.log(click);
           if(click!=='LI' && click!=='INPUT'){
                    $("li.filter input").val('').keyup(); //clean filter
                    $("ul",this).toggle();
           }
            
        });
        
        
        //escape key for close all zselect
        $(window).on('keydown', function(e){
            e = e || window.event;
            if (e.keyCode === 27) {
                $("li.filter input").val('').keyup(); //clean filter
                $(".zselect ul").hide();
            }
        });
        
        
        //click on label toggle input
        $(document).on('click', 'li', function(e){
            if($(e.target).prop("tagName") !== "INPUT")
                $("input:checkbox",this).prop('checked', function( i, val ) { return !val; });
        });
        
        
        //when resize window + init
        function onResize(){
            $.each( $(".zselect"), function(k,v){
                var w = $(v).outerWidth();
                $(v).find("ul").attr('style', 'width:'+w+'px!important;' );
                
            });
        }
        $( window ).resize(function() {
            onResize();
        });
        
        





var methods = {
    init : function(options) {
        //console.log( $(this) );
        var id,checked,disabled="",disabledClass="";
        $.each( $(this),function(k,v){
        
            id=Math.random().toString(36).substr(2, 9);
            $(v).hide().attr('rel',id);  
            $(v).parent().append("<div id='"+id+"' class='zselect'><span class='head'></span><ul></ul></div>");
            
            $.each(v, function(j,z){
                //console.log( $(z).attr('value') + " " + $(z).text() );
                //console.log(id);
                //console.log( '#'+id+' ul' );
               
                checked = ( $(z).is('[data-selected]') ) ? "checked='checked'" : "";
                
                if( $(z).is('[data-disabled]') ){
                    disabled = "disabled='disabled'";
                    disabledClass = "class='disabled'";
                }
                $('#'+id+' ul').append("<li "+disabledClass+"><input value='"+$(z).val()+"' type='checkbox' "+checked+" "+disabled+" />&nbsp;"+$(z).text()+"</li>");
                $('#'+id+' span').html( (options.placeholder===undefined) ? '&nbsp;' : options.placeholder );
            });
            
        });
        
        if(options.filter === true){
            //defaults
            if (options.filterResult === undefined) options.filterResult = true;
            if (options.filterResultText === undefined) options.filterResultText = 'showed';
            var fplaholder = (options.filterPlaceholder !== undefined) ? options.filterPlaceholder : "Filter...";
            
            
            var rel = this.attr('rel');
            $("div#"+rel+" ul").prepend('<li class="filter"><input type="text" placeholder="'+fplaholder+'" /></li>');

            

            if(options.filterResult === true)
                $("div#"+rel+" ul").append('<li class="filterResult"></li>');
            
            $("div#"+rel+" ul li.filter input").keyup(function(){
                    var value=$(this).val();
                    var show=0,tot=$("div#"+rel+" ul li input:checkbox").length;
                    $("div#"+rel+" ul li input:checkbox").filter( function(i,v) {
                          //console.log($(v).val());
                          if( $(v).val().indexOf(value) === -1 ){//and text() check...
                               $(v).parent().hide();
 
                          }
                          else {
                               $(v).parent().show();
                               show++;
                          }
                          
                    });
                     
                    if(options.filterResult === true) 
                        $("div#"+rel+" ul li.filterResult").text(options.filterResultText + ' '+show+'/'+tot);
                    
                });
        }//end filter
        
        
        if(options.live !== undefined){
            var rel = this.attr('rel');
            $(".zselect#"+rel).on('change','input:checkbox',function(e){
                $(options.live).val( methods.getValue($("select[rel='"+rel+"']")) );
            });
        }//end live
        
        
        
        
       
        onResize();
        

    },
    
    getValue : function(selector) { 
       if(selector===undefined) selector = this; 
       var value = new Array();
       var rel   = $(selector).attr('rel');
       $.each( $("div#"+rel+" ul li input"), function(k,v){
          if( $(v).val() !== undefined ){
               if( $(v).prop('checked') )
               value.push($(v).val());
          }
       });
       return value;
    },
    
        
    open : function( ) {
        $("div#"+$(this).attr('rel')+" ul").show();
    },
    close : function( ) {
        $("div#"+$(this).attr('rel')+" ul").hide();
    },
    
            
    
    set : function (val,checked){
        $("div#"+$(this).attr('rel')+" ul li input:checkbox[value='"+val+"']").prop('checked', checked).change();
    },
    checkall : function( ) {
        $("div#"+$(this).attr('rel')+" ul li input:checkbox").prop('checked', true).change();
    },
    uncheckall : function( ) {
        $("div#"+$(this).attr('rel')+" ul li input:checkbox").prop('checked', false).change();
    },
    destroy : function (val){
        $("div#"+$(this).attr('rel')+" ul li input:checkbox[value='"+val+"']").parent().remove();
    }
            
            
    //,update : function( content ) {  }
    };









$.fn.zmultiselect = function(methodOrOptions) {
    if ( methods[methodOrOptions] ) {
        return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
        // Default to "init"
        return methods.init.apply( this, arguments );
    } else {
        $.error( 'Method ' +  methodOrOptions + ' does not exist on zmultiselect' );
    }    
    };



})( jQuery );