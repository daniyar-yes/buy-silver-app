import { axisBottom, axisLeft, extent, line, scaleLinear, scaleTime, select, zoom } from 'd3';
import { useEffect, useRef, useContext } from 'react';
import { PriceContext } from '../PriceContext';

const SilverPriceChart = ({isLoading}) => {
  const priceContextObject = useContext(PriceContext);
  const silverData = priceContextObject?.silverData;    
  
  // const closingPrice = silverData?.dataPoints.at(-1)?.price;

    // const dataPoints = (Array.isArray(silverData.dataPoints) ? silverData.dataPoints : [])
  //   .map((point) => ({
  //     date: new Date(point.date),
  //     price: Number(point.price)
  //   }))
  //   .filter((point) => !Number.isNaN(point.date.getTime()) && Number.isFinite(point.price))
  //   .sort((firstPoint, secondPoint) => firstPoint.date - secondPoint.date);

  const dataPoints = priceContextObject?.processedDataPoints;

  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const lineRef = useRef(null);
  const pointsRef = useRef(null);
  const zoomLayerRef = useRef(null);

  const width = 720;
  const height = 400;
  const margin = { top: 20, right: 24, bottom: 56, left: 64 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const dateExtent = extent(dataPoints, (point) => point.date);
  const priceExtent = extent(dataPoints, (point) => point.price);
  const dateRange = dateExtent[0] && dateExtent[1] ? dateExtent[1] - dateExtent[0] : 0;
  const priceRange = priceExtent[0] !== undefined && priceExtent[1] !== undefined
    ? priceExtent[1] - priceExtent[0]
    : 0;
  const datePadding = dateRange || 24 * 60 * 60 * 1000;
  const pricePadding = priceRange || Math.max(Math.abs(priceExtent[0] || 0) * 0.1, 1);

  const xScale = scaleTime()
    .domain(dataPoints.length ? [
      new Date(dateExtent[0].getTime() - datePadding * 0.05),
      new Date(dateExtent[1].getTime() + datePadding * 0.05)
      // hard-coded, magic value numbers here - really bad anti-pattern, don't do this in production
    ] : [new Date('2026-09-01T00:00:00Z'), new Date('2026-09-30T00:00:00Z')])
    .range([0, chartWidth]);
  const yScale = scaleLinear()
  // hard-coded, magic value numbers here - really bad anti-pattern, don't do this in production
    .domain(dataPoints.length ? [priceExtent[0] - pricePadding * 0.1, priceExtent[1] + pricePadding * 0.1] : [35, 70])
    .nice()
    .range([chartHeight, 0]);
  const createLine = line()
    .x((point) => xScale(point.date))
    .y((point) => yScale(point.price));

  useEffect(() => {
    const xAxis = select(xAxisRef.current);
    const yAxis = select(yAxisRef.current);
    const zoomLayer = zoomLayerRef.current;

    yAxis.call(axisLeft(yScale).ticks(6));

    if (isLoading) {
      return;
    }

    const linePath = select(lineRef.current);
    const points = select(pointsRef.current).selectAll('circle').data(dataPoints);
    const updateChart = (currentXScale) => {
      xAxis.call(axisBottom(currentXScale).ticks(6));
      linePath.attr('d', line().x((point) => currentXScale(point.date)).y((point) => yScale(point.price))(dataPoints));
      points.attr('cx', (point) => currentXScale(point.date));
    };

    updateChart(xScale);

    const zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [chartWidth, chartHeight]])
      .extent([[0, 0], [chartWidth, chartHeight]])
      .on('zoom', (event) => updateChart(event.transform.rescaleX(xScale)));

    select(zoomLayer).call(zoomBehavior);

    return () => {
      select(zoomLayer).on('.zoom', null);
    };
  }, [dataPoints, chartHeight, chartWidth, isLoading, xScale, yScale]);

  return (
    <div>
      <h5>Silver Price Chart: {silverData.month}</h5>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${silverData.month || 'Silver'} price chart`}>
        <title>{silverData.month || 'Silver'} price chart</title>
        <desc>Daily silver price action with date and price axes. Drag to pan and scroll to zoom.</desc>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g ref={yAxisRef} />
          <g ref={xAxisRef} transform={`translate(0, ${chartHeight})`} />
          {isLoading ? (
            <text
              x={chartWidth / 2}
              y={chartHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Loading...
            </text>
          ) : (
            <>
              <g opacity="0.15" ref={pointsRef}>
                {dataPoints.map((point) => (
                  <circle key={point.date.toISOString()} cx={xScale(point.date)} cy={yScale(point.price)} r="4" fill="currentColor" />
                ))}
              </g>
              <path ref={lineRef} d={createLine(dataPoints)} fill="none" stroke="currentColor" strokeWidth="2" />
              <rect ref={zoomLayerRef} width={chartWidth} height={chartHeight} fill="transparent" />
            </>
          )}
        </g>
      </svg>
     
    </div>
  )
}

export default SilverPriceChart