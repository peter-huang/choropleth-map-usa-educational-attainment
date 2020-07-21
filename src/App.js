import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";
import * as topojson from "topojson";

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
    const counties = data[0];
    const education = data[1];

    console.log(counties);

    const padding = {
      top: 25,
      right: 25,
      bottom: 25,
      left: 25,
    };

    const dim = {
      width: 1000 + padding.left + padding.right,
      height: 500 + padding.top + padding.bottom,
    };

    // TItles
    d3.select("#choropleth")
      .append("div")
      .attr("id", "title")
      .text("United States Educational Attainment");
    d3.select("#title")
      .append("div")
      .attr("id", "description")
      .text(
        "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
      );

    const svg = d3
      .select("#choropleth")
      .append("svg")
      .attr("width", dim.width)
      .attr("height", dim.height);

    console.log(counties);
  };

  return (
    <div id="choropleth-container">
      <div id="choropleth"></div>
    </div>
  );
}

export default App;
