/* eslint-disable */
import { MapContainer, TileLayer, GeoJSON, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useState, useRef } from "react";

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
      .then((data) => setGeoData(data));
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    const name = feature.properties.Name;

    layer.bindPopup(`
      <div style="font-family: 'Modam', sans-serif; font-weight: 500;">
        ${name || "Unnamed Feature"}
      </div>
    `);

    layer.on({
      click: (e: any) => {
        setClickedFeature({
          latlng: e.latlng,
          properties: feature.properties,
        });
        // @ts-ignore
        setMapSelection((prev: string[]) => {
          const currentSelection = Array.isArray(prev) ? [...prev] : [];
          const index = currentSelection.indexOf(name);

          if (index >= 0) {
            currentSelection.splice(index, 1); // remove
          } else {
            currentSelection.push(name); // add
          }

          // Update styles immediately
          geoJsonLayerRef.current?.eachLayer((l: any) => {
            const fname = l.feature?.properties?.name;
            const isSelected = currentSelection.includes(fname);
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

          return currentSelection;
        });
      },
    });
  };

  const getFeatureStyle = (feature: any, selectionOverride?: string[]) => {
    const selection = Array.isArray(selectionOverride ?? mapSelection)
      ? selectionOverride ?? mapSelection
      : [];

    const name =
      feature.properties.name ||
      feature.properties.Name ||
      feature.properties.NAM;

    const isSelected = selection.includes(name);

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
    <MapContainer
      center={position}
      zoom={28}
      minZoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "5px" }}
      className="shadow-lg rounded-xl shadow-black/20 border border-white/20"
      touchZoom={false}
      keyboard={false}
      boxZoom={false}
      zoomControl={false}
      whenReady={() => {
        if (mapRef.current) {
          // Optional: use if you later need the map instance
        }
      }}
      ref={mapRef}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
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
            {clickedFeature.properties.name ||
              clickedFeature.properties.Name ||
              clickedFeature.properties.NAM ||
              "نام نامشخص"}
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default MapComponent;
