import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface HorizontalScrollListProps {
  data: string[];
}

const HorizontalScrollList: React.FC<HorizontalScrollListProps> = ({ data }) => {
    console.log(data)
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  item: {
    backgroundColor: '#CED3DC',
    padding: 5,
    marginHorizontal: 2,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
  },
});

export default memo(HorizontalScrollList);