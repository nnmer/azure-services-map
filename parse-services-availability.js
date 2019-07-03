const puppeteer = require('puppeteer')
const fs = require('fs')
const cheerio = require('cheerio')

const htmlDataFile = __dirname + '/azure-services-availability-tmp.html'
const serviceDataFile = __dirname + '/public/js/data/azure-services.json'
const regionsDataFile = __dirname + '/public/js/data/azure-regions.json'

async function getHtml () {
  if (!fs.existsSync(htmlDataFile)) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://azure.microsoft.com/en-us/global-infrastructure/services/?regions=all&products=all')

    await page.evaluate(() => {
      document.querySelector('button[id=see-all-products]').click()
    })
    await page.waitFor('#products-regions-overflow-wrapper')

    let htmlData = await page.content()
    fs.writeFileSync(htmlDataFile, htmlData)

    await browser.close()
  }
  return Promise.resolve()
}



getHtml()
  .then(function () {
    let htmlData = fs.readFileSync(htmlDataFile, 'utf-8').toString()

    let regex = /window\.Acom\.CuratedProducts\s?=\s?(.*);/gm
    let curatedServices = regex.exec(htmlData)

    if (curatedServices === null) {
      throw 'Cannot get curatedServices'
    }
    curatedServices = JSON.parse(curatedServices[1])

    regex = /window\.Acom\.CuratedRegions\s?=\s?(.*);/gm
    let curatedRegions = regex.exec(htmlData)
    if (curatedRegions === null) {
      throw 'Cannot get curatedRegions'
    }
    curatedRegions = JSON.parse(curatedRegions[1])

    const $ = cheerio.load(htmlData)
    let regionsVsGeoDict = {}
    let regionsDict = {}
    let regionsByGeoDict = {}

    $('#fixed-row-overflow-wrapper').find('th[data-region-slug]').each(
      function (idx, item) {
        // console.warn($(item))
        let d = $(item).data()
        let slug = d.regionSlug
        let group = d.colgroup
        let title = $(item).text()

        group = group === 'Global' ? 'Non-regional' : group

        regionsVsGeoDict[slug] = group
        regionsDict[slug] = title

        if (!regionsByGeoDict[group]) {
          regionsByGeoDict[group] = []
        }
        regionsByGeoDict[group].push({ slug, title })
      }
    )

    fs.writeFileSync(regionsDataFile, JSON.stringify(regionsByGeoDict))

    // console.warn(regionsVsGeoDict)
    // console.warn(regionsDict)
    // console.warn(regionsByGeoDict)

    let servicesAvailability = {}

    $('#primary-table').find('tr.service-row, tr.capability-row').each(
      function (idx, trItem) {
        let trNodeData = $(trItem).data()

        $(trItem).find('td').each(function (idx2, tdItem) {
          let tdNodeData = $(tdItem).data()
          let tdNodeText = $(tdItem).text()

          if (!servicesAvailability[trNodeData.productSlug]) {
            servicesAvailability[trNodeData.productSlug] = {}
          }

          let isAvailable = !(!!tdNodeText.match('Not available'))
          let img = $(tdItem).find('img')

          // exclude if service is not available in the region
          // this reduce the resulting json file in twice of size
          if (isAvailable) {
            servicesAvailability[trNodeData.productSlug][tdNodeData.regionSlug] = {
              available: isAvailable,
              inPreview: !!img ? !!String(img.attr('src')).match(/preview\.svg/) : false,
              inGA: !!img ? !!String(img.attr('src')).match(/ga\.svg/) : false,
              expectation: !!img && !!String(img.attr('src')).match(/(planned-active|preview-active)\.svg/) ? $(tdItem).find('.qs-table-tooltip').text().trim().replace(/\n\s+/, ': ') : false
            }
          }
        })
      }
    )
    return servicesAvailability
  })
  .then(function (servicesAvailability) {
    let servicesData = JSON.parse(fs.readFileSync(serviceDataFile, 'utf-8'))
    Object.keys(servicesAvailability).map(function (serviceIdFromServicesAvailability) {

      let servicesIdMapping = {
        'redis-cache': 'azure-cache-for-redis',
        'mariadb': 'azure-database-for-mariadb',
        'mysql': 'azure-database-for-mysql',
        'postgresql': 'azure-database-for-postgresql',
        'databricks': 'azure-databricks',
        'cosmos-db': 'azure-cosmos-db',
        'sql-database': 'azure-sql-database',
        'kubernetes-service': 'azure-kubernetes-service-aks',
        'bot-service': 'azure-bot-service',
        'genomics': 'microsoft-genomics',
        'computer-vision': 'computer-vision-api',
        'speaker-recognition': 'speaker-recognition-api',
        'speech-services': 'speech-service',
        'text-analytics': 'text-analytics-api',
        'container-instances': 'azure-container-instances',
        'monitor': 'azure-monitor',
        'digital-twins': 'azure-digital-twins',
        'databox': 'data-box',
        'spatial-anchors': 'azure-spatial-anchors',
        'dns': 'azure-dns',
        'cdn': 'content-delivery-network',
        'signalr-service': 'azure-signalr-service',
        'ddos-protection': 'azure-ddos-protection',
        'lab-services': 'azure-lab-services',
        'analysis-services': 'azure-analysis-services',
        'data-explorer': 'azure-data-explorer',
        'language-understanding-intelligent-services': 'language-understanding-luis',
        'database-migration': 'azure-database-migration-service',
        'information-protection': 'azure-information-protection',
        'app-service\\web': 'app-service---web-apps',
        'blueprints': 'azure-blueprints',
        'frontdoor': 'azure-front-door-service',
        'active-directory': 'azure-active-directory',
        'iot-hub\\device-provisioning-service': 'iot-hub-device-provisioning-service',
        'media-services\\video-indexer': 'video-indexer',
        'cognitive-services\\bing-video-search-api': 'bing-video-search-api',
        'cognitive-services\\bing-web-search-api': 'bing-web-search-api',
        'cognitive-services\\bing-news-search-api': 'bing-news-search-api',
        'cognitive-services\\bing-image-search-api': 'bing-image-search-api',
        'cognitive-services\\bing-visual-search': 'bing-visual-search-api',
        'cognitive-services\\bing-custom-search': 'bing-custom-search-api',
        'cognitive-services\\bing-entity-search-api': 'bing-entity-search-api',
        'autosuggest-api': 'bing-autosuggest-api',
        'spellcheck-api': 'bing-spell-check-api',
        'cognitive-services\\qna-maker': 'qna-maker-api',
        'storage\\netapp': 'azure-netapp-files',
        'search': 'azure-search',
        'cognitive-search': 'answer-search',
        'sap-hana-large': 'sap-hana-on-azure-large-instances',
        'premium-storage': 'disk-storage',
        'advisor': 'azure-advisor',
        'hot-cool-storage': 'blob-storage',
        'app-service\\containers': 'web-app-for-containers',
        'managed-applications': 'azure-managed-applications',
        'data-lake-store': 'data-lake-storage-gen1',
        'active-directory-ds': 'azure-active-directory-for-domain-services',
        'active-directory-b2c': 'azure-active-directory-b2c',
        'app-center': 'visual-studio-app-center',
        'blockchain-service': 'azure-blockchain-service'
      }
      let serviceId = servicesIdMapping[serviceIdFromServicesAvailability] || serviceIdFromServicesAvailability
      // console.warn(serviceIdFromServicesAvailability)
      if (servicesData[serviceId]) {
        servicesData[serviceId].availability = servicesAvailability[serviceIdFromServicesAvailability]
      }

      // manually do mapping for some services
      switch (serviceIdFromServicesAvailability) {
        case 'azure-stack':
          servicesData['azure-stack-operator'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['azure-stack-user'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'virtual-machines':
          servicesData['linux-virtual-machines'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['windows-virtual-machines'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'storage':
          servicesData['queue-storage'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['file-storage'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'media-services':
          servicesData['encoding'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['live-and-on-demand-streaming'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['azure-media-player'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['media-analytics'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'app-service':
          servicesData['api-apps'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'monitor':
          servicesData['application-insights'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'azure-devops':
          servicesData['azure-devops-projects'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'iot-hub':
          servicesData['azure-security-center-for-iot'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['azure-iot'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['iot-edge'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          servicesData['iot-solution-accelerators'].availability = servicesAvailability[serviceIdFromServicesAvailability]
          return
          break
        case 'batch-ai': // linked to the machine learning services
          return
          break
      }
      // EOF

      if (!servicesData[serviceId]) {
        console.log('\x1b[31m%s\x1b[0m %s', serviceId, 'was not found at serviceDataFile')
      }
    })

    fs.writeFileSync(serviceDataFile, JSON.stringify(servicesData))

    console.log()
    console.log()
    console.log()

    console.log('\x1b[32m%s\x1b[0m', 'Checking the services for missing \'availability\' property')
    let skipCheckForServices = [
      'billing', 'azure-portal', 'cli', 'sdks', 'visual-studio', 'visual-studio-code', 'xamarin',
      'azure-us-government', 'azure-germany', 'microsoft-azure-china-21vianet', 'azure-resource-graph',
      'storage-explorer', 'developer-tool-integrations', 'azure-service-health', 'azure-resource-manager',
      'role-based-access-control'
    ]
    Object.keys(servicesData).map(function (serviceId) {
      if (-1 !== skipCheckForServices.indexOf(serviceId)) {
        return
      }

      if (!servicesData[serviceId].availability) {
        console.log('\x1b[31m%s\x1b[0m %s', serviceId, 'has no availability property')
      }
    })
  })
