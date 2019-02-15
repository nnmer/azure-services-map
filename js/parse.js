const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

const htmlDataFile = __dirname+"/data/azure-services.html"
const serviceDataFile = __dirname+"/data/azure-services.json"
var htmlData = "";
var urlPrefix = "https://azure.microsoft.com"

function getHtml() {
    
    if (!fs.existsSync(htmlDataFile)) {         
        return axios.get("https://azure.microsoft.com/en-us/services/")
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

        const divArr = $('#products-list').children();
        divArr.each(function (idx,val){

            if ($(val).hasClass('column')) {
                curCategory = $(val).find('.product-category').text()                
            } else {

                // servicesMap.push({name: curCategory, category: "Azure"});
                
                services = $('a[data-event-property]',val)
                services.each(function(i,v){
                    let name = $('h2',v).html()
                    let href = $(v).attr('href')
                    let description =$(v).next().html()
                    if (name != curCategory) {
                        id = name2Key(name)
                        if (servicesMap.hasOwnProperty(id)){
                          servicesMap[id].category.push(curCategory)
                        } else {
                          servicesMap[id] = {
                            name, 
                            category: [curCategory], 
                            servicesIO: [],
                            description,
                            url: urlPrefix+href
                          }
                        }                        
                    }
                })                            
            }            
        })

        fs.writeFileSync(serviceDataFile, JSON.stringify(servicesMap))
    })

