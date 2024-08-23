"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLat, LngLatBounds, Map, Marker } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import MapboxTraffic from "@mapbox/mapbox-gl-traffic";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SearchLocation } from "@/components/dashboard/search-location";

import { Icons } from "../shared/icons";
import { Skeleton } from "../ui/skeleton";
import LoadingIndicator from "./map-loading";

interface EmissionDetail {
  value: number;
  unit: string;
  name: string;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const center = { lat: 43.2557, lng: -79.8711 }; // Hamilton, Ontario
const hamiltonBounds: LngLatBounds = new mapboxgl.LngLatBounds(
  [-80.0, 43.2],
  [-79.7, 43.4],
);

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const originMarkerRef = useRef<Marker | null>(null);
  const destinationMarkerRef = useRef<Marker | null>(null);

  const originPointRef = useRef<LngLat | null>(null);
  const destinationPointRef = useRef<LngLat | null>(null);

  const [isApiLoading, setIsApiLoading] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [emission, setEmission] = useState<{ [key: string]: EmissionDetail }>(
    {},
  );

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [routeData, setRouteData] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const [speed, setSpeed] = useState<number>(0);

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  const [originSearchValue, setOriginSearchValue] = useState<string>("");
  const [destinationSearchValue, setDestinationSearchValue] =
    useState<string>("");

  const [originSearch, setOriginSearch] = useState<any>([]);
  const [destinationSearch, setDestinationSearch] = useState<any>([]);

  const lastKnownPositionRef = useRef<LngLat | null>(null);
  const firstLoadRef = useRef(true);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const location = new mapboxgl.LngLat(
                position.coords.longitude,
                position.coords.latitude,
              );
              // trash
              // originPointRef.current = location;

              lastKnownPositionRef.current = location;

              if (firstLoadRef.current) {
                // Only run this block on the first load
                setIsLoading(false);
                setShowModal(true);
                firstLoadRef.current = false; // Set the flag to false after the first load
              }
              if (mapRef.current) {
                // Update or add a blue circle to the current location
                const circleData: GeoJSON.Feature = {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [location.lng, location.lat],
                  },
                  properties: {},
                };

                if (mapRef.current.getLayer("currentLocationCircle")) {
                  (
                    mapRef.current.getSource(
                      "currentLocationCircle",
                    ) as mapboxgl.GeoJSONSource
                  ).setData(circleData);
                } else {
                  mapRef.current.addSource("currentLocationCircle", {
                    type: "geojson",
                    data: circleData,
                  });

                  mapRef.current.addLayer({
                    id: "currentLocationCircle",
                    type: "circle",
                    source: "currentLocationCircle",
                    paint: {
                      "circle-radius": 10,
                      "circle-color": "#007AFF",
                      "circle-stroke-width": 2,
                      "circle-stroke-color": "#007AFF",
                      "circle-opacity": 0.6,
                    },
                  });
                }
              }
            },
            (error) => {
              console.error("Error retrieving current location", error);
              setLocationError(
                `Unable to retrieve your location (${error.message}). Please ensure location services are enabled.`,
              );
              setIsLoading(false);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 8000 },
          );

          // Cleanup the watchPosition on component unmount
          return () => navigator.geolocation.clearWatch(watchId);
        } else {
          setLocationError(
            "Location access denied. Please enable location services.",
          );
          setIsLoading(false);
        }
      });
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const initializeMap = () => {
        const mapInstance = new mapboxgl.Map({
          container: mapContainerRef.current!,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [center.lng, center.lat],
          zoom: 12,
          maxBounds: hamiltonBounds,
        });

        const trafficControl = new MapboxTraffic({
          showTraffic: true, // This enables the traffic layer by default
        });

        mapInstance.addControl(trafficControl, "top-right");

        mapInstance.on("load", () => {
          mapRef.current = mapInstance;

          const originGeocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            placeholder: "Search for origin",
          });

          const destinationGeocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
            placeholder: "Search for destination",
          });

          originGeocoder.on("result", (e) => {
            const coords = e.result.geometry.coordinates;
            const location = new mapboxgl.LngLat(coords[0], coords[1]);
            originPointRef.current = location;
            if (originMarkerRef.current) originMarkerRef.current.remove();
            const marker = new mapboxgl.Marker({ color: "red" })
              .setLngLat(location)
              .addTo(mapInstance);
            originMarkerRef.current = marker;
            originRef.current!.value = e.result.place_name;
          });

          destinationGeocoder.on("result", (e) => {
            const coords = e.result.geometry.coordinates;
            const location = new mapboxgl.LngLat(coords[0], coords[1]);
            destinationPointRef.current = location;
            if (destinationMarkerRef.current)
              destinationMarkerRef.current.remove();
            const marker = new mapboxgl.Marker({ color: "blue" })
              .setLngLat(location)
              .addTo(mapInstance);
            destinationMarkerRef.current = marker;
            destinationRef.current!.value = e.result.place_name;
            calculateRoute(location);
          });
        });

        mapInstance.on("click", async (e) => {
          const lngLat = e.lngLat;

          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;
          const response = await fetch(url);
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const placeName = data.features[0].place_name;
            if (!originMarkerRef.current) {
              originPointRef.current = lngLat;
              const marker = new mapboxgl.Marker({ color: "red" })
                .setLngLat(lngLat)
                .addTo(mapInstance);
              originMarkerRef.current = marker;
              setOriginSearchValue(placeName);
            } else if (!destinationMarkerRef.current) {
              destinationPointRef.current = lngLat;
              const marker = new mapboxgl.Marker({ color: "blue" })
                .setLngLat(lngLat)
                .addTo(mapInstance);
              destinationMarkerRef.current = marker;
              setDestinationSearchValue(placeName);
              calculateRoute(lngLat);
            }
          }
        });
      };

      initializeMap();
    }
  }, [
    mapRef,
    originPointRef.current,
    destinationPointRef.current,
    firstLoadRef.current,
  ]);

  const checkIfPointIsInHamilton = async (point: LngLat) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${point.lng},${point.lat}.json?access_token=${mapboxgl.accessToken}`,
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const context = data.features[0].context;
      if (context) {
        return context.some((c: any) =>
          c.text.toLowerCase().includes("hamilton"),
        );
      }
    }
    return false;
  };

  const calculateRoute = async (destination: LngLat) => {
    const isOriginInHamilton = await checkIfPointIsInHamilton(
      originPointRef.current!,
    );
    const isDestinationInHamilton = await checkIfPointIsInHamilton(destination);

    if (!isOriginInHamilton || !isDestinationInHamilton) {
      setLocationError("Origin or destination is out of Hamilton bounds.");
      return;
    }

    if (origin) {
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originPointRef.current?.lng},${originPointRef.current?.lat};${destinationPointRef.current?.lng},${destinationPointRef.current?.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
      )
        .then((response) => response.json())
        .then((data) => {
          const route = data.routes[0];
          setRouteData({
            distance: (route.distance / 1000).toFixed(2) + " km",
            duration: Math.round(route.duration / 60) + " min",
          });

          setSpeed(route.distance / route.duration);

          if (mapRef.current) {
            if (mapRef.current.getLayer("route")) {
              mapRef.current.removeLayer("route");
              mapRef.current.removeSource("route");
            }

            mapRef.current.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            });

            mapRef.current.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#FF0000",
                "line-width": 8,
                "line-opacity": 0.75,
              },
            });

            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(originPointRef.current!);
            bounds.extend(destination);
            mapRef.current.fitBounds(bounds, { padding: 100 });
          }
        });
    }
  };

  const fetchSuggestions = async (query) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=5&proximity=-79.90450610000005%2C43.258298600000046&bbox=-141.0,41.7,-52.6,83.1&language=en-US&access_token=${mapboxgl.accessToken}`,
    );
    const data = await response.json();
    return data.features;
  };

  const clearRoute = () => {
    if (mapRef.current) {
      if (mapRef.current.getLayer("route")) {
        mapRef.current.removeLayer("route");
        mapRef.current.removeSource("route");
      }
    }
  };

  const clearOrigin = () => {
    if (originPointRef.current) originPointRef.current = null;
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
    }
    clearRoute();
    // if (destinationPointRef.current) {
    //   const bounds = new mapboxgl.LngLatBounds();
    //   bounds.extend(destinationPointRef.current!);
    //   if (mapRef.current) mapRef.current.fitBounds(bounds, { zoom: 14 });
    // }

    setOriginSearchValue("");
    setOriginSearch([]);
    if (originRef.current) originRef.current.value = "";
  };

  const clearDestination = () => {
    if (destinationPointRef.current) destinationPointRef.current = null;
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }
    clearRoute();
    // if (originPointRef.current) {
    //   const bounds = new mapboxgl.LngLatBounds();
    //   bounds.extend(originPointRef.current!);
    //   if (mapRef.current) mapRef.current.fitBounds(bounds, { zoom: 14 });
    // }

    setDestinationSearchValue("");
    setDestinationSearch([]);
    if (destinationRef.current) destinationRef.current.value = "";
  };

  const handleSelect = (
    place_name: string,
    coordinates: number[],
    type: "origin" | "destination",
  ) => {
    const location = new mapboxgl.LngLat(coordinates[0], coordinates[1]);
    if (type === "origin") {
      originPointRef.current = location;
      if (originMarkerRef.current) originMarkerRef.current.remove();
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(location)
        .addTo(mapRef.current!);
      originMarkerRef.current = marker;
      setOriginSearchValue(place_name);
    } else {
      destinationPointRef.current = location;
      if (destinationMarkerRef.current) destinationMarkerRef.current.remove();
      const marker = new mapboxgl.Marker({ color: "blue" })
        .setLngLat(location)
        .addTo(mapRef.current!);
      destinationMarkerRef.current = marker;
      setDestinationSearchValue(place_name);
      if (originPointRef.current) calculateRoute(location);
    }
  };

  const handleInputChange = async (
    ref: React.RefObject<HTMLInputElement>,
    type: "origin" | "destination",
  ) => {
    const value = ref.current!.value;
    if (value.length > 2) {
      const suggestions = await fetchSuggestions(value);
      if (type === "origin") {
        setOriginSearch(suggestions);
      } else {
        setDestinationSearch(suggestions);
      }
    }
    if (value === "") {
      if (type === "origin") {
        if (originPointRef.current) originPointRef.current = null;
        if (originMarkerRef.current) originMarkerRef.current.remove();
      } else {
        if (destinationPointRef.current) destinationPointRef.current = null;
        if (destinationMarkerRef.current) destinationMarkerRef.current.remove();
      }
    }
  };

  const goToCurrentLocation = () => {
    if (lastKnownPositionRef.current) {
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: lastKnownPositionRef.current,
          zoom: 14,
        });
      }
    } else {
      setLocationError("Current location is not available.");
    }
  };

  const calculateEmission = async () => {
    if (speed === 0) {
      setLocationError("An Error Occured");
      return;
    }
    const isOriginInHamilton = await checkIfPointIsInHamilton(
      originPointRef.current!,
    );
    const isDestinationInHamilton = await checkIfPointIsInHamilton(
      destinationPointRef.current!,
    );

    if (!isOriginInHamilton || !isDestinationInHamilton) {
      setLocationError("Origin or destination is out of Hamilton bounds.");
      return;
    }
    setIsApiLoading(true);
    const point1 = `${originPointRef.current?.lat}, ${originPointRef.current?.lng}`;
    const point2 = `${destinationPointRef.current?.lat}, ${destinationPointRef.current?.lng}`;

    const apiBody = {
      point1: point1,
      point2: point2,
      maxSpeed: speed,
    };
    const response = await fetch("/api/emission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiBody),
    });

    if (response.ok) {
      const data = await response.json();
      setIsApiLoading(false);
      setEmission(data);
      setShowApiModal(true);
    } else {
      setIsApiLoading(false);
      console.log(response.status.toString(), response.statusText);
      return toast.error(response.status, {
        description: response.statusText,
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="size-full rounded-lg" />;
  }

  return (
    <div className="relative flex flex-1 flex-col items-center">
      <div
        ref={mapContainerRef}
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      >
        <Button
          variant="secondary"
          rounded="full"
          onClick={() => goToCurrentLocation()}
          className="absolute bottom-2 right-2 z-10 h-8 w-8 p-1.5"
        >
          <Icons.mappin />
        </Button>
      </div>
      <div className="sticky z-10 m-4 w-full rounded-lg bg-background p-4 shadow-md">
        {locationError && <p className="text-red-500">{locationError}</p>}
        <div className="flex flex-col justify-between md:flex-col">
          <div id="origin" className="grow">
            <SearchLocation
              ref={originRef}
              onChange={() => handleInputChange(originRef, "origin")}
              onClear={() => clearOrigin()}
              value={originSearchValue}
              results={originSearch}
              type={"origin"}
              onSelect={(address, coordinates) =>
                handleSelect(address, coordinates, "origin")
              }
            />
          </div>
          <div id="destination" className="my-2 grow">
            <SearchLocation
              ref={destinationRef}
              onChange={() => handleInputChange(destinationRef, "destination")}
              onClear={() => clearDestination()}
              value={destinationSearchValue}
              results={destinationSearch}
              type={"Destination"}
              onSelect={(address, coordinates) =>
                handleSelect(address, coordinates, "destination")
              }
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <Button
            variant="default"
            className="w-full"
            onClick={() => calculateRoute(destinationPointRef.current!)}
          >
            Find Route
          </Button>
          <Button
            variant="destructive"
            className="mt-4 w-full"
            disabled={
              destinationPointRef.current === null ||
              originPointRef.current === null ||
              isApiLoading
            }
            onClick={() => calculateEmission()}
          >
            Calculate Emission
          </Button>
        </div>
        {routeData && (
          <div className="mt-4 flex justify-between space-x-4">
            <span>Distance: {routeData.distance}</span>
            <span>Duration: {routeData.duration}</span>
          </div>
        )}
      </div>
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          onClose={() => setShowModal(false)}
        >
          <div className="p-4">
            <h2>Map Loaded</h2>
            <p className="py-4">
              Your current location has been set as the origin.
            </p>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </Modal>
      )}
      {isApiLoading && <LoadingIndicator />}
      {showApiModal && (
        <Modal onClose={() => setShowApiModal(false)}>
          <div className="p-4">
            <ul className="">
              {Object.entries(emission).map(([key, details]) => (
                <li key={key} className="py-2">
                  <strong>{details.name} :</strong> {details.value}{" "}
                  {details.unit}
                </li>
              ))}
            </ul>

            <Button className="mt-4" onClick={() => setShowApiModal(false)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MapComponent;
