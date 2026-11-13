
import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Teams: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  TeamDetails: {
    teamId: string;
  };
};
