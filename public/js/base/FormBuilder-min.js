var Modules={},urlBucket="https://s3-sa-east-1.amazonaws.com/tbl-sis",http=new XMLHttpRequest();function FormField(e,a){var c="",d=(e.Config.length?'maxlength= "'+e.Config.length+'"':""),f=(e.Config.label?e.Config.label:e.Field+":"),b="";Attributes='name="'+e.Field+'"'+d;c+='<fieldset data-target="'+a+'">';c+="<label>"+f+" </label>";switch(e.Config.type){case"image":c+='<div class="image-upload" id="upload-'+e.Field+'"><i></i><div class="progress"><div class="determinate"></div></div></div>';b+="field-image";case"text":b+=" materialize-textarea";c+='<textarea class="'+b+'" '+Attributes+"></textarea>";break;case"select":c+='<select class="'+b+'" '+Attributes+">";$.each(e.Config.options,function(g,h){c+='<option class="'+b+'" value="'+g+'">'+h+"</option>"});c+="</select>";break;case"checkbox":$.each(e.Config.options,function(g,h){c+='<input class="'+b+'" '+Attributes+' type="checkbox" id="alt_'+e.Field+"_"+g+'" value="'+g+'"> <label class="alt" for="alt_'+e.Field+"_"+g+'">'+h+"</label>"});break;case"radio":$.each(e.Config.options,function(g,h){c+='<input class="'+b+'" '+Attributes+' type="radio" id="alt_'+e.Field+"_"+g+'" value="'+g+'"> <label class="alt" for="alt_'+e.Field+"_"+g+'">'+h+"</label>"});break;case"switch":c+='<div class="switch"> <label> <input class="'+b+'" '+Attributes+' type="checkbox" value="1"> <span class="lever"></span> </label> </div>';break;case"number":c+='<input class="'+b+'" '+Attributes+' type="number">';break;case"tags":b+=" tags";c+='<input  class="'+b+'" '+Attributes+" />";break;case"autocomplete":b+=" autocomplete";c+='<ul class="result-autocomplete" id="result-'+e.Field+'"></ul>';c+='<input class="'+b+'" '+Attributes+">";break;case"custom":b+=" autocomplete";c+='<div class="'+b+'" '+Attributes+">"+e.Content+"</div>";break;case"password":Attributes+=' type="password"';default:case"varchar":c+='<input class="'+b+'" '+Attributes+">";break}c+="</fieldset>";return c}function FormMask(a){switch(a.Config.type){case"image":var b=$.extend({_token:$('meta[name="csrf-token"]').attr("content"),location:a.Config.location},a.Config.formData);UploadConfig=$.extend({uploadScript:"/upload",buttonText:"camera_alt <span>Selecionar</span>",buttonClass:"material-icons",fileObjName:"Filedata",fileSizeLimit:"100MB",fileType:false,multi:true,auto:true,queueID:"upload-"+a.Field,itemTemplate:'<span class="uploadifive-queue-item"></span>'},a.Config);$("#form-"+a.Target+' [name="'+a.Field+'"]').hide();$("#form-"+a.Target+" #upload-"+a.Field+" i").uploadifive({auto:UploadConfig.auto,uploadScript:UploadConfig.uploadScript,buttonText:UploadConfig.buttonText,buttonClass:UploadConfig.buttonClass,fileObjName:UploadConfig.fileObjName,fileSizeLimit:UploadConfig.fileSizeLimit,fileType:UploadConfig.fileType,multi:UploadConfig.multi,formData:b,queueID:UploadConfig.queueID,itemTemplate:UploadConfig.itemTemplate,onProgress:function(c,f){Loader(true);var d=0;if(f.lengthComputable){d=Math.round((f.loaded/f.total)*100)}c.queueItem.parents(".image-upload").find(".progress").show().find(".determinate").css("width",d+"%")},onUploadComplete:function(d,e){var c=JSON.parse(e);$("#form-"+a.Target+' [name="'+a.Field+'"]').val(c.file);d.queueItem.parents(".image-upload").css({"background-image":"url('"+urlBucket+UploadConfig.location+c.file+"')"});setTimeout(function(){d.queueItem.parents(".image-upload").find(".progress").hide();Loader(false)},100)}});break;case"select":$("#form-"+a.Target+" select").material_select();break;case"tags":$("#form-"+a.Target+" .tags").tagsInput(a.Config.tagsInput);break;case"autocomplete":$("#form-"+a.Target+' [name="'+a.Field+'"]').keyup(function(){var c=$(this);if(c.val()==""){return false}Load({navAjax:false,Type:"POST",DataType:"json",Url:a.Config.url,Data:{search:c.val()},Success:function(d){if(typeof a.Config.callback=="function"){a.Config.callback(d,a,c)}}})});if(typeof a.Config.onClick=="function"){$(document).off("click","#result-"+a.Field+"li");$("#result-"+a.Field).on("click","li",function(){a.Config.onClick($(this),$("#form-"+a.Target+' [name="'+a.Field+'"]'))})}break;default:if(typeof a.Config.keyup=="function"){$("#form-"+a.Target+' [name="'+a.Field+'"]').keyup(function(){a.Config.keyup($(this),a)})}if(typeof a.Config.blur=="function"){$("#form-"+a.Target+' [name="'+a.Field+'"]').blur(function(){a.Config.blur($(this),a)})}if(typeof a.Config.focus=="function"){$("#form-"+a.Target+' [name="'+a.Field+'"]').focus(function(){a.Config.focus($(this),a)})}if(typeof a.Config.click=="function"){$("#form-"+a.Target+' [name="'+a.Field+'"]').click(function(){a.Config.click($(this),a)})}if(typeof a.Config.change=="function"){$("#form-"+a.Target+' [name="'+a.Field+'"]').change(function(){a.Config.change($(this),a)})}break}}function GridField(c,b,a){switch(c.type){case"image":if(fileExists(urlBucket+a)&&a!==""){return'<td data-field="'+b+'"><img src="'+urlBucket+c.location+"/"+a+'"></td>'}else{return'<td data-field="'+b+'"><img src="img/bg/no-image.png"></td>'}break;default:return'<td data-field="'+b+'" data-search="'+removeAcentos(a).toLowerCase()+'">'+a+"</td>";break}}function setValue(d,a,c,b){switch(a.type){case"image":if(c!=""){$(b).find("#upload-"+d).css({"background-image":"url('"+urlBucket+a.location+"/"+c+"')"})}break;case"switch":if(c!==""&&c!=="0"){$(b).find('[name="'+d+'"]').prop("checked",true)}break;case"password":break;case"autocomplete":if(typeof c=="object"&&c!==null){$(b).find('[name="'+d+'"]').val(c.value).data("id",c.key)}break;default:$(b).find('[name="'+d+'"]').val(c);break}}function Form(e,c,b){Modules[e.Table]=e;var d="",a={Method:"POST",Action:"/",Buttons:{Save:{Show:true,Name:"Salvar"}}};Config=$.extend(a,e);d+='<form method="'+Config.Method+'" action="'+Config.Action+'" id="form-'+e.Table+'" data-new="'+e.New+'">';d+=(e.Title?"<h1><span>"+e.Title+"</span></h1>":"");d+=(e.Subtitle?"<h3>"+e.Subtitle+"</h3>":"");d+='<input type="hidden" value="'+$('meta[name="csrf-token"]').attr("content")+'" name="_token">';$.each(e.Fields,function(f,g){if(inArray(f,e.Hidden)===false){if(g.title!==undefined){d+="<h2><span>"+g.title+"</span></h2>"}d+=FormField({Field:f,Config:g},e.Table)}});d+='<div class="buttons">';if(Config.Buttons!==false){if(Config.Buttons.Save.Show){d+='<button class="btn"><i class="material-icons left">save</i> '+(Config.Buttons.Save.Name?Config.Buttons.Save.Name:"Salvar")+"</button>"}}d+="</div>";d+="</form>";$(c).append(d);if(e.Value!==null){if(typeof e.Value==="object"){$.each(e.Value,function(g,f){setValue(g,e.Fields[g],f,c)})}}$.each(e.Fields,function(f,g){if(inArray(f,e.Hidden)===false){FormMask({Field:f,Config:g,Target:e.Table})}});if(typeof b==="function"){b(e,c)}}function Grid(d,b){var c="",a={};Config=$.extend(a,d);c+='<table class="grid-builder" id="grid-'+d.Table+'">';c+="<thead>";c+="<tr>";if(d.Multi===true){c+='<th><input type="checkbox" id="multi"> <label for="multi"></label></th>'}$.each(d.Fields,function(e,f){if(inArray(e,d.Hidden)===false){c+="<th>"+(f.label?f.label:e)+"</th>"}});c+="<th></th>";c+="</tr>";c+="</thead>";if(typeof d.Values==="object"){$.each(d.Values,function(f,e){c+='<tr href="/'+d.Key+"/"+f+'" data-id="'+f+'">';if(d.Multi===true){c+='<td><input type="checkbox" id="select-'+f+'"> <label for="select-'+f+'"></label></td>'}$.each(e,function(h,g){if(inArray(h,d.Hidden)===false){c+=GridField(d.Fields[h],h,g)}});c+='<td> <ul> <li> <i class="material-icons edit">build</i> </li> </ul> </td>';c+="</tr>"})}c+="</table>";$(b).append(c)}function Post(g){var f=Modules[g.attr("id").replace("form-","")],c=g.data("new"),e,b=[],a,d;if(typeof f.Before==="function"){if(!f.Before(f,g)){return false}}g.find('fieldset[data-target="'+g.attr("id").replace("form-","")+'"]').find("input, textarea, select").each(function(){a=true;d=$(this).val();if($(this).attr("type")=="checkbox"&&$(this).prop("checked")==false){d="0"}if($(this).attr("type")=="password"&&$(this).val()==""){a=false}if($(this).attr("name")!==undefined&&a){b[$(this).attr("name")]=($(this).data("value")!==undefined?$(this).data("value"):d)}});Load({Url:g.attr("action"),Type:"POST",DataType:"json",Data:b,navAjax:false,Success:function(i){if(typeof f.After=="function"){var h=f.After(f,i,g);if(typeof h=="object"){f.Fields=h.Fields;f.Hidden=h.Hidden;f.New=h.New;f.Key=h.Key;i=h.After;g=h.This}else{if(!h){return false}}}if(i.status==true){Materialize.toast('<i class="material-icons left">done</i> Registro salvo com sucesso',4000);if(c){e+='<tr href="/'+f.Key+"/"+i.model.id+'" data-id="'+i.model.id+'">';$.each(i.model,function(k,j){if(inArray(k,f.Hidden)===false){e+=GridField(f.Fields[k],k,j)}});e+='<td> <ul> <li> <i class="material-icons edit">build</i> </li> </ul> </td>';e+="</tr>";$(g.attr("id").replace("form","#grid")).prepend(e)}else{$.each(i.model,function(k,j){if(inArray(k,f.Hidden)===false){switch(f.Fields[k]["type"]){case"image":if(j!==""){$(g.attr("id").replace("form","#grid")+' tbody [data-id="'+i.model.id+'"] [data-field="'+k+'"] img').attr("src",urlBucket+j)}break;default:$(g.attr("id").replace("form","#grid")+' tbody [data-id="'+i.model.id+'"] [data-field="'+k+'"]').html(j);$(g.attr("id").replace("form","#grid")+' tbody [data-id="'+i.model.id+'"] [data-field="'+k+'"]').attr("data-search",removeAcentos(j).toLowerCase());break}}})}setTimeout(function(){g.parents(".modal").remove()},100);g.parents(".modal").closeModal()}else{Materialize.toast('<i class="material-icons left">error</i> Erro ao salvar registro',4000)}},Error:function(h){$.each(h.responseJSON,function(i,j){Materialize.toast('<i class="material-icons left">error</i> '+j,4000)})}},false)}$(document).on("submit","form:not(.stopFunction)",function(){Post($(this));return false});$(document).on("click","table.grid-builder tbody tr td i.edit",function(){var a={id:($(".modal").length+1),url:$(this).parents("tr").attr("href"),footerFixed:"modal-fixed-footer"};initModal(a)});