
import React from 'react';
import { Text } from 'react-native';

type TimeAgoProps = {
  dateString: string;
};

const formatTimeAgo = (dateString: string) => {
  const postDate = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - postDate.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const TimeAgo: React.FC<TimeAgoProps> = ({ dateString }) => {
  const timeAgo = formatTimeAgo(dateString);
  return <Text>{timeAgo}</Text>;
};

export default TimeAgo;
