var Companies=new Array(),Units=new Array(),Indicators=new Array();Load({Type:"POST",DataType:"json",Url:"/companies",navAjax:false,Success:function(a){Companies=a}});Load({Type:"POST",DataType:"json",Url:"all/units",navAjax:false,Success:function(a){Units=a}});