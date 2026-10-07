import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const categories = [
  'General', 'Electronics', 'Fashion', 'Books',
  'Sports', 'Home', 'Toys', 'Music'
];

const categoryIcons = {
  General: 'apps-outline',
  Electronics: 'tv-outline',
  Fashion: 'shirt-outline',
  Books: 'book-outline',
  Sports: 'football-outline',
  Home: 'home-outline',
  Toys: 'game-controller-outline',
  Music: 'musical-notes-outline',
};

const sampleItems = [
  {
    id: '1',
    title: 'iPhone 13 Pro',
    price: 999,
    location: 'Delhi',
    images: ['https://picsum.photos/400/300?1', 'https://picsum.photos/400/300?2'],
    category: 'Electronics',
    description: '128GB, Graphite, Like New',
  },
  {
    id: '2',
    title: 'Mountain Bicycle',
    price: 450,
    location: 'Mumbai',
    images: ['https://picsum.photos/400/300?3'],
    category: 'Sports',
    description: 'Gears 21-speed, good condition.',
  },
  {
    id: '3',
    title: 'Guitar Fender',
    price: 200,
    location: 'Bangalore',
    images: ['https://picsum.photos/400/300?4'],
    category: 'Music',
    description: 'Acoustic guitar, barely used.',
  },
];

const BuySellScreen = () => {
  const [activeTab, setActiveTab] = useState('Buy');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');

  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    location: '',
    description: '',
  });

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const filteredItems = sampleItems.filter(item => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const locationMatch = !location || item.location.toLowerCase().includes(location.toLowerCase());
    const minMatch = !minPrice || item.price >= parseFloat(minPrice);
    const maxMatch = !maxPrice || item.price <= parseFloat(maxPrice);
    return categoryMatch && locationMatch && minMatch && maxMatch;
  });

  return (
    <View style={styles.container}>
      {}
      <View style={styles.tabs}>
        {['Buy', 'Sell'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'Buy' && (
          <>
            <Text style={styles.sectionTitle}>Filter by Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    selectedCategories.includes(cat) && styles.categoryPillActive
                  ]}
                  onPress={() => toggleCategory(cat)}
                >
                  <Ionicons
                    name={categoryIcons[cat]}
                    size={16}
                    color={selectedCategories.includes(cat) ? '#fff' : '#333'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategories.includes(cat) && styles.categoryTextActive
                  ]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterRow}>
              <TextInput
                placeholder="Location"
                style={styles.input}
                value={location}
                onChangeText={setLocation}
              />
              <TextInput
                placeholder="Min Price"
                keyboardType="numeric"
                style={styles.input}
                value={minPrice}
                onChangeText={setMinPrice}
              />
              <TextInput
                placeholder="Max Price"
                keyboardType="numeric"
                style={styles.input}
                value={maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>

            <Text style={styles.sectionTitle}>Items</Text>
            {filteredItems.map(item => (
              <View key={item.id} style={styles.card}>
                <ScrollView horizontal pagingEnabled>
                  {item.images.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img }}
                      style={styles.image}
                    />
                  ))}
                </ScrollView>
                <View style={styles.cardContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                  <Text style={styles.itemLocation}>{item.location}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'Sell' && (
          <>
            <Text style={styles.sectionTitle}>Post an Item</Text>
            <TextInput
              placeholder="Title"
              style={styles.input}
              value={form.title}
              onChangeText={text => setForm({ ...form, title: text })}
            />
            <TextInput
              placeholder="Price"
              keyboardType="numeric"
              style={styles.input}
              value={form.price}
              onChangeText={text => setForm({ ...form, price: text })}
            />
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    form.category === cat && styles.categoryPillActive
                  ]}
                  onPress={() => setForm({ ...form, category: cat })}
                >
                  <Ionicons
                    name={categoryIcons[cat]}
                    size={16}
                    color={form.category === cat ? '#fff' : '#333'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[
                    styles.categoryText,
                    form.category === cat && styles.categoryTextActive
                  ]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              placeholder="Location"
              style={styles.input}
              value={form.location}
              onChangeText={text => setForm({ ...form, location: text })}
            />
            <TextInput
              placeholder="Description"
              style={[styles.input, { height: 100 }]}
              multiline
              value={form.description}
              onChangeText={text => setForm({ ...form, description: text })}
            />

            <TouchableOpacity style={styles.postButton}>
              <Text style={styles.postButtonText}>Submit Item</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: '#f2f2f2' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 20 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#000' },
  tabText: { fontSize: 16, color: '#666' },
  tabTextActive: { color: '#000', fontWeight: 'bold' },
  content: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  categoryPillActive: { backgroundColor: '#000' },
  categoryText: { fontSize: 14, color: '#333' },
  categoryTextActive: { color: '#fff' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 10 },
  input: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 4,
    minWidth: '30%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: width - 32,
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 10,
  },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 15, color: '#28a745', marginTop: 4 },
  itemLocation: { fontSize: 13, color: '#777', marginTop: 2 },
  itemDesc: { fontSize: 14, color: '#333', marginTop: 4 },
  postButton: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default BuySellScreen;
