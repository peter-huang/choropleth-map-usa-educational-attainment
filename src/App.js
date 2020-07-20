import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";
import { json } from "d3";

const URLS = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
];

/*
const URLS = [
  "https://www.peterhuang.net/projects/choropleth-map-usa-educational-attainment/files/counties.json",
  "https://www.peterhuang.net/projects/choropleth-map-usa-educational-attainment/files/for_user_education.json",
];
*/
function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    getData(URLS);
  }, []);

  /*
   * Fetches the json data asynchronously
   *
   * @param urls - array of links to the data source
   */
  const getData = (urls) => {
    Promise.all(urls.map((url) => fetch(url)))
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.log("Error encountered: " + error));
  };

  return (
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center">
          <div>
            <ChoroplethMap data={data} />
          </div>

          <div class="text-center font-weight-bold text-black mt-2 pt-2 d-none">
            Designed and coded by{" "}
            <a class="credits" href="https://github.com/peter-huang">
              Peter Huang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoroplethMap({ data }) {
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      drawChoroplethMap(data);
    }
  }, [data]);

  const drawChoroplethMap = (data) => {
    console.log(data);
  };

  return (
    <div id="choropleth-container">
      <div id="choropleth"></div>
    </div>
  );
}

export default App;
