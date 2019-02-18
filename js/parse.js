const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

const htmlDataFile = __dirname+"/data/azure-services.html"
const serviceDataFile = __dirname+"/data/azure-services.json"
var htmlData = "";
var urlPrefix = "https://docs.microsoft.com"
var iconPrefix = "https://docs.microsoft.com/en-us/azure/"

function getHtml() {
    
    if (!fs.existsSync(htmlDataFile)) {         
        return axios.get("https://docs.microsoft.com/en-us/azure/#pivot=products&panel=all")
            .then(function(response){
                fs.writeFileSync(htmlDataFile, response.data)
            });
    }
    return Promise.resolve()
    
}

function name2Key(name) {

  let key = String(name)
    .toLowerCase()
    .replace(new RegExp('^azure'),'')
    .trim()
    .replace(new RegExp(' ', 'g'),'-')
    ;

    return key;
}

getHtml()
    .then(function(){

        htmlData = fs.readFileSync(htmlDataFile, 'utf-8');

        const $ = cheerio.load(htmlData);

        var curCategory = null;
        var servicesMap = {};

        const divArr = $('ul.directory .group');
        divArr.each(function (idx,val){
            $children = $(val).children()
            var curCategory = null;
            $children.each(function(i,v) {
                if ($(v).is('h3')) {
                    console.warn('category');
                    curCategory = $(v).html();
                    console.warn(curCategory);
                } else {
                    console.warn('items')
                    $(v).children().map(function(sIdx, sVal){
                        // console.warn(sVal)
                        let name = $(sVal).find('p').text()
                        let href = $(sVal).find('a').attr('href')
                        let icon = $(sVal).find('img').attr('src')
                        id = name2Key(name)
                        console.warn(name)
                        console.warn(href)
                        console.warn(icon)
                        
                        if (servicesMap.hasOwnProperty(id)){
                            servicesMap[id].category.push(curCategory)
                        } else {
                            servicesMap[id] = {
                            id,
                            name, 
                            category: [curCategory], 
                            servicesIO: [],
                            url: urlPrefix+href,
                            icon: iconPrefix+icon
                            }
                        }
                    })
                }
            })                 
        })

        fs.writeFileSync(serviceDataFile, JSON.stringify(servicesMap))
    })

