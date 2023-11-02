import { DefaultTheme } from 'styled-components/native';

const Theme: DefaultTheme = {
  dark: true,

  colors: {
    primary: '#FFFFFF',
    secondary: '#888888',

    white: '#FFFFFF',
    black: '#000000',
    orange: '#FE7F2D',
    yellow: '#FDCA40',

    red: '#FF478D',
    darkRed: '#FF1F75',
    lightRed: '#FF85B4',

    purple: '#A749FF',
    blackPurple: '#20003D',
    darkPurple: '#4A008F',
    lightPurple: '#CE99FF',

    green: '#45CB85',
    lightGreen: '#8AEA92',

    background: '#111111',
    transparentBackground: 'rgba(0, 0, 0, 0.8)',
    componentBackground: '#222222',
    darkComponentBackground: '#333333',
    errorBackground: '#222222',

    backdropColor: 'rgba(0, 0, 0, 0.6)',

    borderColor: '#FFFFFF',

    separatorColor: '#333333',

    navigation: {
      backgroundColor: '#111111',
    },

    buttons: {
      primary: {
        enabled: {
          background: '#A749FF',
          color: '#FFFFFF',
        },
        disabled: {
          background: '#CE99FF',
          color: '#FFFFFF',
        },
      },
      secondary: {
        enabled: {
          background: '#111111',
          border: '#A749FF',
          color: '#A749FF',
        },
        disabled: {
          background: '#222222',
          border: '#666',
          color: '#888888',
        },
      },
    },

    textInput: {
      placeholderTextColor: '#777777',
      focused: {
        background: '#000000',
        border: '#A749FF',
      },
      unfocused: {
        background: '#222222',
        border: '#444444',
      },
    },

    home: {
      activityTile: {
        mapPreviewBackgroundColor: '#333333',
      },
    },

    activityDetails: {
      paceChart: {
        axisColor: '#555555',
        elevation: {
          fill: '#444444',
          highlightedFill: 'rgba(45, 45, 45, 0.9)',
          stroke: '#888888',
          tickLabelColor: '#AAAAAA',
        },
        pace: {
          stroke: '#999999',
          highlightedFill: '#A749FF',
        },
        cursor: {
          borderColor: '#777777',
        },
      },
      splitPaceChart: {
        highlightedFill: 'rgba(30, 30, 30, 0.9)',
        splitFill: '#333333',
      },
    },
  },
  sizes: {
    contentMaxWidth: 800,
    mobileMaxWidth: 1000,
    outerPadding: 20,
    innerPadding: 10,
    menuBar: 50,
    uploadIndicatorIconSize: 25,
    button: {
      icon: {
        width: 18,
        height: 18,
        marginRight: 5,
      },
    },
    recording: {
      actionsHeight: 220,
      recenterButtonWidth: 100,
    },
    activityMapSnapshot: {
      width: 512,
      height: 320,
      padding: 50,
    },
    paceChart: {
      height: 200,
      paddingLeft: 13,
      paddingRight: 13,
      paddingTop: 10,
      tickBarHeight: 5,
      tickLabelSize: 14,
      dataDensity: 0.3,
      cursor: {
        width: 200,
        height: 95,
        padding: 10,
        labelWidth: 35,
        fontSize: 14,
        lineHeight: 20,
      },
    },
    splitChart: {
      splitValueWidth: 50,
      barHeight: 22,
      barMarginBottom: 2,
      barRoundedRadius: 4,
    },
    distanceBarChart: {
      height: 120,
      barWidth: 6,
      activityTypeIconSize: 25,
      label: {
        selected: {
          dayFontSize: 16,
          numberFontSize: 18,
        },
        nonSelected: {
          dayFontSize: 12,
          numberFontSize: 14,
        },
      },
    },
  },
};

export default Theme;
