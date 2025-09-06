/* eslint-disable */
import { MapContainer, TileLayer, GeoJSON, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useState, useRef } from "react";
import { LuBadgeInfo } from "react-icons/lu";

interface IMap {
  mapSelection: string[];
  setMapSelection: (value: string[]) => void;
}

const defaultStyle = {
  color: "#b4b4b4",
  weight: 2,
  opacity: 1,
  fillColor: "#7b7b7b",
  fillOpacity: 0.2,
};

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const position: [number, number] = [37.493, 57.32];

type FitBoundsProps = { geoData: any };
const FitBounds: React.FC<FitBoundsProps> = ({ geoData }) => {
  const map = useMap();
  useEffect(() => {
    if (geoData) {
      const geojsonLayer = L.geoJSON(geoData);
      const bounds = geojsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [geoData, map]);
  return null;
};

const MapComponent = ({ mapSelection, setMapSelection }: IMap) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [clickedFeature, setClickedFeature] = useState<any>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fetch("/assets/mahalle_21kh_M_FeaturesToJSO.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    const name =
      feature.properties.Name ||
      feature.properties.name ||
      feature.properties.NAM ||
      "Unnamed Feature";

    layer.bindPopup(`
      <div style="font-family: 'Modam', sans-serif; font-weight: 500;">
        ${name}
      </div>
    `);

    layer.on({
      click: (e: any) => {
        setClickedFeature({
          latlng: e.latlng,
          properties: feature.properties,
        });
        setMapSelection([name]); // Set only the clicked feature's name

        // Update styles immediately
        geoJsonLayerRef.current?.eachLayer((l: any) => {
          const fname =
            l.feature?.properties?.Name ||
            l.feature?.properties?.name ||
            l.feature?.properties?.NAM;
          const isSelected = fname === name; // Only the clicked feature is selected
          l.setStyle(
            isSelected
              ? {
                  ...defaultStyle,
                  color: "#ff0000",
                  weight: 3,
                  fillOpacity: 0.5,
                }
              : defaultStyle
          );
        });
      },
    });
  };

  const getFeatureStyle = (feature: any) => {
    const name =
      feature.properties.Name ||
      feature.properties.name ||
      feature.properties.NAM ||
      "Unnamed Feature";
    const isSelected = mapSelection.includes(name);

    return isSelected
      ? {
          ...defaultStyle,
          color: "#ff0000",
          weight: 4,
          fillOpacity: 0.4,
        }
      : {
          ...defaultStyle,
          color: "#b4b4b4",
          weight: 1,
        };
  };

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        if (layer.feature) {
          layer.setStyle(getFeatureStyle(layer.feature));
        }
      });
    }
  }, [mapSelection]);

  return (
    <div className="relative">
      <span className="absolute flex flex-row gap-2 items-center backdrop-blur-2xl top-0 right-0 z-10 py-1 px-2 shadow text-gray-500 mr-2 mt-2 bg-white/50 rounded-full">
        <LuBadgeInfo /> انتخاب موقعیت ملک
      </span>
      <MapContainer
        center={position}
        zoom={25}
        minZoom={11}
        style={{ width: "100%", borderRadius: "5px", zIndex: "0" }}
        className="shadow-lg md:h-[400px] h-[200px] rounded-xl shadow-black/20 border border-white/20"
        touchZoom={false}
        keyboard={false}
        boxZoom={false}
        zoomControl={false}
        ref={mapRef}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {geoData && (
          <GeoJSON
            data={geoData}
            onEachFeature={onEachFeature}
            style={(feature) => getFeatureStyle(feature)}
            ref={(ref) => {
              if (ref) geoJsonLayerRef.current = ref;
            }}
          />
        )}
        {geoData && <FitBounds geoData={geoData} />}
        {clickedFeature && (
          <Popup
            position={clickedFeature.latlng}
            eventHandlers={{
              remove: () => setClickedFeature(null),
            }}>
            <div>
              {clickedFeature.properties.Name ||
                clickedFeature.properties.name ||
                clickedFeature.properties.NAM ||
                "نام نامشخص"}
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
