export function getCaseDensities(date) {
  return fetch(`/data/covid/case_density/${date}`).then(res => res.json());
}

export function getGeoJson() {
  return fetch(
    'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json',
  ).then(res => res.json());
}
