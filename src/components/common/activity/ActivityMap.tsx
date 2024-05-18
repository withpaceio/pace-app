import React, { forwardRef, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import MapLibreGL from '@maplibre/maplibre-react-native';
import styled from 'styled-components/native';

import { getBounds, getLineCoordinatesFromSegments } from '@activity';
import { useTheme } from '@theme';

import type { ActivityLocation } from '@models/Activity';

const StartMarker = styled.View`
  width: ${({ theme }) => theme.sizes.outerPadding}px;
  height: ${({ theme }) => theme.sizes.outerPadding}px;

  border-radius: 10px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.white};

  background-color: ${({ theme }) => theme.colors.green};
`;

const EndMarker = styled(StartMarker)`
  background-color: ${({ theme }) => theme.colors.red};
`;

type Props = {
  tileUrl: string;
  locations: ActivityLocation[] | null | undefined;
  style?: StyleProp<ViewStyle>;
  attributionPosition?:
    | {
        top?: number;
        left?: number;
      }
    | {
        top?: number;
        right?: number;
      }
    | {
        bottom?: number;
        left?: number;
      }
    | {
        bottom?: number;
        right?: number;
      };
  onDidFinishRenderingFrameFully?: () => void;
};

const ActivityMap = forwardRef<MapLibreGL.MapView, Props>(
  ({ tileUrl, locations, style, attributionPosition, onDidFinishRenderingFrameFully }, ref) => {
    const theme = useTheme();

    const bounds = useMemo(() => {
      if (!locations) {
        return [];
      }

      return getBounds(locations);
    }, [locations]);

    const { segmentsCoordinates, inBetweenSegmentsCoordinates } = useMemo(() => {
      if (!locations) {
        return { segmentsCoordinates: [], inBetweenSegmentsCoordinates: [] };
      }

      return getLineCoordinatesFromSegments(locations);
    }, [locations]);

    return (
      <MapLibreGL.MapView
        ref={ref}
        style={style}
        styleURL={tileUrl}
        logoEnabled={false}
        attributionPosition={attributionPosition || { bottom: 8, right: 8 }}
        attributionEnabled
        onDidFinishRenderingFrameFully={onDidFinishRenderingFrameFully}>
        <MapLibreGL.Camera
          bounds={{
            ne: bounds[0],
            sw: bounds[1],
            paddingLeft: theme.sizes.activityMapSnapshot.padding,
            paddingRight: theme.sizes.activityMapSnapshot.padding,
            paddingTop: theme.sizes.activityMapSnapshot.padding,
            paddingBottom: theme.sizes.activityMapSnapshot.padding,
          }}
          animationDuration={0}
        />
        <MapLibreGL.ShapeSource
          id="activityCoordinates"
          shape={{
            type: 'FeatureCollection',
            features: segmentsCoordinates.map((segmentCoordinates) => ({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: segmentCoordinates,
              },
            })),
          }}>
          {segmentsCoordinates.map((_, index) => (
            <MapLibreGL.LineLayer
              key={`line-layer-${index}`}
              id="locations"
              style={{
                lineColor: theme.colors.purple,
                lineWidth: 5,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          ))}
        </MapLibreGL.ShapeSource>
        <MapLibreGL.ShapeSource
          id="inBetweenSegments"
          shape={{
            type: 'FeatureCollection',
            features: inBetweenSegmentsCoordinates.map((inBetweenCoordinates) => ({
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: inBetweenCoordinates },
            })),
          }}>
          {inBetweenSegmentsCoordinates.map((_, index) => (
            <MapLibreGL.LineLayer
              key={`in-between-line-layer-${index}`}
              id="inBetween"
              style={{
                lineDasharray: [2, 2],
                lineColor: theme.colors.purple,
                lineWidth: 5,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          ))}
        </MapLibreGL.ShapeSource>
        <MapLibreGL.MarkerView coordinate={segmentsCoordinates[0][0]}>
          <StartMarker />
        </MapLibreGL.MarkerView>
        <MapLibreGL.MarkerView
          coordinate={
            segmentsCoordinates[segmentsCoordinates.length - 1][
              segmentsCoordinates[segmentsCoordinates.length - 1].length - 1
            ]
          }>
          <EndMarker />
        </MapLibreGL.MarkerView>
      </MapLibreGL.MapView>
    );
  },
);

ActivityMap.displayName = 'ActivityMap';

export default ActivityMap;
