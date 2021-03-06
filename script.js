const continentSelect = document.getElementById("continent-select");
const countriesList = document.getElementById("countries-list");

const continentsQuery = `query {
                            continents {
                              name
                              code
                            }
                          }`;

fetchQuery(continentsQuery).then((data) => {
  const continents = data.data.continents;
  continents.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent.code;
    option.text = continent.name;
    continentSelect.appendChild(option);
  });
});

continentSelect.addEventListener("change", async (e) => {
  const continentCode = e.target.value;
  const countries = await getContinentCountries(continentCode);
  displayCountriesList(countries);
});

function displayCountriesList(countries) {
  countriesList.innerHTML = "";
  countries.forEach((country) => {
    const li = document.createElement("li");
    li.textContent = country.name;
    countriesList.appendChild(li);
  });
}

function getContinentCountries(continentCode) {
  const countriesQuery = `query getCountries($code: ID!) {
                            continent(code: $code) {
                              countries {
                                name
                              }
                            }
                          }`;

  const countries = fetchQuery(countriesQuery, {
    code: continentCode,
  }).then((data) => data.data.continent.countries);

  return countries;
}

function fetchQuery(query, variables) {
  const url = "https://countries.trevorblades.com/";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

  return fetch(url, options).then((res) => res.json());
}
