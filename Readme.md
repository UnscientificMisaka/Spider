# Spider

#### 最近在写一个IT知识测试系统，项目需要所以很无耻的写了个爬虫去抓一下[牛客网](nowcorder.com)的数据,若涉及到一些问题，请通知我立即删除。

+ 其实抓的也不多，因为用了cheerio不好触发点击事件，目前抓的是个人主页已完成的试卷题目，后期考虑会换phantomjs之类的

+ 为了吃语法糖显得优雅一点，把异步代码伪装成同步，node的版本要在7.5以上
+ 在config.js里输入牛客的账号和密码，cookie若有也输入一下，登录后代码会重新设置cookie，这里吐槽一下，牛客的登录表单竟然没有加密，加密要看源码花点心思
+ 抓取数据格式目前为[{question: '', options: [], answer: '', tags: [], analysis: ''}]，目前抓到的页面数据若解析大多是'查看更多'...牛客采取了a标签javascript:void(0)，点击再发请求加载全部数据，其实构造的url就是token加questionId,日后完善这块