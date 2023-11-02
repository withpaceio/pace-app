import * as Font from 'expo-font';

export default (): Promise<void> =>
  Font.loadAsync({
    'Roboto-Regular': require('../../assets/fonts/roboto/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../../assets/fonts/roboto/Roboto-Bold.ttf'),
    'Roboto-BlackItalic': require('../../assets/fonts/roboto/Roboto-BlackItalic.ttf'),
  });
