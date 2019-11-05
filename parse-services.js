const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

const htmlDataFile = __dirname + '/azure-products-list-tmp.html'
const htmlDataFileAzureServicesList = __dirname + '/azure-services-list-tmp.html'
const serviceDataFile = __dirname + '/public/js/data/azure-services.json'
var htmlData = ''
var urlPrefix = 'https://docs.microsoft.com'
var iconPrefix = 'https://docs.microsoft.com/en-us/azure/'

var excludeItems = Array(
  'machine-learning', // bug at azure product list; is a group name
  'anomaly-finder',   // discontinued, anomaly-detector instead
  'emotion-api',      // replaced by face api
  'recommendations-api', // discontinued  https://docs.microsoft.com/en-us/azure/cognitive-services/recommendations/overview
  'web-language-model-api', // discontinued https://docs.microsoft.com/en-us/azure/cognitive-services/web-language-model/home
  'linguistic-analysis-api', // discontinued https://docs.microsoft.com/en-us/azure/cognitive-services/linguisticanalysisapi/home
  'linguistic-analysis', // alias to linguistic-analysis-api
  'security-information', // not a service, but a guide
  'machine-learning-services', // is a duplicate for machine-learning-service
  'blockchain-workbench', // is a duplicate for azure-blockchain-workbench,
  'clis', //synonym to cli,
  'azure-devtest-labs', // is a part of azure-lab-services
  'language-understanding', // is an alias to language-understanding-luis
  'speech-to-text', // part of speech-services
  'text-to-speech', // part of speech-services
  'speech-translation', // part of speech-services,
  'microsoft-azure-portal',
  'web-apps', // alias to app-service---web-apps
  'mobile-apps', // alias to app-service---mobile-apps,
  'azure-active-directory-domain-services', // alias to azure-active-directory-for-domain-services,
  'virtual-machines', // alias to linux and windows virtual machines
  'peering-service' // this is not a real service directly from Azure
)

function getHtml () {
  if (!fs.existsSync(htmlDataFile)) {
    return axios.get('https://docs.microsoft.com/en-us/azure/#pivot=products&panel=all')
      .then(function (response) {
        fs.writeFileSync(htmlDataFile, response.data)
      })
  }
  return Promise.resolve()
}

function getHtmlFromAzureServicesList () {

  if (!fs.existsSync(htmlDataFileAzureServicesList)) {
    return axios.get('https://azure.microsoft.com/en-us/services/')
      .then(function (response) {
        fs.writeFileSync(htmlDataFileAzureServicesList, response.data)
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

            if (excludeItems.indexOf(id) !== -1) {
              return
            }

            if (id === 'data-lake-storage-gen2') {
              id = 'data-lake-storage'
            }

            if (id === 'container-instances') {
              // fix as official list has bug in naming same services
              id = 'azure-container-instances'
            }

            if (id === 'azure-synapse-analytics-formerly-sql-dw') {
              id = 'azure-synapse-analytics'
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

    servicesMap['machine-learning-service'].category.push("Internet of Things")

    // add manually services which are not present at azure product list

    servicesMap = { ...servicesMap, ...{
      // '<ID>': {
      //   id: '',
      //   name:'',
      //   category: [],
      //   isAzureProduct: true,
      //   servicesIO: [],
      //   url: '',
      //   icon: '',
      // },
      'anomaly-detector': {
        id: 'anomaly-detector',
        name: 'Anomaly Detector API',
        category: ["AI + Machine Learning"],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/cognitive-services/anomaly-detector/', urlPrefix),
        icon: buildUrl('media/index/api_anomaly_finder.svg', iconPrefix)
      },
      'azure-red-hat-openshift': {
        id: "azure-red-hat-openshift",
        name: "Azure Red Hat OpenShift",
        category: ["Containers"],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/openshift/', urlPrefix),
        icon: "img/icon-azure-openshift-service.png"
      },
      'immersive-reader': {
        id: "immersive-reader",
        name: "Immersive Reader",
        category: ["AI + Machine Learning"],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/cognitive-services/immersive-reader/', urlPrefix),
        icon: "img/azure-cog-immersive-reader.png"
      },
      'data-science-virtual-machines': {
        id: 'data-science-virtual-machines',
        name: 'Data Science Virtual Machines',
        category: ['AI + Machine Learning'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/machine-learning/data-science-virtual-machine/overview', urlPrefix),
        icon: 'img/data-science-vm.png',
      },
      'microsoft-genomics': {
        id: 'microsoft-genomics',
        name: 'Microsoft Genomics',
        category: ['AI + Machine Learning'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/genomics/', urlPrefix),
        icon: 'img/microsoft-genomics.png',
      },
      'form-recognizer': {
        id: 'form-recognizer',
        name: 'Form Recognizer',
        category: ['AI + Machine Learning'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/cognitive-services/form-recognizer', urlPrefix),
        icon: '',
      },
      'ink-recognizer': {
        id: 'ink-recognizer',
        name: 'Ink Recognizer',
        category: ['AI + Machine Learning'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/cognitive-services/ink-recognizer/', urlPrefix),
        icon: '',
      },
      'personalizer': {
        id: 'personalizer',
        name: 'Personalizer',
        category: ['AI + Machine Learning'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/cognitive-services/personalizer/', urlPrefix),
        icon: '',
      },
      'windows-virtual-desktop': {
        id: 'windows-virtual-desktop',
        name: 'Windows Virtual Desktop',
        category: ['Windows Virtual Desktop'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/virtual-desktop/overview', urlPrefix),
        icon: '',
      },
      'windows-10-iot-core-services': {
        id: 'windows-10-iot-core-services',
        name: 'Windows 10 IoT Core Services',
        category: ['Internet of Things'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/windows-hardware/manufacture/iot/iotcoreservicesoverview', urlPrefix),
        icon: '',
      },
      // 'azure-pipelines': {
      //   id: 'azure-pipelines',
      //   name:'Azure Pipelines',
      //   category: ['Developer Tools', 'DevOps'],
      //   isAzureProduct: true,
      //   servicesIO: [],
      //   url: buildUrl('/en-us/azure/devops/pipelines/index', urlPrefix),
      //   icon: '',
      // },
      'virtual-wan': {
        id: 'virtual-wan',
        name: 'Virtual WAN',
        category: ['Networking'],
        isAzureProduct: true,
        servicesIO: [],
        url: buildUrl('/en-us/azure/virtual-wan/', urlPrefix),
        icon: 'img/virtual-wan.png',
      }
    }}

    let ordered = {}
    Object.keys(servicesMap).sort().forEach(function (key) {
      ordered[key] = servicesMap[key]
    })

    return ordered
  })
  .then( servicesMap => {
    // console.warn(servicesMap);exit(1)
    return getHtmlFromAzureServicesList()
      .then( res => {
        htmlData = fs.readFileSync(htmlDataFileAzureServicesList, 'utf-8');
        const $ = cheerio.load(htmlData);

        var curCategory = null;

        console.log('\x1b[32m%s\x1b[0m', 'Fetching https://azure.microsoft.com/en-us/services/ product list to check what is missing')

        const divArr = $('#products-list').children();
        divArr.each(function (idx,val){

          if ($(val).hasClass('column')) {
            curCategory = $(val).find('.product-category').text()
          } else {

            let services = $('a[data-event-property]',val)
            services.each(function(i,v){
              $('.wa-previewTag', v).remove();
              let name = $('h2 > span',v).html()
              // let description =$(v).next().html()
              if (name != curCategory) {


                let id = name2Key(name)
                if (excludeItems.indexOf(id) !== -1) {
                  return
                }

                let nameWithoutAzurePrepended = id.substr(6)

                if (servicesMap.hasOwnProperty(id)
                  || servicesMap.hasOwnProperty('azure-'+id)
                  || servicesMap.hasOwnProperty(id+'-api')
                  || servicesMap.hasOwnProperty(id+'-service')
                  || servicesMap.hasOwnProperty(nameWithoutAzurePrepended)
                ){
                  // console.log('\x1b[32m%s\x1b[0m skipping (%s at %s)', id, name, curCategory)
                } else {
                  console.log('\x1b[31m%s\x1b[0m service does not exists at azure products list (%s at %s)', id, name, curCategory)

                }
              }
            })
          }
        })

        return servicesMap
      })
  })
  .then ( servicesMap => {
    fs.writeFileSync(serviceDataFile, JSON.stringify(servicesMap))
  })
