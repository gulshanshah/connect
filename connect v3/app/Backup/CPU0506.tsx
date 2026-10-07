import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [metrics] = useState({
    users: { total: 2543, active: 1342 },
    server: { cpu: 75, memory: 62 },
    moderation: { reports: 23, pending: 9 }
  });

  const renderMetricCard = (icon, title, value, trend) => {
    const trendColor = trend > 0 ? '#4CAF50' : '#F44336';
    const TrendIcon = trend > 0 ? Feather : MaterialIcons;
    const trendIconName = trend > 0 ? 'arrow-up' : 'arrow-down';

    return (
      <View style={[styles.metricCard, darkMode && styles.darkCard]}>
        <View style={styles.metricHeader}>
          <MaterialIcons 
            name={icon} 
            size={28} 
            color={darkMode ? '#fff' : '#666'} 
          />
          <View style={styles.trendContainer}>
            <TrendIcon 
              name={trendIconName} 
              size={14} 
              color={trendColor} 
            />
            <Text style={[styles.trendText, { color: trendColor }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        </View>
        <Text style={[styles.metricValue, darkMode && styles.darkText]}>
          {value}
        </Text>
        <Text style={[styles.metricTitle, darkMode && styles.darkSubText]}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>
      {}
      <View style={styles.header}>
        <Text style={[styles.title, darkMode && styles.darkText]}>
          Admin Dashboard
        </Text>
        <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
          <MaterialIcons 
            name={darkMode ? 'lightbulb' : 'dark-mode'} 
            size={28} 
            color={darkMode ? '#FFD700' : '#666'} 
          />
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.metricsGrid}>
        {renderMetricCard('people-alt', 'Total Users', metrics.users.total, 12)}
        {renderMetricCard('activity', 'Active Users', metrics.users.active, -4)}
        {renderMetricCard('server', 'CPU Usage', `${metrics.server.cpu}%`, 8)}
        {renderMetricCard('memory', 'Memory', `${metrics.server.memory}%`, -2)}
      </View>

      {}
      <View style={[styles.section, darkMode && styles.darkCard]}>
        <View style={styles.sectionHeader}>
          <Ionicons 
            name="server" 
            size={24} 
            color={darkMode ? '#FFD700' : '#666'} 
          />
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Server Health
          </Text>
        </View>
        <View style={styles.healthIndicators}>
          <HealthIndicator 
            icon="speedometer"
            label="Response Time"
            value="48ms"
            status="good"
            darkMode={darkMode}
          />
          <HealthIndicator 
            icon="database"
            label="Uptime"
            value="99.98%"
            status="excellent"
            darkMode={darkMode}
          />
        </View>
      </View>

      {}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons 
            name="security" 
            size={24} 
            color={darkMode ? '#FFD700' : '#666'} 
          />
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Moderation
          </Text>
        </View>
        <View style={styles.toolsGrid}>
          <ToolButton 
            icon="delete-forever" 
            label="Delete Post"
            count={metrics.moderation.reports}
            darkMode={darkMode}
          />
          <ToolButton 
            icon="block" 
            label="Ban User"
            count={metrics.moderation.pending}
            darkMode={darkMode}
          />
          <ToolButton 
            icon="device-unknown" 
            label="Ban Device"
            darkMode={darkMode}
          />
        </View>
      </View>

      {}
      <View style={[styles.section, darkMode && styles.darkCard]}>
        <View style={styles.sectionHeader}>
          <FontAwesome 
            name="bullhorn" 
            size={20} 
            color={darkMode ? '#FFD700' : '#666'} 
          />
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Pending Ads (12)
          </Text>
        </View>
        <AdRequestItem 
          title="Summer Collection"
          company="Fashion Co"
          budget="$5,000"
          darkMode={darkMode}
        />
        <AdRequestItem 
          title="Tech Launch"
          company="Gadget Corp"
          budget="$12,000"
          darkMode={darkMode}
        />
      </View>
    </ScrollView>
  );
};

const HealthIndicator = ({ icon, label, value, status, darkMode }) => {
  const statusColors = {
    good: '#4CAF50',
    excellent: '#2196F3',
    warning: '#FF9800',
    critical: '#F44336'
  };

  return (
    <View style={styles.healthIndicator}>
      <MaterialIcons 
        name={icon} 
        size={28} 
        color={statusColors[status]} 
      />
      <Text style={[styles.healthLabel, darkMode && styles.darkSubText]}>
        {label}
      </Text>
      <Text style={[styles.healthValue, darkMode && styles.darkText]}>
        {value}
      </Text>
    </View>
  );
};

const ToolButton = ({ icon, label, count, darkMode }) => (
  <TouchableOpacity style={[styles.toolButton, darkMode && styles.darkCard]}>
    <View style={styles.toolHeader}>
      <MaterialIcons 
        name={icon} 
        size={24} 
        color={darkMode ? '#fff' : '#666'} 
      />
      {count && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
    <Text style={[styles.toolLabel, darkMode && styles.darkText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const AdRequestItem = ({ title, company, budget, darkMode }) => (
  <View style={[styles.adCard, darkMode && styles.darkCard]}>
    <TouchableOpacity>
    <View style={styles.adHeader}>
      <MaterialIcons 
        name="campaign" 
        size={24} 
        color={darkMode ? '#FFD700' : '#666'} 
      />
      <View style={styles.adInfo}>
        <Text style={[styles.adTitle, darkMode && styles.darkText]}>
          {title}
        </Text>
        <Text style={[styles.adCompany, darkMode && styles.darkSubText]}>
          {company}
        </Text>
      </View>
    </View>
    <View style={styles.adActions}>
      <Text style={[styles.adBudget, darkMode && styles.darkText]}>
        {budget}
      </Text>
      {}
    </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F2F6',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubText: {
    color: '#BDBDBD',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  healthIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthIndicator: {
    alignItems: 'center',
    width: '48%',
  },
  healthLabel: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  healthValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolButton: {
    width: '31%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  toolHeader: {
    position: 'relative',
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
  },
  toolLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  adCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  adHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adInfo: {
    marginLeft: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  adCompany: {
    fontSize: 14,
    color: '#666',
  },
  adActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adBudget: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  rejectButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
});

export default AdminDashboard;