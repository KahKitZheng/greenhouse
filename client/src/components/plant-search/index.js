import React, { useState, useEffect } from "react";
import axios from "axios";

/* Layout components */
import Container from "components/container";
import Loading from "components/loading";

const PlantSearch = () => {
  const [plantData, setPlantData] = useState([]);
  const [query, setQuery] = useState("rose");
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const response = await axios.get(`http://localhost:8080/api/auth/`, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      });

      setToken(response.data.authToken);
    };

    fetchToken();
    fetchData();
  }, [token]);

  const fetchData = async () => {
    const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
    const response = await axios.get(
      `${PROXY_URL}https://trefle.io/api/v1/plants/search?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

    setPlantData(response.data.data);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="bg-gray-900 rounded-b-xl flex flex-col items-center justify-center h-24 mb-8 lg:mb-12">
        <h1 className="font-bold text-3xl leading-none mt-8 lg:mt-12 text-white">
          Explore
        </h1>
        <div className="flex mt-6 w-4/5">
          <input
            className="appearance-none w-full shadow rounded-l py-2 lg:py-4 px-3 lg:px-9 lg:text-lg text-gray-800 leading-tight focus:outline-none"
            type="text"
            value={query}
            placeholder={query}
            onChange={handleChange}
          />
          <button
            className="bg-gray-700 text-white rounded-r shadow px-3"
            onClick={() => fetchData()}
          >
            Search
          </button>
        </div>
      </div>
      <Container>
        <div className="flex flex-col overflow-y-auto h-full lg:px-16">
          {plantData.length === 0 ? (
            <Loading />
          ) : (
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 no-scroll">
              {plantData.map((plant) => (
                <div
                  key={plant.id}
                  className="flex flex-row items-center justify-start bg-white shadow-md h-24 w-full p-2 last:mb-4"
                >
                  <img
                    className="h-20 w-20 object-cover bg-gray-200"
                    src={plant.image_url}
                    alt=""
                  />
                  <div className="flex flex-col items-start pl-4">
                    <p className="text-gray-800 md:text-lg font-medium text-lgbreak-words truncate">
                      {plant.scientific_name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="hidden md:inline-block">
                        Commonly known as&nbsp;
                      </span>
                      <strong>{plant.common_name}</strong>
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="hidden md:inline-block">
                        Is a species of the&nbsp;
                      </span>
                      <strong>{plant.family} family</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PlantSearch;
