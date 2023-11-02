// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    dark: boolean;

    colors: {
      primary: string;
      secondary: string;

      white: string;
      black: string;
      orange: string;
      yellow: string;

      red: string;
      darkRed: string;
      lightRed: string;

      purple: string;
      blackPurple: string;
      darkPurple: string;
      lightPurple: string;

      green: string;
      lightGreen: string;

      background: string;
      transparentBackground: string;
      componentBackground: string;
      darkComponentBackground: string;
      errorBackground: string;

      backdropColor: string;

      borderColor: string;

      separatorColor: string;

      navigation: {
        backgroundColor: string;
      };

      buttons: {
        primary: {
          enabled: {
            background: string;
            color: string;
          };
          disabled: {
            background: string;
            color: string;
          };
        };
        secondary: {
          enabled: {
            background: string;
            border: string;
            color: string;
          };
          disabled: {
            background: string;
            border: string;
            color: string;
          };
        };
      };

      textInput: {
        placeholderTextColor: string;
        focused: {
          background: string;
          border: string;
        };
        unfocused: {
          background: string;
          border: string;
        };
      };

      home: {
        activityTile: {
          mapPreviewBackgroundColor: string;
        };
      };

      activityDetails: {
        paceChart: {
          axisColor: string;
          elevation: {
            fill: string;
            highlightedFill: string;
            stroke: string;
            tickLabelColor: string;
          };
          pace: {
            stroke: string;
            highlightedFill: string;
          };
          cursor: {
            borderColor: string;
          };
        };
        splitPaceChart: {
          highlightedFill: string;
          splitFill: string;
        };
      };
    };

    sizes: {
      contentMaxWidth: number;
      mobileMaxWidth: number;
      outerPadding: number;
      innerPadding: number;
      menuBar: number;
      uploadIndicatorIconSize: number;
      button: {
        icon: {
          width: number;
          height: number;
          marginRight: number;
        };
      };
      recording: {
        actionsHeight: number;
        recenterButtonWidth: number;
      };
      activityMapSnapshot: {
        width: number;
        height: number;
        padding: number;
      };
      paceChart: {
        height: number;
        paddingLeft: number;
        paddingRight: number;
        paddingTop: number;
        tickBarHeight: number;
        tickLabelSize: number;
        dataDensity: number;
        cursor: {
          width: number;
          height: number;
          padding: number;
          labelWidth: number;
          fontSize: number;
          lineHeight: number;
        };
      };
      splitChart: {
        splitValueWidth: number;
        barHeight: number;
        barMarginBottom: number;
        barRoundedRadius: number;
      };
      distanceBarChart: {
        height: number;
        barWidth: number;
        activityTypeIconSize: number;
        label: {
          selected: {
            dayFontSize: number;
            numberFontSize: number;
          };
          nonSelected: {
            dayFontSize: number;
            numberFontSize: number;
          };
        };
      };
    };
  }
}
