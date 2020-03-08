const apiKey = 'QqWsFKIoDWEbA5HwUP5VhCvuDI61oU7a4IRjwhB4';

interface Window {
    NEO:any
    M:any
}

const getDate = () => {
    let date = new Date();
    let dd = String(date.getDate());
    let mm = String(date.getMonth() + 1);
    let yyyy = String(date.getFullYear());
    let today = `${yyyy}-${mm}-${dd}`;
    return today;
};

const getData = async () => {
    const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${getDate()}&api_key=${apiKey}`);
    const data = await response.json();
    window.NEO = data;
    generateTemplate();
};

const getHours = (time:number) => {
    const dt = new Date(time);
    const hr = dt.getUTCHours();
    const m = "0" + dt.getUTCMinutes();
    return hr + ':' + m.substr(-2)
}

const getAsteroids = (day:string) => {
    let snippet = ''
    for (let asteroid in window.NEO.near_earth_objects[day]) {
        let aster = window.NEO.near_earth_objects[day][asteroid];
        snippet += `
            <table style="margin-bottom:50px;">
                <thead>
                    <tr>
                        <th>ID: ${aster.id} | NAME: ${aster.name} | IS POTENTIALY HAZARDOUS: ${aster.is_potentially_hazardous_asteroid}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Przewidywana minimalna średnica (kilometry): ${aster.estimated_diameter.kilometers.estimated_diameter_min}</td></tr>
                    <tr><td>Przewidywana maksymalna średnica (kilometry): ${aster.estimated_diameter.kilometers.estimated_diameter_max}</td></tr>
                    <tr><td>Przewidywana minimalna średnica (metry): ${aster.estimated_diameter.meters.estimated_diameter_min}</td></tr>
                    <tr><td>Przewidywana maksymalna średnica (metry): ${aster.estimated_diameter.meters.estimated_diameter_max}</td></tr>
                    <tr><td>Godzina przelotu ${getHours(aster.close_approach_data[0].epoch_date_close_approach)}</td></tr>
                    <tr><td>Prędkość km/s: ${aster.close_approach_data[0].relative_velocity.kilometers_per_second}</td></tr>
                    <tr><td>Odległość (km): ${aster.close_approach_data[0].miss_distance.kilometers}</td></tr>
                </tbody>
            </table>
        `;
    }

    return `<ul>${snippet}</ul>`;
};

const generateTemplate = () => {
    let days = Object.keys(window.NEO.near_earth_objects).sort();
    let snippet = ''
    for (let day in days) {
        snippet += `
            <li>
                <div class="collapsible-header">${days[day]}</div>
                <div class="collapsible-body">
                    ${getAsteroids(days[day])}
                </div>
            </li>
        `;
        
    }

    document.getElementById('output').innerHTML += `<ul class="collapsible">${snippet}</ul>`;
    window.M.Collapsible.init(document.querySelectorAll('.collapsible'));
};


getData();