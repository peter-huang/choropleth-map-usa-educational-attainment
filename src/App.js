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
    const topology = data[0];
    const education = data[1];

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
      .attr("id", "map")
      .attr("width", dim.width)
      .attr("height", dim.height);

    const scale = topology.transform.scale;
    const translate = topology.transform.translate;

    const states = topology.objects.states;
    const counties = topology.objects.counties;
    const nations = topology.objects.nation;
    const bbox = topology.bbox;

    // Data sets
    const statesDataSet = topojson.feature(topology, states);
    const countiesDataSet = topojson.feature(topology, counties);
    const nationDataSet = topojson.feature(topology, nations);

    //const projection = d3.geoAlbersUsa().translate(translate);
    const projection = d3
      .geoIdentity()
      .fitSize([dim.width, dim.height], countiesDataSet);

    const path = d3.geoPath().projection(projection);
    const countiesGroup = svg.append("g").attr("id", "counties");

    console.log(topology);
    console.log(translate);

    countiesGroup

      .selectAll("path")
      .data(countiesDataSet.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("fill", "#444")
      .attr("d", path);
  };

  return (
    <div id="choropleth-container">
      <div id="choropleth"></div>
    </div>
  );
}

export default App;
