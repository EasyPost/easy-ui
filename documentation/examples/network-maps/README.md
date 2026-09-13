# Network intelligence mapping draft

Mapping is developed in [PR #5](https://github.com/lanej/easy-ui/pull/5), based on the shared chart branch. [Chart PR #4](https://github.com/lanej/easy-ui/pull/4) retains 24 analytical recipes and six native components.

[Network map scope and acceptance criteria](../../specs/NetworkMaps.md).

The ECharts lane and parcel maps on this branch are reference prototypes to replace. MapLibre, street basemaps, navigation across geographic scales, prioritized labels, facility risk, weather layers and the three audience scenarios are not implemented yet. Passing prototype tests do not establish acceptance of the proposed design.

## Extracted reference captures

![Lane and parcel map prototype](../logistics/logistics-maps-review.png)

![Mobile map prototype](../logistics/logistics-maps-mobile.png)

These captures are from source `b9ef8f589428824103910654b80d3acc83b082c7`. [Original combined-prototype measurements and validation](https://github.com/lanej/easy-ui/blob/043a9332b3af26653e46e842951105866740e162/documentation/examples/logistics/README.md). The old 23.4 kB incremental ECharts map figure is not an estimate for MapLibre or its workers and tiles.

The logistics directory's current JSON reports describe the extracted **24-recipe chart-only build**. Use the immutable combined-prototype link above for the original map baseline, and this PR's Actions artifacts for subsequent mapping-branch builds.
