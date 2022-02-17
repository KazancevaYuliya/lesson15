function fetchDataPromise(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open(method, url)

        xhr.onload = () => {
            if (xhr.status == '200') {
                resolve(xhr.response)
            } else {
                reject(xhr.status + ' ' + xhr.statusText)
            }
        }

        xhr.onerror = () => {
            reject(xhr.status + ' ' + xhr.statusText)
        }

        xhr.send()
    })
}
const key = 'a94d0a5ac08570add4b47b8da933f247'
const urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Orsha&appid=${key}`
const urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Orsha&appid=${key}`

const widgetContainerElement = document.querySelector('#widget')


function headerTemplate(weatherData) {
    const { city, countryCode, date, temp, windDeg, windSpeed, description, iconSrc } = weatherData
    const resultTemp = Math.round(temp) > 0 ? '+' + Math.round(temp) : Math.round(temp)

    return `
      <div class="header">
        <div class="d-flex flex-column">
          <div class="mb-auto">
            ${city}, ${countryCode}
            <br>
            ${date.getHours()}:${date.getMinutes()}
          </div>
          <div class="py-5 text-center">
            <img src="${iconSrc}" alt="">
            <br>
            <strong class="description">${description}</strong>
            <h2 class="mt-2">${resultTemp} C</h2>
          </div>
          <div class="d-flex">
            <span class="me-auto">${windDeg}</span>
            <span class="">${windSpeed} m/s</span>
          </div>
        </div>
      </div>
    `
}
function renderHeader(data) {
  widgetContainerElement.innerHTML = headerTemplate(data)
}



fetchDataPromise(urlWetherCurrent, 'GET')
    .then((response) => {
        const data = JSON.parse(response)
        const city = data.name
        const windDeg = data.wind.deg
        const windSpeed = data.wind.speed
        const date = new Date(data.dt * 1000)
        const temp = data.main.temp - 273.15
        const countryCode = data.sys.country
        const description = data.weather[0].description
        const iconSrc = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

        renderHeader({ city, countryCode, date, temp, windDeg, windSpeed, description, iconSrc })
    })


function bodyTemplate(weatherData) {
    const { date, iconSrc, temp } = weatherData

    return `
      <div class="body">
        <span> ${date}</span>
        <img src="${iconSrc}" alt="">
        <span>${temp}</span>
      </div>
    `
}

function widgetBodyTemplate(days) {
    const items = days.map((item) => {
        const [date, iconId, temp] = [new Date(), item.weather[0].icon, item.main.temp]
        const iconSrc = `http://openweathermap.org/img/wn/${iconId}@2x.png`

        return bodyTemplate({ date, iconSrc, temp })
    })

    const itemsHTML = items.join(' ')


    return `
      <div class="widget-body">
        ${itemsHTML}
      </div>
    `
}

function renderBody(data) {
    widgetContainerElement.innerHTML += widgetBodyTemplate(data)
}


fetchDataPromise(urlWetherByDays, 'GET')
    .then((response) => {
        const data = JSON.parse(response).list

        const resultData = data.filter((item, index) => index % 9 == 0)

        renderBody(resultData)
    })



