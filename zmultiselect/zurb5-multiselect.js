/**
 * ZURB FOUNDATION 5 MULTISELECT PLUGIN 
 * 
 * @author Andrea Mariani
 * @mail me@andreamariani.net
 * @twitter @andreamariani2k
 * @web http://www.andreamariani.net
 * 
 * ** THIS PLUGIN IS IN DEVELOPMENT ** *
 */

(function($) {
    
       
    //toggle for click on zselect, close for click elsewhere, nothing for click on .zselect *
    $(document).on('click', function(e){    
        var id=false;
        if(e.target.tagName == 'SPAN'){ id = $(e.target).parent().attr('id'); }
        if(e.target.tagName == 'DIV'){  id = $(e.target).attr('id'); }

        var container = $(".zselect ul");

        if ( container.parent().is(e.target) || container.prev().is(e.target) || ( container.is(':visible') && !container.parent().is(e.target) ) && ( container.has(e.target).length === 0 )  ) {
            if(!id) container.hide(); //when user click out 
            else    $(".zselect#"+id+" ul").toggle();
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
    $(document).on('click', '.zselect li, .zselect li input:checkbox', function(e){ 
        var zbefore_change_event = $.Event('zbefore_change', {'target': e.target});
        $(this).trigger(zbefore_change_event);
        if(zbefore_change_event.result === false) {
            e.preventDefault();
            if($(this).prop("tagName") == 'LI'){
                $(this).children().attr("checked", false);
                $(this).children().trigger('change')
            }                    
            else{
                $(this).attr("checked", false); // hack to keep placeholder text correct
                $(this).trigger('change');
            }
            return;
        }
        $(this).trigger('change');
        if($(e.target).prop("tagName") !== "INPUT"){
                $("input:checkbox[disabled!='disabled']",this).prop('checked', function( i, val ) { return !val; }).trigger('change');
        }            
    });
    

    //select all and deselect all
    $(document).on('click','.selectall,.deselectall', function(){
       var state = ($(this).hasClass('selectall'))?true:false;
       $(this).parent().find("input:checkbox[disabled!='disabled']:visible").prop('checked', state).change();
    });

    //optgroup
    $(document).on('click','.optgroup', function(){ 
        var zbefore_optgroup_event = $.Event('zbefore_optgroup_event');
        $(this).trigger(zbefore_optgroup_event);
        if(zbefore_optgroup_event.result === false) {
            return;
        }
        
        var checked = false;
        $.each( $(this).parent().find(".optgroup_"+$(this).attr('data-optgroup')+" li input:checkbox[disabled!='disabled']"), function(){
            if($(this).prop('checked') == false){
                checked = true;
                return false;    
            }
        });
        
        $(this).parent().find(".optgroup_"+$(this).attr('data-optgroup')+" li input:checkbox[disabled!='disabled']").prop('checked', checked).change();
        //old version mode: .prop('checked', function( i, val ) { return !val; }).change();
    });


    //when resize window + init
    function onResize(reflow){ 
        $.each( $(".zselect"), function(k,v){
            //if( $(v).find("ul").attr('style') !== undefined && reflow !== true ) return false; //break if already set

            var w = $(v).outerWidth(); 

            $(v).find("ul").attr('style', 'width:'+w+'px!important;' );


            //var size = Math.max(Math.min(w / (1), parseFloat(20)), parseFloat(11));
            //console.log(size);
            //$(v).find('ul li').css('font-size', size);

            //var w_li = $(v).find('ul li:eq(0)').width();
            //console.log(w_li);

        });

    }

    $( window ).resize(function() {
        onResize();
    });

    
    function refreshPlaceholder(rel, placeholder, selectedText){ 
        var counter = selectedText || ['Selezionati ', 'di '];
        var checked=$("div#"+rel+" ul li input:checked").length;
        var tot=$("div#"+rel+" ul li input:checkbox").length;

        if(checked>0) {
            $(".zselect#"+rel+" span.zmshead").text(counter[0]+" "+checked+" "+counter[1]+" "+tot);
        }
        else {
            $(".zselect#"+rel+" span.zmshead").html( (placeholder===undefined) ? '&nbsp;' : placeholder );
        }
    }




var methods = {
    init : function(options) {
        
        var id,checked,dataZ,disabled="",disabledClass="";
        var optgroup=[];
        var optgroup_size,optgroup_id = 0;
        var optgroup_name = false;
        var optgroup_members = 0;
        
        $.each( $(this),function(k,v){
        
            id=Math.random().toString(36).substr(2, 9);
            $(v).hide().attr('rel',id);  
            $(v).parent().append("<div id='"+id+"' class='zselect'><span class='zmshead'></span><ul></ul></div>");
            
            if(options.selectAll!==false){
                var sAllText="Select All";
                var desAllText="Deselect All";
                if(options.selectAllText!==undefined){
                    sAllText=options.selectAllText[0];
                    desAllText=options.selectAllText[1];
                }
                
                $('#'+id+' ul').append("<li class='selectall'>"+sAllText+"</li>");
                $('#'+id+' ul').append("<li class='deselectall'>"+desAllText+"</li>");
            }
            
            $.each(v, function(j,z){
                
                var appendTo;
                if( $(z).parent().attr("label") !== undefined && optgroup.indexOf($(z).parent().attr("label"))===-1 ){
                    optgroup_size = $(z).parent().find('option').size();
                    optgroup_members += optgroup_size;
                    optgroup_name = $(z).parent().attr("label");  
                    
                    $('#'+id+' ul').append("<li class='optgroup' data-optgroup='"+optgroup_id+"'>"+$(z).parent().attr("label")+"</li>");
                    $('#'+id+' ul').append($("<div>").addClass('optgroup_'+optgroup_id));
                    optgroup.push($(z).parent().attr("label"));
                }
                //console.log( $(z).attr('value') + " " + $(z).text() + " " + $(z).is('[data-selected]') + " " + $(z).is(':selected'));
                //console.log(id);
                //console.log( '#'+id+' ul' );
                checked = ( $(z).is('[data-selected]') ) ? "checked='checked'" : "";
                
                dataZ = ( $(z).data("z") !== undefined ) ? 'data-z="' + $(z).data("z") + '"' : "";
                
                if( $(z).is('[data-disabled]') ){
                    disabled = "disabled='disabled'";
                    disabledClass = "class='disabled'";
                }
                else{
                    disabled = disabledClass = "";
                }
                
                if( optgroup_name === false ) appendTo = '#'+id+' ul';
                else                          appendTo = '#'+id+' ul div.optgroup_'+optgroup_id;
                    
                    
                $(appendTo).append("<li "+disabledClass+"><input value='"+$(z).val()+"' type='checkbox' "+checked+" "+disabled+" "+dataZ+" /><span style=\"width:100%;display:table-cell;\">"+$(z).text()+"</span></li>");
                
                if(optgroup_members === j+1) {
                    optgroup_size = 0;
                    optgroup_id ++;
                    optgroup_name = false;
                }
                
                
            });
            $('#'+id+' span.zmshead').html( (options.placeholder===undefined) ? '&nbsp;' : options.placeholder );
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
        
        
        if(options.get !== undefined){  //console.log(options.get);
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            var need = false;
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if (pair[0] == options.get) {
                
                    need = pair[1].replace(new RegExp(',', 'g'), '%2C').split('%2C');
                  
                }
            } 
            
            if(need){
                var rel = this.attr('rel');
                var _live = "";
                for(var i=0; i<need.length; i++){
                    $(".zselect#"+rel+" ul li input:checkbox[value='"+need[i]+"']").prop('checked',true);
                    _live += need[i]+",";
                }
                //refresh live value
                if(options.live !== undefined){
                    $(options.live).val(_live.substring(0, _live.length - 1));
                }
                refreshPlaceholder(rel,options.placeholder,options.selectedText);
            }
        }

        // Updates original select after checkbox update
        $(".zselect").on('change', 'input:checkbox', function() {
            var container = $(this).closest('.zselect');
            var rel = container.attr('id');
            refreshPlaceholder(rel, options.placeholder, options.selectedText);

            var select = $('select[rel='+rel+']');
            $.each(container.find('input:checkbox'), function(k, v) {
                if($(v).val() !== undefined){
                    if($(v).prop('checked')) {
                        select.find("option[value='"+$(v).val()+"']").prop("selected", true);
                    } else {
                        select.find("option[value='"+$(v).val()+"']").prop("selected", false);
                    }
                }
            });
            select.trigger('change');
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
    
            
    disable : function (val,state){ //console.log(state);
        if(val!==undefined){
            if(state) $("div#"+$(this).attr('rel')+" ul li input:checkbox[value='"+val+"']").attr('disabled','disabled');
            else      $("div#"+$(this).attr('rel')+" ul li input:checkbox[value='"+val+"']").removeAttr('disabled');
        }
        else{
            if(state) $("div#"+$(this).attr('rel')+" ul li input:checkbox").attr('disabled','disabled');
            else      $("div#"+$(this).attr('rel')+" ul li input:checkbox").removeAttr('disabled');
        }
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
    },
    reflow : function(){
        onResize(true);
    },   
    
    add : function(option, pos){
        var position = pos || 'append';
        var checked='', disabled='', disabledClass='';
        
        if(option.checked)  checked=' checked="checked" ';
        if(option.disabled) {disabled=' disabled="disabled" '; disabledClass=' class="disabled" ';}
        
        if(position === 'append') $("div#"+$(this).attr('rel')+" ul").append("<li "+disabledClass+"><input value='"+option.value+"' type='checkbox' "+checked+" "+disabled+" />&nbsp;"+option.text+"</li>");
        else {
            if(position === 'prepend'){
               $("<li "+disabledClass+"><input value='"+option.value+"' type='checkbox' "+checked+" "+disabled+" />&nbsp;"+option.text+"</li>").insertAfter($("div#"+$(this).attr('rel')+" ul li.deselectall"));
            }
            else{
               $("<li "+disabledClass+"><input value='"+option.value+"' type='checkbox' "+checked+" "+disabled+" />&nbsp;"+option.text+"</li>").insertAfter($("div#"+$(this).attr('rel')+" ul li input[value='"+position.substring(1)+"']").closest('li')); 
            }
        }
        
        
        
          
    }
            
    //,update : function( content ) {  }
    };






$.fn.zmultiselect = function(methodOrOptions) {
    if ( methods[methodOrOptions] ) {
        return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
        return methods.init.apply( this, arguments );
    } else {
        $.error( 'Method ' +  methodOrOptions + ' does not exist on zmultiselect' );
    }    
    };



})( jQuery );
