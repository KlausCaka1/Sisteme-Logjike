import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000d1b' },
  displayRow: {
    flex: 2,
    backgroundColor: '#193441',
    justifyContent: 'center'
  },
  rowCenter: {
    flex: 1,
    justifyContent: 'center'
  },
  displayText: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'right',
    padding: 20
  },
  previewDisplayText: {
    fontSize: 30,
    fontWeight: '400',
    opacity: 0.8
  }
});
