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
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;


  
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
    images: ['https://picsum.photos/400/300?3', 'https://picsum.photos/400/300?5', 'https://picsum.photos/400/300?6'],
    category: 'Sports',
    description: 'Gears 21-speed, good condition.',
  },
  {
    id: '3',
    title: 'Guitar Fender',
    price: 200,
    location: 'Bangalore',
    images: ['https://picsum.photos/400/300?4', 'https://picsum.photos/400/300?7', 'https://picsum.photos/400/300?8'],
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
      <LinearGradient colors={['#f8f9ff', '#ffffff']} style={styles.tabContainer}>
        {['Buy', 'Sell'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </LinearGradient>

      <ScrollView style={styles.content}>
        {activeTab === 'Buy' && (
          <>
            {}
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryCard,
                    selectedCategories.includes(cat) && styles.selectedCategory
                  ]}
                  onPress={() => toggleCategory(cat)}
                >
                  <LinearGradient
                    colors={selectedCategories.includes(cat) ? ['#6366f1', '#8b5cf6'] : ['#fff', '#fff']}
                    style={styles.categoryGradient}
                  >
                    <Ionicons
                      name={categoryIcons[cat]}
                      size={24}
                      color={selectedCategories.includes(cat) ? '#fff' : '#6366f1'}
                    />
                    <Text style={[
                      styles.categoryText,
                      selectedCategories.includes(cat) && styles.selectedCategoryText
                    ]}>
                      {cat}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {}
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.priceFilterContainer}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  placeholder="Min"
                  style={styles.priceInput}
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
              </View>
              <View style={styles.separatorLine} />
              <View style={styles.priceInputWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  placeholder="Max"
                  style={styles.priceInput}
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>
            </View>

            {}
            <Text style={styles.sectionTitle}>Featured Listings</Text>
            {filteredItems.map(item => (
              <View key={item.id} style={styles.listingCard}>
                <ScrollView 
                  horizontal 
                  pagingEnabled 
                  showsHorizontalScrollIndicator={false}
                >
                  {item.images.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img }}
                      style={styles.listingImage}
                    />
                  ))}
                </ScrollView>
                <LinearGradient
                  colors={['rgba(0,0,0,0.7)', 'transparent']}
                  style={styles.imageOverlay}
                />
                <View style={styles.listingDetails}>
                  <Text style={styles.listingTitle}>{item.title}</Text>
                  <View style={styles.priceLocationContainer}>
                    <Text style={styles.listingPrice}>₹{item.price}</Text>
                    <View style={styles.locationTag}>
                      <Ionicons name="location-outline" size={14} color="#fff" />
                      <Text style={styles.listingLocation}>{item.location}</Text>
                    </View>
                  </View>
                  <Text style={styles.listingDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'Sell' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create New Listing</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Item Title</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter item name"
                value={form.title}
                onChangeText={text => setForm({ ...form, title: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Price</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="Enter price"
                  keyboardType="numeric"
                  value={form.price}
                  onChangeText={text => setForm({ ...form, price: text })}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.formCategory,
                      form.category === cat && styles.selectedFormCategory
                    ]}
                    onPress={() => setForm({ ...form, category: cat })}
                  >
                    <Ionicons
                      name={categoryIcons[cat]}
                      size={20}
                      color={form.category === cat ? '#fff' : '#6366f1'}
                    />
                    <Text style={[
                      styles.formCategoryText,
                      form.category === cat && styles.selectedFormCategoryText
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Describe your item..."
                multiline
                numberOfLines={4}
                value={form.description}
                onChangeText={text => setForm({ ...form, description: text })}
              />
            </View>

            <TouchableOpacity style={styles.submitButton}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>Publish Listing</Text>
                <Ionicons name="arrow-up-circle" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9ff' },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  categoryCard: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginRight: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedCategory: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  priceFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 5,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  separatorLine: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 15,
  },
  listingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  listingImage: {
    width: CARD_WIDTH,
    height: 240,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  listingDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  listingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  priceLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34d399',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  listingLocation: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
  },
  listingDescription: {
    fontSize: 14,
    color: '#e5e7eb',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  formInput: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryScroll: {
    paddingVertical: 8,
  },
  formCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedFormCategory: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  formCategoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6b7280',
  },
  selectedFormCategoryText: {
    color: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default BuySellScreen;