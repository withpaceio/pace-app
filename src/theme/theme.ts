import { DefaultTheme } from 'styled-components/native';

const Theme: DefaultTheme = {
  dark: false,

  colors: {
    primary: '#1E1014',
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

    background: '#FFFFFF',
    transparentBackground: 'rgba(255, 255, 255, 0.9)',
    componentBackground: 'rgb(247, 247, 247)',
    darkComponentBackground: 'rgb(225, 225, 225)',
    errorBackground: '#EEEEEE',

    backdropColor: 'rgba(0, 0, 0, 0.6)',

    borderColor: '#000000',

    separatorColor: '#DCDCDC',

    navigation: {
      backgroundColor: '#FFFFFF',
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
          background: '#FFFFFF',
          border: '#A749FF',
          color: '#A749FF',
        },
        disabled: {
          background: '#EEEEEE',
          border: '#DCDCDC',
          color: '#888888',
        },
      },
    },

    textInput: {
      placeholderTextColor: '#BBBBBB',
      focused: {
        background: '#FFFFFF',
        border: '#A749FF',
      },
      unfocused: {
        background: '#F7F9F6',
        border: '#E4E9F2',
      },
    },

    home: {
      activityTile: {
        mapPreviewBackgroundColor: '#EEEEEE',
      },
    },

    activityDetails: {
      paceChart: {
        axisColor: '#CCCCCC',
        elevation: {
          fill: '#DDDDDD',
          highlightedFill: 'rgba(230, 230, 230, 0.9)',
          stroke: '#AAAAAA',
          tickLabelColor: '#AAAAAA',
        },
        pace: {
          stroke: '#1E1014',
          highlightedFill: '#A749FF',
        },
        cursor: {
          borderColor: '#DDDDDD',
        },
      },
      splitPaceChart: {
        highlightedFill: 'rgba(245, 245, 245, 0.9)',
        splitFill: '#CCCCCC',
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
