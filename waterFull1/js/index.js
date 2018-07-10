(function(){
   var oLi = $('li');
   var num = 1;
   // 判断是否加载完 dom
   var flag = false;
   getData();
   function getData(){
       // 加载完 dom 再发送请求
       if(!flag){
           // console.log("num=" + num);
           flag = true;
           $.ajax({
               type: 'GET',
               url: 'http://localhost:8000/waterfull/js/getPics.php?cpage=' + num,
               success: function(data){
                   // 转成 JSON 格式
                   // console.log(JSON.parse(data));
                   // 添加数据
                   addDom(data);
               },
               // 数据请求之前做的事情
               beforeSend: function(data){
                   if(data.readyState == 0){
                       // console.log(data.readyState);
                       $('.loading').fadeIn(100);
                   }
               },
               // 数据请求之后做的事情
               complete: function(data){
                   if(data.status == 200){
                       // console.log(data.status);
                       $('.loading').fadeOut(300);
                   }
               }
           });
           num ++;
       }
   }
   function addDom(data){
       var dataList = JSON.parse(data);
       if(dataList.length >= 1){
           dataList.forEach(function(ele,index){
               // ele.preview ele.title
               var iDiv = $('<div class="item"></div>'),
                   imgBox = $('<div class="imgBox"></div>'),
                   oP = $('<p></p>'),
                   img = new Image();
               img.src = ele.preview;
               oP.text(ele.title);
               img.onload = function(){
                   imgBox.append(img);
                   iDiv.append(imgBox).append(oP);
                   // 找到最小的那列
                   var index = getMinLi(oLi);
                   $(oLi[index]).append(iDiv);
               }
           });
           flag = false;
       }
   }
   // 获得最小的 li 的索引
    function getMinLi(dom){
       // 冒泡选择最小的
       var minHeight = parseInt($(dom[0]).css('height'));
       var index = 0;
       for(var i = 1; i < dom.length; i++){
           var height = parseInt($(dom[i]).css('height'));
           if(height < minHeight){
               minHeight = height;
               index = i;
           }
       }
       // console.log(index);
       return index;
    }
    // 监听滚动条
    $(window).scroll(function(){
        // 滚动条高度
        var scrollHeight = $(this).scrollTop();
        // 视口的高度
        var clientHeight = $(window).height();
        // 页面的高度
        var pageHeight = parseInt($(oLi[getMinLi(oLi)]).css('height'));
        if(scrollHeight + clientHeight >= pageHeight){
            getData();
        }
    })
})();
