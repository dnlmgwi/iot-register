<script>
	import * as d3 from 'd3';

	export let data;

	const width = 800;
	const height = 600;

	const margin = { top: 20, right: 20, bottom: 20, left: 180 };
	const innerHeight = height - margin.top - margin.bottom;
	const innerWidth = width - margin.left - margin.right;

	$: xDomain = data.map((d) => d.Month);
	$: yDomain = data.map((d) => +d.AttendanceCount);

	$: yScale = d3.scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.1);
	$: xScale = d3
		.scaleLinear()
		.domain([0, Math.max.apply(null, yDomain)])
		.range([0, innerWidth]);
</script>

<svg viewBox="0 0 800 600" style="width: 100%; height: auto;">
	<g transform={`translate(${margin.left},${margin.top})`}>
		{#each xScale.ticks() as tickValue}
			<g transform={`translate(${xScale(tickValue)},0)`}>
				<line y2={innerHeight} stroke="#2563EB" />
				<text style="color: #2563EB;" text-anchor="middle" dy=".71em" y={innerHeight + 3}>
					{tickValue}
				</text>
			</g>
		{/each}
		{#each data as d}
			<text
				style="color: #2563EB;"
				text-anchor="end"
				x="-3"
				dy=".32em"
				y={yScale(d.Month) + yScale.bandwidth() / 2}
			>
				{d.Month}
			</text>
			<rect
				x="0"
				y={yScale(d.Month)}
				width={xScale(d.AttendanceCount)}
				height={yScale.bandwidth()}
				fill="#2563EB"
			/>
		{/each}
	</g>
</svg>
