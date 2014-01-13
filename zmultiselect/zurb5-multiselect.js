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
                    $("li.zmsfilter input").val('').keyup(); //clean filter
                    $("ul",this).toggle();
           }
            
        });
        
        
        //escape key for close all zselect
        $(window).on('keydown', function(e){
            e = e || window.event;
            if (e.keyCode === 27) {
                $("li.zmsfilter input").val('').keyup(); //clean filter
                $(".zselect ul").hide();
            }
        });
        
        
        //click on label toggle input
        $(document).on('click', 'li', function(e){
            if($(e.target).prop("tagName") !== "INPUT")
                $("input:checkbox",this).click();
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
        
        
        function refreshPlaceholder(rel, placeholder){   
            var checked=$("div#"+rel+" ul li input:checked").length;
            var tot=$("div#"+rel+" ul li input:checkbox").length;

            if(checked>0) {
                $(".zselect#"+rel+" span.head").text("Selezionati "+checked+" di "+tot);
            }
            else {
                $(".zselect#"+rel+" span.head").html( (placeholder===undefined) ? '&nbsp;' : placeholder );
            }
        }




var methods = {
    init : function(options) {
        //console.log( $(this) );
        var id,checked;
        $.each( $(this),function(k,v){
        
            id=Math.random().toString(36).substr(2, 9);
            $(v).hide().attr('rel',id);  
            $(v).parent().append("<div id='"+id+"' class='zselect'><span class='head'></span><ul></ul></div>");
            
            $('#'+id+' ul').append("<li onclick=\"jQuery(this).parent().find('input:checkbox').prop('checked', true).change();\">Seleziona tutto</li>");
            $('#'+id+' ul').append("<li onclick=\"jQuery(this).parent().find('input:checkbox').prop('checked', false).change();\">Deseleziona tutto</li>");
            
            $.each(v, function(j,z){
                //console.log( $(z).attr('value') + " " + $(z).text() );
                //console.log(id);
                //console.log( '#'+id+' ul' );
               
                checked = ( $(z).is('[data-selected]') ) ? "checked='checked'" : "";
                $('#'+id+' ul').append("<li><input value='"+$(z).val()+"' type='checkbox' "+checked+" />&nbsp;"+$(z).text()+"</li>");
                $('#'+id+' span').html( (options.placeholder===undefined) ? '&nbsp;' : options.placeholder );
            });
            
        });
        
        if(options.filter === true){
            //defaults
            if (options.filterResult === undefined) options.filterResult = true;
            if (options.filterResultText === undefined) options.filterResultText = 'showed';
            var fplaholder = (options.filterPlaceholder !== undefined) ? options.filterPlaceholder : "Filter...";
            
            
            var rel = this.attr('rel');
            $("div#"+rel+" ul").prepend('<li class="zmsfilter"><input type="text" placeholder="'+fplaholder+'" /></li>');

            

            if(options.filterResult === true)
                $("div#"+rel+" ul").append('<li class="filterResult"></li>');
            
            $("div#"+rel+" ul li.zmsfilter input").keyup(function(){
                    var value=$(this).val().toLowerCase();
                    var show=0,tot=$("div#"+rel+" ul li input:checkbox").length;
                    $("div#"+rel+" ul li input:checkbox").filter( function(i,v) {
                          //console.log($(v).val());
                          //console.log($(v).parent().text());
                          if( $(v).val().toLowerCase().indexOf(value) === -1 && $(v).parent().text().toLowerCase().indexOf(value) === -1 ){//and text() check...
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
        
        
        if(options.get !== undefined){ 
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            var need = false;
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if (pair[0] == options.get) {
                  need = pair[1].split('%2C');
                }
            } 
            
            if(need){
                var rel = this.attr('rel');
                for(var i=0; i<need.length; i++){
                    //console.log(need[i]);
                    $(".zselect#"+rel+" ul li input:checkbox[value='"+need[i]+"']").trigger('click');
                   
                }
                refreshPlaceholder(rel,options.placeholder);
            }
        }
        
        //placeholder dopo click
        $(".zselect#"+rel).on('change','input:checkbox',function(){
            refreshPlaceholder(rel,options.placeholder);
        });
       
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
    uncheckall_inpage : function( ) {
        $(".zselect ul li input:checkbox").prop('checked', false).change();
    },
    checkall_inpage : function( ) {
        $(".zselect ul li input:checkbox").prop('checked', true).change();
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