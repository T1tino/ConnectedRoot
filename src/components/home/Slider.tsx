import React, { useRef, useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Plants make people happy!',
    label: ' Plant tips',
    image: require('../../assets/slide1.png'),
  },
  {
    id: '2',
    title: 'Take care of nature!',
    label: ' Plant guide',
    image: require('../../assets/slide2.png'),
  },
  {
    id: '3',
    title: 'Decorate with plants!',
    label: ' Home decor',
    image: require('../../assets/slide3.png'),
  },
];

const Slider = () => {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View className="mt-2">
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={{ width: width * 0.92, marginHorizontal: width * 0.04 }}>
            <LinearGradient
              colors={['#CCF1BE', '#ffffff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.45, y: 0 }}
              className="rounded-2xl flex-row items-center justify-between px-4 py-3 h-32"
            >
              <View className="flex-1 mr-4">
                <View className="bg-white px-2 py-1 rounded-full self-start mb-2">
                  <Text className="text-xs text-gray-700">
                    {item.label}
                  </Text>
                </View>
                <Text className="text-lg font-semibold text-gray-800 leading-tight">
                  {item.title}
                </Text>
              </View>
              <Image 
                source={item.image} 
                resizeMode="contain" 
                className="w-24 h-24" 
              />
            </LinearGradient>
          </View>
        )}
      />
      
      {/* Indicadores de página */}
      <View className="flex-row justify-center mt-4 space-x-1">
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            className="mx-1"
          >
            <View
              className={`rounded-full ${
                activeIndex === index 
                  ? 'w-8 h-2 bg-green-500' 
                  : 'w-2 h-2 bg-green-200'
              }`}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Slider;