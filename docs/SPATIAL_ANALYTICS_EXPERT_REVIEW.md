# V4 Expert Review — Spatial Analytics, Mapping and Data Visualisation

**Project:** Nautilus Bay Digital Conservation Platform  
**Review focus:** Thematic cartography, spatial ecology, research exports and conservation analytics  
**Disposition:** Recommendations implemented in V4 unless marked as a future research method.

## 1. Senior GIS / Cartography Specialist

### Requested
- The map must answer questions, not merely display points.
- Add thematic modes for species, recency, condition, observation quality and verification state.
- Add a sighting-density surface/grid, clear legends, metric scale and date filtering.
- Allow staff to visualise GPS uncertainty.
- Add an interactive straight-line distance measurement tool.
- Public thematic layers must use only conservation-safe generalised coordinates.

### Implemented
- Public themes: Species, Recency, Density and Observations.
- Staff themes: Species, Condition, Quality, Verification, Recency, Density and Observations.
- Date, animal, species, condition and verification filters.
- Configurable 100 m / 250 m / 500 m / 1 km density cells for staff; 250 m / 500 m / 1 km public density cells.
- GPS accuracy circles on the staff map.
- Metric map scale and two-point distance measurement control.
- Responsive legends and accessible filtered record table.

## 2. Spatial Ecologist / Movement Ecologist

### Requested
- Avoid implying actual routes from sparse sightings.
- Add individual movement summaries based on observed-position displacement only.
- Show time since last sighting and identify animals that may need targeted survey effort.
- Add temporal patterns by month and time of day.

### Implemented
- Public map does not connect sightings.
- Staff Insights includes a clearly labelled **connection-distance index** and maximum displacement from first recorded position.
- Every displacement view carries a warning that straight-line connections are analytical indicators, not routes travelled.
- Last-seen watchlist added.
- Monthly trend, time-of-day distribution and weekly activity fingerprint added.

### Future research method
- Home-range estimation (MCP/KDE/AKDE) is deliberately **not** implemented until observation density, sampling protocol and scientific method are sufficient. It should not be presented from sparse citizen-science sightings as if statistically robust.

## 3. Conservation Data Scientist

### Requested
- Add views that expose sampling bias and data quality, not only biological patterns.
- Show verification and quality distributions.
- Keep aggregate public storytelling separate from restricted research analytics.

### Implemented
- Staff charts: observation trend, species, behaviour, condition, quality bands and time-of-day activity.
- Public Insights uses only aggregate/generalised public records.
- Median GPS accuracy and verified-rate metrics included for staff.
- Accessible data tables are supplied behind every chart.

## 4. GIS Interoperability / Research Data Specialist

### Requested
- Export the exact filtered map selection, rather than forcing a full-dataset export.
- Add OGC KML in addition to GeoJSON and CSV.
- Keep Movebank-style event export.
- Preserve timestamps, animal IDs, conditions and data-quality metadata.

### Implemented
- Filtered Map Lab exports: KML, KML with explicitly labelled inferred observation connections, GeoJSON and CSV.
- Full research exports: registry CSV, observation CSV, GeoJSON, KML and Movebank-style event CSV.
- KML contains TimeStamp and ExtendedData elements.
- KML uses the standard `http://www.opengis.net/kml/2.2` namespace used by OGC KML 2.3.

## 5. Conservation Security Specialist

### Requested
- Do not provide public downloads of exact or historical sensitive coordinate datasets.
- Public density and thematic maps must be generated from already-generalised public locations.
- Exact exports belong only in authenticated staff workflows.

### Implemented
- Public map and public Insights consume `Repo.publicMap()` only.
- Public coordinates remain delayed/generalised by the privacy layer / production RPC.
- KML/GeoJSON/CSV spatial exports are located in authenticated staff tools.

## 6. Information Visualisation Specialist

### Requested
- Prefer simple, interpretable charts over dashboard decoration.
- Show raw counts and retain a tabular alternative for accessibility.
- Add an interesting temporal view beyond ordinary bars/lines.

### Implemented
- Responsive SVG bar and line charts with screen-reader labels.
- Expandable underlying data tables for every chart.
- Weekly **activity fingerprint** matrix: weekday × four time bands.
- Last-seen watchlist and movement summary tables complement charts.

## 7. Accessibility Specialist

### Requested
- Maps cannot be the sole representation of spatial information.
- Charts need text alternatives / underlying tables.
- Controls must remain native and keyboard operable.

### Implemented
- Filtered staff table and public accessible sighting list remain available beside maps.
- Each SVG chart has `role="img"` / accessible title context plus a data table.
- Map filters use native `select`, `input[type=date]` and checkbox controls.

## 8. Project Manager Decision

The V4 design principle is:

> **Every analytical view must answer an operational, ecological, scientific or data-quality question.**

The Map Lab is therefore separated from the public conservation map. Public visualisation prioritises engagement and safety; staff visualisation prioritises exact scientific interpretation and interoperability.
