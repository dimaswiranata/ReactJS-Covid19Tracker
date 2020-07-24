import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from "@material-ui/core";
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData } from "./utils";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  // https://disease.sh/v3/covid-19/countries
  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    getWorldwideData();
    getCountriesData();
    return () => {
      console.log('cleanup');
    }
  }, [])

  const getWorldwideData = async () => {
    await fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }

  const getCountriesData = async () => {
    await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2
        }));

        const sortedData = sortData(data);
        setCountries(countries);
        setTableData(sortedData);
      });
  }

  console.log(countries);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ?
        (
          'https://disease.sh/v3/covid-19/all'
        ) : (
          `https://disease.sh/v3/covid-19/countries/${countryCode}`
        )

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  }

  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        {/* header */}
        <div className="app__header">
          {/* title + select input dropdown field */}
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
          {/* infoboxs title="Coronavirus cases" */}
          <InfoBox 
            title="Coronavirus Cases" 
            cases={countryInfo.todayCases} 
            total={countryInfo.cases}
          />

          {/* infoboxs title="Coronavirus recovery" */}
          <InfoBox 
            title="Recovered" 
            cases={countryInfo.todayRecovered} 
            total={countryInfo.recovered}
          />

          {/* infoboxs title="Coronavirus deaths" */}
          <InfoBox 
            title="Deaths" 
            cases={countryInfo.todayDeaths} 
            total={countryInfo.deaths}
          />
        </div>

        {/* map */}
        <Map/>   
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* table */}
          <Table countries={tableData}/>
          <h3>Worldwide new cases</h3>
          {/* graph */}
          <LineGraph/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
