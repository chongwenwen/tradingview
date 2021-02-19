<template>
    <div class="version_container">
        <div class="main">
            <p>你的浏览器版本太低了 :</p>
            <p>
                推荐使用: <a href='https://www.baidu.com/s?ie=UTF-8&wd=%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank'>谷歌 </a>
                <a href='https://www.baidu.com/s?ie=UTF-8&wd=%E7%81%AB%E7%8B%90%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank'>火狐</a> 其他双核极速模式
            </p>
            <p>如果你使用的是双核浏览器,请切换到极速模式访问</p>
        </div>
    </div>
</template>
<script>
    
</script>

<style lang="less">
    .version_container{
       text-align:center;
       color:#fff;
       background-image: linear-gradient(270deg,#22e6b8,#00c1ce);
       width:100%;
       height:100%;
       border:0;
       position:fixed;
       top:0;
       left:0;
       z-index:1234;
       padding-top:20%;
       .main{
          p{
            font-size:20px;
            line-height: 40px;
            a{
                color:#e45555;
                font-size:18px;
                &:hover{
                    text-decoration: underline;
                }
            }
          }
       }
    }
</style>