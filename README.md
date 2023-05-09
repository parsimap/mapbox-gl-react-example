# Getting Started with Create React App

A React project is created by TypeScript superset and provided an example for implement a map.

## Available Scripts

In the project directory, you can run:

### `npm start`

Run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

_The following code is written in the App.tsx component._

## Import Modules

```typescript
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
```

## SOURCES Variable

A dictionary to better access to source ids.

```javascript
const SOURCES = {
  region6_area: "region6_area",
  region6_important_streets: "region6_important_streets",
  region6_restaurant_points: "region6_restaurant_points"
};
```

## runSourceQueries

This method as a chaining request run queries in sequence, all data is available in the data folder of this project.

```javascript
async function runSourceQueries() {
  return await Promise.all(
    Object.keys(SOURCES).map(async (id) => [
      id,
      await (await fetch(`data/${id}.json`)).json(),
    ])
  );
}
```

## Map Plugins

To illustration the text in the map for rtl languages, it is essential to set rtl plugin,after that the text in the map
in correct order will be presented.There is a function as a callback which notifies when the plugin is fully loaded.

```javascript
mapboxgl.setRTLTextPlugin(
  "https://cdn.parsimap.ir/third-party/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  () => {
  }
);

```

_The following code should be placed inside the component body_.

## Refs

These refs are used for the map instance and container.
Whenever mapRef id defined there be used for working directly
with the map, for instance, `mapRef.current.getZoom()` lets a developer get the current zoom of view.

## useEffect

_The following is used inside `useEffect`._

### The `containerRef` Guard

Check container when it's not available, the process should be break.

```typescript
if (!containerRef.current) {
  return;
}
```

### Main function callable

The main function is called after page fully loaded and ready to use.
All featureCollection files are fetched and ready
to use as source-data for a map, and as a result is shown as a features on the map.

### Fetch data

All featureCollection files are fetched and ready to use as source
data for a map, and as a result is shown as a features on the map.

```typescript
const sourceArrayList = await runSourceQueries();
```

### Map Creation

Firstly, the map should be created from mapboxgl which is available globally after including the related script; here
the script is used from parsimap cdn.To properly show the map; there is a need for an access token which
the [following link](https://account.parsimap.ir/token-registration) could help you reach a Parsiamp company. It must
into account, the container is used here is a ref which is defined in by a `ref`.

### `style.load` Event

Secondly, The `style.load` event of the map is used when there isa need to add following sources or layers.

```typescript
map.on("style.load", () => {
});
```

### Adding Sources

Thirdly, All sources were fetched is ready to use as a source.This data is an arrayList on the other hand, the tuple
which the first member of each array record there are the id and the other are data.

```typescript
 for (const [id, data] of sourceArrayList) {
  map.addSource(id, { type: "geojson", data });
}
```

### Adding Layers

Fourthly, layers can be defined and this definition must be attached to related sources which were fetched before.

#### Area Layer

```typescript
map.addLayer({
  id: "area",
  type: "fill",
  source: SOURCES.region6_area,
  paint: {
    "fill-opacity": 0.5,
    "fill-color": "#00b3be"
  }
});
```

This layer is used to demonstrate an area which is related to a district of Tehran city.
The area is shown as a polygon and filled with color.

#### Area Outline Layer

This layer belonged to area layer
which is used the same source and just illustration a border outside of area
to specify the area with outside of area to be seen better.

```typescript
map.addLayer({
  id: "area-outline",
  type: "line",
  source: SOURCES.region6_area,
  paint: {
    "line-width": 2,
    "line-color": "#00919a"
  }
});
```

#### Street Layer

This layer is illustrated the stroke on the map for three well-known roads of the city.

```typescript
map.addLayer({
  id: "street",
  type: "line",
  source: SOURCES.region6_important_streets,
  paint: {
    "line-width": 4,
    "line-color": "#3e570a"
  }
});
```

#### Restaurant Layer

This layer is a circle layer that is displayed in each restaurant place as a circle on the map.

```typescript
 map.addLayer({
  id: "restaurant",
  type: "circle",
  source: SOURCES.region6_restaurant_points,
  paint: {
    "circle-opacity": 0.5,
    "circle-color": "#ff1515"
  }
});
```