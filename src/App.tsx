import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

/**
 * A dictionary to better access to source ids.
 */
const SOURCES: { [p: string]: string } = {
  region6_area: "region6_area",
  region6_important_streets: "region6_important_streets",
  region6_restaurant_points: "region6_restaurant_points",
};

/**
 * This method as a chaining request run queries in sequence,
 * all data is available in the data folder of this project.
 */
async function runSourceQueries(): Promise<Awaited<[string, object][]>> {
  return await Promise.all(
    Object.keys(SOURCES).map(async (id) => [
      id,
      await (await fetch(`data/${id}.json`)).json(),
    ])
  );
}

/**
 * To illustration the text in the map for rtl languages, it is essential to
 * set rtl plugin, after that the text in the map in correct order will be presented.
 * There is a function as a callback which notifies when the plugin is fully loaded.
 */
mapboxgl.setRTLTextPlugin(
  "https://cdn.parsimap.ir/third-party/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  () => {}
);

const App = () => {
  const [map, setMap] = useState<mapboxgl.Map>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Check container when it's not available, the process should be break.
     */
    if (!containerRef.current) {
      return;
    }

    async function main() {
      /**
       * All featureCollection files are fetched and ready to use as source
       * data for a map, and as a result is shown as a features on the map.
       */
      const sourceArrayList = await runSourceQueries();

      /**
       * Firstly, the map should be created from mapboxgl which is available
       * globally after including the related script, here the script is used
       * from parsimap cdn.
       *
       * To properly show the map, there is a need for an access token which the
       * following link could help you reach a Parsimap company
       * https://account.parsimap.ir/token-registration
       */
      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style:
          "https://api.parsimap.ir/styles/parsimap-streets-v11?key=p1c68d1fa8752c49809f1359a200cd7e48102a4436",
        center: [51.402, 35.725],
        zoom: 13,
      });
      setMap(map);

      /**
       * Secondly, The `style.load` event of the map is used when there is
       * a need to add following sources or layers.
       */
      map.on("style.load", () => {
        /**
         * Thirdly, All sources were fetched is ready to use as a source.
         * This data is an arrayList on the other hand, the tuple which the
         * first member of each array record there are the id and the other
         * are data.
         */
        for (const [id, data] of sourceArrayList) {
          map.addSource(id, {
            type: "geojson",
            data: data as mapboxgl.GeoJSONSourceRaw["data"],
          });
        }

        /**
         * Fourthly, layers can be defined and this definition must be attached
         * to related sources which were fetched before.
         *
         *
         * Area Layer
         * This layer is used to demonstrate an area which is related to
         * a district of Tehran city. The area is shown as a polygon and filled
         * with color.
         */
        map.addLayer({
          id: "area",
          type: "fill",
          source: SOURCES.region6_area,
          paint: {
            "fill-opacity": 0.25,
            "fill-color": "#014a4f",
          },
        });

        /**
         * Area Outline Layer
         * This layer is belonged to area layer
         * which is used the same source and just illustration a border outside of area
         * to specify the area with outside of area to be seen better.
         */
        map.addLayer({
          id: "area-outline",
          type: "line",
          source: SOURCES.region6_area,
          paint: {
            "line-width": 2,
            "line-color": "#003134",
          },
        });

        /**
         * Street Layer
         * This layer is illustrated the stroke on the map for three well-known
         * roads of the city.
         */
        map.addLayer({
          id: "street",
          type: "line",
          source: SOURCES.region6_important_streets,
          paint: {
            "line-width": 4,
            "line-color": "#3e570a",
          },
        });

        /**
         * Restaurant Layer
         *
         * This layer is a circle layer that is displayed in each restaurant place
         * as a circle on the map.
         */
        map.addLayer({
          id: "restaurant",
          type: "circle",
          source: SOURCES.region6_restaurant_points,
          paint: {
            "circle-radius": 10,
            "circle-opacity": 0.5,
            "circle-color": "#ff1515",
          },
        });
      });
    }

    main().then();
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    function handleClick(event: mapboxgl.MapMouseEvent) {
      console.log(event.lngLat);
    }

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    }
  }, [map]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
      }}
    />
  );
};

export default App;
