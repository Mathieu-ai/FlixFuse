<template>
  <div class="h-full w-full flex flex-col items-center justify-center relative">
    <h1 class="text-2xl font-bold mb-4">Mapbox Projection Playground</h1>
    <div class="map-overlay top absolute left-0 top-0 z-10">
      <div class="map-overlay-inner">
        <fieldset>
          <label>Select projection</label>
          <select v-model="projectionName">
            <option value="mercator">Mercator</option>
            <option value="globe">Globe</option>
            <option value="albers">Albers</option>
            <option value="equalEarth">Equal Earth</option>
            <option value="equirectangular">Equirectangular</option>
            <option value="lambertConformalConic">Lambert Conformal Conic</option>
            <option value="naturalEarth">Natural Earth</option>
            <option value="winkelTripel">Winkel Tripel</option>
          </select>
        </fieldset>
        <fieldset v-if="isConic">
          <label>Center Longitude: <span>{{ conicCenterLng }}</span></label>
          <input type="range" min="-180" max="180" step="any" v-model.number="conicCenterLng">
        </fieldset>
        <fieldset v-if="isConic">
          <label>Center Latitude: <span>{{ conicCenterLat }}</span></label>
          <input type="range" min="-90" max="90" step="any" v-model.number="conicCenterLat">
        </fieldset>
        <fieldset v-if="isConic">
          <label>Southern Parallel Lat: <span>{{ conicLat1 }}</span></label>
          <input type="range" min="-90" max="90" step="any" v-model.number="conicLat1">
        </fieldset>
        <fieldset v-if="isConic">
          <label>Northern Parallel Lat: <span>{{ conicLat2 }}</span></label>
          <input type="range" min="-90" max="90" step="any" v-model.number="conicLat2">
        </fieldset>
      </div>
    </div>
    <client-only>
      <MapboxMap
        map-id="mapbox-projection-playground"
        :access-token="accessToken"
        :map-style="mapStyle"
        :center="center"
        :zoom="zoom"
        :projection="computedProjection"
        class="w-full h-[500px] rounded shadow"
        @error="onMapError"
        @load="onMapLoad"
      >
        <div v-if="showMapboxWarning" class="text-sm text-yellow-600 bg-yellow-100 p-2 rounded mb-2">
          Some Mapbox features may be disabled due to browser privacy settings (e.g., private browsing) or adblockers. For full functionality, try disabling these features.
        </div>
        <MapboxSource 
          source-id="geojson-source"
          :source="{
            type: 'geojson',
            data: '/test.geojson'
          }"
        />
        <MapboxLayer
          :layer="{
            source: 'geojson-source',
            id: 'geojson-layer',
            type: 'fill'
          }"
        />
        <MapboxGeolocateControl position="top-left" />
      </MapboxMap>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// You may want to use runtime config or env for the token
const accessToken = ref('YOUR_MAPBOX_ACCESS_TOKEN')
const mapStyle = ref('mapbox://styles/mapbox/standard-satellite')
const center = ref([0, 1])
const zoom = ref(0)

const showMapboxWarning = ref(false)
function onMapError(e: unknown) {
  showMapboxWarning.value = true
}

// Projection controls
const projectionName = ref('lambertConformalConic')
const conicCenterLng = ref(0)
const conicCenterLat = ref(30)
const conicLat1 = ref(30)
const conicLat2 = ref(30)

const isConic = computed(() => [
  'albers',
  'lambertConformalConic'
].includes(projectionName.value))

const computedProjection = computed(() => {
  if (isConic.value) {
    return {
      name: projectionName.value,
      center: [conicCenterLng.value, conicCenterLat.value],
      parallels: [conicLat1.value, conicLat2.value]
    }
  }
  return projectionName.value
})

// --- Map instance and projection switching ---
const mapRef = ref<any>(null)
function onMapLoad(map: any) {
  mapRef.value = map
}

// Watch for projection changes and update the map instance
watch(computedProjection, (proj) => {
  if (mapRef.value && typeof mapRef.value.setProjection === 'function') {
    mapRef.value.setProjection(proj)
  }
})
</script>

<style scoped>

.h-full {
  min-height: 100vh;
}
.map-overlay {
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  position: absolute;
  width: 220px;
  top: 0;
  left: 0;
  padding: 10px;
  z-index: 10;
}
.map-overlay .map-overlay-inner {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
}
.map-overlay-inner fieldset {
  border: none;
  padding: 0;
  margin: 0 0 10px;
}
.map-overlay-inner fieldset:last-child {
  margin: 0;
}
.map-overlay-inner select,
.map-overlay-inner input {
  width: 100%;
}
.map-overlay-inner label {
  display: block;
  font-weight: bold;
  margin: 0 0 5px;
}
</style>
