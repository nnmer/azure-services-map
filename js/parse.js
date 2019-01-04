const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

const htmlDataFile = __dirname+"/data/azure-services.html"
const serviceDataFile = __dirname+"/data/azure-services.js"
var htmlData = "";

function getHtml() {
    
    if (!fs.existsSync(htmlDataFile)) {         
        return axios.get("https://azure.microsoft.com/en-us/services/")
            .then(function(response){
                fs.writeFileSync(htmlDataFile, response.data)
            });
    }
    return Promise.resolve()
    
}

getHtml()
    .then(function(){

        htmlData = fs.readFileSync(htmlDataFile, 'utf-8');

        const $ = cheerio.load(htmlData);

        var curCategory = null;
        var servicesMap = [];

        const divArr = $('#products-list').children();
        divArr.each(function (idx,val){

            if ($(val).hasClass('column')) {
                curCategory = $(val).find('.product-category').text()                
            } else {

                // servicesMap.push({name: curCategory, category: "Azure"});
                
                services = $('a[data-event-property]',val)
                services.each(function(i,v){
                    let name = $('h2',v).html()
                    let description =$(v).next().html()
                    if (name != curCategory) {
                        servicesMap.push({name, category: curCategory, description})
                    }
                })                            
            }            
        })

        fs.writeFileSync(serviceDataFile, JSON.stringify(servicesMap))
    })

