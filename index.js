const superagent = require('superagent');
const config = require('./config');
const cheerio = require('cheerio');
const base = 'https://www.nowcoder.com'
var count = 0;
var cookie;
var questions = [];
var num = 0;

var login = async () => {
    return new Promise((resolve, reject) => {
        superagent
        .post(config.login_url)
        .set(config.headers)
        .type('form')
        .send({
            email: config.username,
            pwd: config.password,
            remember: true,
        })
        .end((err, res) => {
            var cookie = res.headers['set-cookie']
            if(err) reject(err)
            resolve(cookie)
        })  
    })
};



var graspUserFinishedTestsUrls = async () => {
    cookie = await login();
    return new Promise((resolve, reject) => {
        superagent
        .get(config.profile_url)
        .set('Cookie',cookie)
        .end((err, res) => {
            if(err) reject(err)
            var $ = cheerio.load(res.text);
            var userFinishedTest = [];
            $('.paper-item','.paper-list').each((i,elem) => {
                var $elem = $(elem);
                if($elem.find('.paper-type').hasClass('special-paper')){
                    userFinishedTest.push($elem.find('.paper-title').closest('a').attr('href'))
                }  
            })
            resolve(userFinishedTest)
        })
    })
    
}

var graspTestContents = async () => {
    let urls = await graspUserFinishedTestsUrls();
    for(var i=0;i<urls.length;i++){
        await fetchUrl(base + urls[i]);
    }
};

var fetchUrl = async (url) => {
    console.log("target url", url)
    count++;
    num++;
    var delay = parseInt((Math.random() * 10000000) % 2000, 10);
    setTimeout(function() {
        count--;
        superagent.get(url)
            .set('Cookie',cookie)
            .end((err, res) => {
                if(err) console.log(err)
                var $ = cheerio.load(res.text);
                var question = $('.subject-question').text();
                var options = [];
                var tags = [];
                var answer = $('.result-subject-answer').text().match(/\w+/)[0];
                var analysis = $('.js-first-comment').children().find('.answer-brief').text();
                $('.tag-label').each((i,elem) => {
                    var $elem = $(elem);
                    tags.push($elem.text().trim())
                })
                $('.result-answer-item').each((i,elem) => {
                    var $elem = $(elem);
                    options.push($elem.text().trim())
                })
                questions.push({ question, options, answer, tags, analysis });
                console.log(questions)
                console.log('当前并发数',count,'当前延迟',delay)
                if(num < 30) {
                    console.log('target',base + $('.pre-next-box').children().last().attr('href'))
                    fetchUrl(base + $('.pre-next-box').children().last().attr('href'))
                }
        })  
    }, delay);
}

graspTestContents();
