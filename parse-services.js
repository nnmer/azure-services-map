const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

const htmlDataFile = __dirname+"/azure-services-tmp.html"
const serviceDataFile = __dirname+"/public/js/azure-services.json"
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
    .replace(/\(|\)/gi,'')
    .trim()
    .replace(/ /g,'-')
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

            $children.each(function(i,v) {
                if ($(v).is('h3')) {
                    curCategory = $(v).html();
                } else {
                    $(v).children().map(function(sIdx, sVal){
                        let name = $(sVal).find('p').text()
                        let href = $(sVal).find('a').attr('href')
                        let icon = $(sVal).find('img').attr('src')
                        id = name2Key(name)

                        if (id == 'data-lake-storage-gen2') {
                          id = 'data-lake-storage'
                        }

                        if (id=='container-instances') {
                          // fix as official list has bug in naming same services
                          id = 'azure-container-instances'
                        }

                        if (name == '') {
                            return
                        }
                        if (servicesMap.hasOwnProperty(id)){
                            servicesMap[id].category.push(curCategory)
                        } else {
                            servicesMap[id] = {
                            id,
                            name,
                            category: [curCategory],
                            servicesIO: [],
                            url: (href && href.search('docs.microsoft.com') == -1 ? urlPrefix+href : href),
                            icon: (icon && icon.search('docs.microsoft.com') == -1 ? iconPrefix+icon : icon)
                            }
                        }
                    })
                }
            })
        })

        fs.writeFileSync(serviceDataFile, JSON.stringify(servicesMap))
    })
