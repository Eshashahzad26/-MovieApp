// styles/GlobalStyles.js
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#ff6b6b',       // Coral red
  secondary: '#4ecdc4',     // Teal
  background: '#fff5f5',    // Light pastel background
  white: '#ffffff',
  textDark: '#333333',
  textLight: '#777777',
};

export const FONT = {
  regular: 16,
  small: 14,
  large: 22,
  xlarge: 26,
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT.xlarge,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.white,
    fontSize: FONT.small,
    opacity: 0.9,
    marginTop: 5,
  },
  movieCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  movieTitle: {
    fontSize: FONT.large,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  movieYear: {
    fontSize: FONT.small,
    color: COLORS.textLight,
    marginTop: 6,
  },
});
