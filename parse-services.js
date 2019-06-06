const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

const htmlDataFile = __dirname + '/azure-services-tmp.html'
const serviceDataFile = __dirname + '/public/js/data/azure-services.json'
var htmlData = ''
var urlPrefix = 'https://docs.microsoft.com'
var iconPrefix = 'https://docs.microsoft.com/en-us/azure/'

function getHtml () {
  if (!fs.existsSync(htmlDataFile)) {
    return axios.get('https://docs.microsoft.com/en-us/azure/#pivot=products&panel=all')
      .then(function (response) {
        fs.writeFileSync(htmlDataFile, response.data)
      })
  }
  return Promise.resolve()
}

function name2Key (name) {
  let key = String(name)
    .toLowerCase()
    .replace(/\(|\)/gi, '')
    .trim()
    .replace(/ /g, '-')

  return key
}

function buildUrl (str, prefix) {
  str = String(str || '').trim()
  prefix = String(prefix || '').trim()

  if (!str) {
    return null
  }

  if (-1 !== str.search(/^https?:\/\//i)) {
    return str
  }

  return (str.search('docs.microsoft.com') === -1 ? prefix + str : str)
}

getHtml()
  .then(function () {
    htmlData = fs.readFileSync(htmlDataFile, 'utf-8')

    const $ = cheerio.load(htmlData)

    var curCategory = null
    var servicesMap = {}

    const divArr = $('ul.directory .group')
    divArr.each(function (idx, val) {
      $children = $(val).children()

      $children.each(function (i, v) {
        if ($(v).is('h3')) {
          curCategory = $(v).html()
        } else {
          $(v).children().map(function (sIdx, sVal) {
            let name = $(sVal).find('p').text()
            let href = $(sVal).find('a').attr('href')
            let icon = $(sVal).find('img').attr('src')
            id = name2Key(name)

            switch(id) {
              case 'machine-learning': // bug at azure product list; is a group name
              case 'anomaly-finder':   // discontinued, anomaly-detector instead
              case 'emotion-api':      // replaced by dace api
              case 'recommendations-api': // discontinued  https://docs.microsoft.com/en-us/azure/cognitive-services/recommendations/overview
              case 'web-language-model-api': // discontinued https://docs.microsoft.com/en-us/azure/cognitive-services/web-language-model/home
              case 'linguistic-analysis-api': // discontinued https://docs.microsoft.com/en-us/azure/cognitive-services/linguisticanalysisapi/home
              case 'security-information': // not a service, but a guide
                return
                break
            }

            if (id === 'data-lake-storage-gen2') {
              id = 'data-lake-storage'
            }

            if (id === 'container-instances') {
              // fix as official list has bug in naming same services
              id = 'azure-container-instances'
            }

            if (name === '') {
              return
            }
            if (servicesMap.hasOwnProperty(id)) {
              servicesMap[id].category.push(curCategory)
            } else {
              servicesMap[id] = {
                id,
                name,
                category: [curCategory],
                isAzureProduct: true,
                servicesIO: [],
                url: buildUrl(href, urlPrefix),
                icon: buildUrl(icon, iconPrefix)
              }
            }
          })
        }
      })
    })

    // add manually services which are not present at azure product list
    servicesMap['anomaly-detector'] = {
      id: 'anomaly-detector',
      name: 'Anomaly Detector API',
      category: ["AI + Machine Learning"],
      isAzureProduct: true,
      servicesIO: [],
      url: buildUrl('/en-us/azure/cognitive-services/anomaly-detector/', urlPrefix),
      icon: buildUrl('media/index/api_anomaly_finder.svg', iconPrefix)
    }

    servicesMap["azure-blockchain-service"] = {
      id: "azure-blockchain-service",
      name: "Azure Blockchain Service",
      category: ["Blockchain"],
      isAzureProduct: true,
      servicesIO: [],
      url: 'https://azure.microsoft.com/en-us/services/blockchain-service/',
      icon: "img/icon-azure-blockchain-service.png"
    }

    servicesMap["azure-blockchain-service"] = {
      id: "azure-red-hat-openshift",
      name: "Azure Red Hat OpenShift",
      category: ["Containers"],
      isAzureProduct: true,
      servicesIO: [],
      url: buildUrl('/en-us/azure/openshift/', urlPrefix),
      icon: "img/icon-azure-openshift-service.png"
    }

    fs.writeFileSync(serviceDataFile, JSON.stringify(servicesMap))
  })
