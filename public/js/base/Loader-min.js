var editor=CodeMirror.fromTextArea(document.getElementById("code"),{lineNumbers:true,location:"/code"});function changeSyntax(c){var f=c,a,e,b;if(a=/.+\.([^.]+)$/.exec(f)){var d=CodeMirror.findModeByExtension(a[1]);if(d){e=d.mode;b=d.mime}}else{if(/\//.test(f)){var d=CodeMirror.findModeByMIME(f);if(d){e=d.mode;b=f}}else{e=b=f}}if(e){editor.setOption("mode",b);CodeMirror.autoLoadMode(editor,e)}$(".select-syntax span").text(e)}function changeTheme(a){editor.setOption("theme",a.toLowerCase())}function codeLoad(a){Load({Type:"POST",DataType:"json",navAjax:false,Url:"/load",Data:{file:(a==undefined?Init:a)},Success:function(c){editor.getDoc().setValue(c.Code);if(c.info.extension!==undefined){var b="";switch(c.info.extension){case"js":b="javascript";break;case"less":b="css";break;default:b=c.info.extension;break}changeSyntax(b)}if($('#guard-codes li[data-location="'+a+'"]').length<1){$("#guard-codes").prepend('<li data-location="'+a+'"> <textarea>'+c.Code+"</textarea> </li>");return false}}})}function clickOpenFile(b,a){$(".tabs li.active").removeClass("active");if(a!=false){$(".tabs").append('<li class="active" data-location="'+b.data("location")+'" data-file="'+b.data("file")+'"><i class="material-icons">save</i> '+b.data("file")+' <i class="material-icons close">close</i></li>')}if($('#guard-codes li[data-location="'+b.data("location")+"/"+b.data("file")+'"]').length>0){editor.getDoc().setValue($('#guard-codes li[data-location="'+b.data("location")+"/"+b.data("file")+'"] textarea').val());return false}codeLoad(b.data("location")+"/"+b.data("file"))}function closeTab(a){if(a.hasClass("pendent-save")==true){if(!confirm("Are you sure you want to close the file without saving?")){return false}}if(a.hasClass("active")==false){a.remove();return false}if(a.next("li").length>0){a.next("li").click().addClass("active")}else{if(a.prev("li").length>0){a.prev("li").click().addClass("active")}else{editor.getDoc().setValue("")}}a.remove()}$(".save").click(function(a){if($(".tabs li.active").length<1){exec("name file: ",function(c,b){Load({Url:"/create/file",DataType:"json",Type:"POST",navAjax:false,Data:{location:"/",file:b},Success:function(d){if(d.status==true){$("#exec-console").remove();$(".tabs li.active").removeClass("active");$("#navigation-folders ul > ul").append(insertHTML("/",b,"file"));$(".tabs").append('<li class="active" data-location="/" data-file="'+b+'">'+b+' <i class="material-icons">close</i></li>');$(".save").click()}}})});return false}Load({Type:"POST",navAjax:false,Url:"/save",Data:{content:editor.getValue(),file:$(".tabs li.active").data("location")+"/"+$(".tabs li.active").data("file")},Success:function(){$(".tabs li.active").removeClass("pendent-save")}})});$(".refresh").click(function(){if(confirm("Unsaved changes will be lost. Do you wish to continue?")==true){codeLoad()}});$(window).bind("keydown",function(a){if(a.ctrlKey||a.metaKey){switch(String.fromCharCode(a.which).toLowerCase()){case"s":a.preventDefault();a.stopPropagation();$(".save").click();return false;break;case"l":alert("pesquisar");return false;break}}});$(document).ready(function(){changeSyntax(DefaultSyntax);changeTheme(DefaultTheme);$("select").material_select();window.app={};app.BrainSocket=new BrainSocket(new WebSocket("ws://"+Server+":8080"),new BrainSocketPubSub());app.BrainSocket.Event.listen("app.init",function(a){if(a.client.data.total>1){$("ul.menu-top li.visitors span.count").text(a.client.data.total)}});setTimeout(function(){app.BrainSocket.message("app.init",{hash:"{{ $hash }}",})},500);$(document).on("keypress",".CodeMirror.blocked",function(a){return false});$(".menu-top input").focus(function(){$(this).select()});Load({Url:"/get/files",Type:"POST",navAjax:false,Data:{folder:"/"}},"#navigation-folders ul ul");$(document).on("click","#navigation-folders ul li.folder span",function(){var a=$(this).parent("li");if(a.hasClass("folder")==true){a.find("i:first").toggleClass("hidden")}if(a.find("ul:first").html()!=""){a.find("ul:first").toggle();return false}Load({Url:"/get/files",Type:"POST",navAjax:false,Data:{folder:a.data("location")+"/"+a.data("folder")},Success:function(b){a.find("ul").append(b).show()}})})});$(document).on("dblclick","#navigation-folders ul li.file",function(){if($('.tabs li[data-location="'+$(this).data("location")+'"][data-file="'+$(this).data("file")+'"]').length>0){$('.tabs li[data-location="'+$(this).data("location")+'"][data-file="'+$(this).data("file")+'"]').click();return false}clickOpenFile($(this))});$(document).on("click",".tabs li",function(){$('#guard-codes li[data-location="'+$(".tabs li.active").data("location")+"/"+$(".tabs li.active").data("file")+'"] textarea').val(editor.getValue());$(".tabs li.active").removeClass("active");$(this).addClass("active");editor.getDoc().setValue($('#guard-codes li[data-location="'+$(this).data("location")+"/"+$(this).data("file")+'"] textarea').val())});$(document).on("click",".tabs li i.close",function(a){a.stopPropagation();closeTab($(this).parent("li"))});$(document).on("mousedown",".tabs li",function(a){if(a.which==2){$(this).find("i").click()}});$("#navigation-folders li.folder").rClick({id:"rClick-navigation-folders-li-folder",Menu:{CreateFile:{icon:'<i class="material-icons">insert_drive_file</i>',text:"Create new file",exec:function(a){exec("name file: ",function(c,b){Load({Url:"/create/file",DataType:"json",Type:"POST",navAjax:false,Data:{location:a.data("location")+"/"+a.data("folder"),file:b},Success:function(d){if(d.status==true){$("#exec-console").remove();$('li[data-location="'+a.data("location")+'"]').find("ul:first").prepend(insertHTML(a.data("location")+"/"+a.data("folder"),b,"file")).show()}else{alert(d.msg)}}})})}},CreateFolder:{icon:'<i class="material-icons">create_new_folder</i>',text:"Create new folder",exec:function(a){exec("name folder: ",function(c,b){Load({Url:"/create/folder",DataType:"json",Type:"POST",navAjax:false,Data:{location:a.data("location")+"/"+a.data("folder"),folder:b},Success:function(d){if(d.status==true){$("#exec-console").remove();a.find("ul:first").prepend(insertHTML(a.data("location")+"/"+a.data("folder"),b,"folder")).show()}else{alert(d.msg)}}})})}},RenameFolder:{icon:'<i class="material-icons">mode_edit</i>',text:"Rename folder",exec:function(a){exec("rename folder: ",function(c,b){Load({Url:"/rename/folder",DataType:"json",Type:"POST",navAjax:false,Data:{location:a.data("location"),folder:a.data("folder"),newName:b},Success:function(d){if(d.status==true){$("#exec-console").remove();a.data("folder",d.newName).find(".nameFile:first").text(d.newName)}else{alert("Error")}}})},a.find(".nameFile:first").text())}},DeleteFolder:{icon:'<i class="material-icons">close</i>',text:"Delete folder",exec:function(a){Confirm('Are you sure you want to delete the <b>"'+a.find(".nameFile").text()+'"</b> folder and all the files?',"Yes, Delete Folder!",function(){Load({Url:"/delete/folder",DataType:"json",Type:"POST",navAjax:false,Data:{location:a.data("location"),folder:a.data("folder"),},Success:function(b){a.remove();$(".modal-close").click()}})})}}}});$("#navigation-folders li.file").rClick({id:"rClick-navigation-folders-li-file",Menu:{RenameFile:{icon:'<i class="material-icons left">mode_edit</i>',text:"Rename file",exec:function(a){exec("rename file: ",function(c,b){Load({Url:"/rename/file",DataType:"json",Type:"POST",navAjax:false,Data:{location:a.data("location"),file:a.data("file"),newName:b},Success:function(d){if(d.status==true){$("#exec-console").remove();a.data("file",d.newName).find(".nameFile").text(d.newName)}else{alert("Error")}}})},a.find(".nameFile").text())}},DeleteFile:{icon:'<i class="material-icons left">close</i>',text:"Delete file",exec:function(a){Confirm('Are you sure you want to delete the file <b>"'+a.find(".nameFile").text()+'"</b>?',"Yes, Delete File!",function(){Load({Url:"/delete/file",DataType:"json",Type:"POST",navAjax:false,Data:{location:a.data("location"),file:a.data("file"),},Success:function(b){a.remove();$(".modal-close").click()}})})}}}});$("#navigation-folders").rClick({id:"rClick-navigation-folders",Menu:{CreateFile:{icon:'<i class="material-icons">insert_drive_file</i>',text:"Create new file",exec:function(a){exec("name file: ",function(c,b){Load({Url:"/create/file",DataType:"json",Type:"POST",navAjax:false,Data:{location:"/",file:b},Success:function(d){if(d.status==true){$("#exec-console").remove();$("#navigation-folders ul > ul").append(insertHTML("/",b,"file"))}else{alert(d.msg)}}})})}},CreateFolder:{icon:'<i class="material-icons">create_new_folder</i>',text:"Create new folder",exec:function(a){exec("name folder: ",function(c,b){Load({Url:"/create/folder",DataType:"json",Type:"POST",navAjax:false,Data:{location:"/",folder:b},Success:function(d){if(d.status==true){$("#exec-console").remove();if($("#navigation-folders ul > ul li.folder").length>0){$("#navigation-folders ul > ul li.folder:last").after(insertHTML("/",b,"folder"))}else{$("#navigation-folders ul > ul").prepend(insertHTML("/",b,"folder"))}}else{alert(d.msg)}}})})}}}});$("li").click(function(a){a.stopPropagation();$(".block-selection").hide();if($(this).find("ul").length>0){$(this).find("ul").css({left:($(this).offset().left-$(this).find("ul").width())+($(this).width()+10)}).toggle()}});$("li ul, .block-selection.login li").click(function(a){a.stopPropagation()});$(document).keyup(function(a){if(a.keyCode==27){$(document).click();$("#exec-console").remove()}});$(".CodeMirror").keydown(function(a){if("9,20,16,17,18,2,91,8,121,120,119,118,123,122,37,39,40,38".indexOf(a.keyCode)<0&&a.keyCode!==undefined){if((a.ctrlKey===true&&a.keyCode==83)){$(".tabs li.active").removeClass("pendent-save");return false}if((a.ctrlKey===true&&a.keyCode==65)||(a.ctrlKey===true&&a.keyCode==88)||(a.ctrlKey===true&&a.keyCode==67)){return false}$(".tabs li.active").addClass("pendent-save")}});$(document).click(function(){$(".block-selection li ul, .menu-top li ul, .block-selection").hide()});$(document).ready(function(){$(".search input").keyup(function(){if($(this).val()==""){$(".block-selection:visible li:not(.title li, .search)").show();return false}$(".block-selection:visible li:not(.title li, .search)").hide();$('.block-selection:visible li:not(.title li, .search)[data-search*="'+removeAcentos($(this).val().toLowerCase())+'"]').show()});$(".logar").click(function(){$(document).click()});function a(){Load({Url:"/login",Type:"POST",DataType:"json",navAjax:false,Data:{email:$('.block-selection.login input[type="email"]').val(),password:$('.block-selection.login input[type="password"]').val()},Success:function(b){if(b.status==true){window.location="/"+b.model.hash}else{Materialize.toast("Invalid login or password",4000)}}})}$(".btn-login").click(function(){a()});$(".signin").click(function(){if($('.block-selection.login input[type="email"]').val()==""){Materialize.toast("Enter email",4000);$('.block-selection.login input[type="email"]').focus();return false}if($('.block-selection.login input[type="password"]').val()==""){Materialize.toast("Enter passowrd",4000);$('.block-selection.login input[type="password"]').focus();return false}if($(".tabs li.active").length>0){$(".save").click()}Load({Url:"/register",Type:"POST",DataType:"json",navAjax:false,Data:{email:$('.block-selection.login input[type="email"]').val(),password:$('.block-selection.login input[type="password"]').val()},Success:function(b){a()}});$(document).click()});$(".select-syntax").click(function(){$(document).click();$(".block-selection.syntax").show()});$(".select-theme").click(function(){$(document).click();$(".block-selection.theme").show()});$(".block-selection, .block-selection input, .block-selection .title li").click(function(b){b.stopPropagation()});$(".block-selection.syntax li:not(.title li, .search)").click(function(){$("#mode").val($(this).text().toLowerCase());changeSyntax();$(".select-syntax span").text($(this).text());$(document).click();$('li[data-tooltip="Configurations"]').click();Load({Type:"POST",navAjax:false,Url:"/save/syntax",Data:{syntax:$(this).text().toLowerCase()}})});$(".block-selection.theme li:not(.title li, .search)").click(function(){editor.setOption("theme",$(this).text().toLowerCase());$(".select-theme span").text($(this).text());$(document).click();$('li[data-tooltip="Configurations"]').click();Load({Type:"POST",navAjax:false,Url:"/save/theme",Data:{theme:$(this).text().toLowerCase()}})})});