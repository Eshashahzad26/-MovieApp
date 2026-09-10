import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

const COLORS = {
  primary: '#5B3E96',
  background: '#F3F0FA',
  card: '#FFFFFF',
  textDark: '#1E1E1E',
  textLight: '#7A7A7A',
  accent: '#FFC107',
  white: '#FFF',
};

const fallbackPoster =
  'https://cdn-icons-png.flaticon.com/512/3607/3607444.png';

const MovieScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Guaranteed working posters (all .jpg)
  const posters = [
    'https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81t2CVWEsUL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81GqtNbs+PL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81k9hI3r6pL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71g40mlbinL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81VZ3RDbRkL._AC_SL1500_.jpg',
  ];

  // ✅ Channel data (PNG logos only)
  const channels = [
    {
      name: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png',
    },
    {
      name: 'Disney+',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.png',
    },
    {
      name: 'HBO Max',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/HBO_Max_Logo.png',
    },
    {
      name: 'Prime Video',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.png',
    },
    {
      name: 'Apple TV+',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Apple_TV_Plus_logo.png',
    },
  ];

  const fetchMovies = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await fetch('https://reactnative.dev/movies.json');
      const json = await response.json();

      const moviesWithExtras = json.movies.map((movie, index) => {
        const channel = channels[index % channels.length];
        return {
          ...movie,
          poster: posters[index % posters.length] || fallbackPoster,
          channelName: channel.name,
          channelLogo: channel.logo,
        };
      });

      setMovies(moviesWithExtras);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCardPress = (title) => {
    console.log(`Tapped on ${title}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.primary, fontSize: 16, fontWeight: '500' }}>
          Fetching movies for you...
        </Text>
      </View>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 18, color: COLORS.textDark }}>No movies found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Movie Explorer</Text>
        <Text style={styles.headerSubtitle}>Stream your favorites from top channels</Text>
      </View>

      {/* Movie List */}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchMovies();
            }}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BlinkingCard item={item} fadeAnim={fadeAnim} onPress={handleCardPress} />
        )}
      />
    </SafeAreaView>
  );
};

const BlinkingCard = ({ item, fadeAnim, onPress }) => {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(blinkAnim, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(blinkAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(item.title);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View style={[styles.movieCard, { opacity: blinkAnim }]}>
          <Image
            source={{ uri: item.poster }}
            style={styles.poster}
            defaultSource={{ uri: fallbackPoster }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieYear}>Release Year: {item.releaseYear}</Text>

            {/* Channel Info */}
            <View style={styles.channelRow}>
              <Image source={{ uri: item.channelLogo }} style={styles.channelLogo} />
              <Text style={styles.channelName}>{item.channelName}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.accent,
    fontSize: 14,
    marginTop: 4,
  },
  movieCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  poster: {
    width: 90,
    height: 130,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#EAEAEA',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  movieYear: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 6,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  channelLogo: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 6,
  },
  channelName: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});
