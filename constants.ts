import React from 'react';
import { GuideType, Platform } from './types';
import { WalkthroughIcon, LevellingIcon, CheatsIcon, UnlocksIcon } from './components/IconComponents';

export interface GuideOption {
  value: GuideType;
  label: string;
  icon: React.ElementType;
}

interface PlatformOption {
    value: Platform;
    label: string;
}

export const GUIDE_OPTIONS: GuideOption[] = [
  { value: GuideType.Walkthrough, label: 'Walkthrough', icon: WalkthroughIcon },
  { value: GuideType.Levelling, label: 'Levelling Guide', icon: LevellingIcon },
  { value: GuideType.Cheats, label: 'Cheat Sheet', icon: CheatsIcon },
  { value: GuideType.Unlocks, label: 'Unlock Guide', icon: UnlocksIcon },
];

export const PLATFORM_OPTIONS: PlatformOption[] = [
    { value: Platform.PC, label: 'PC' },
    { value: Platform.PlayStation5, label: 'PlayStation 5' },
    { value: Platform.PlayStation4, label: 'PlayStation 4' },
    { value: Platform.XboxSeriesX, label: 'Xbox Series X/S' },
    { value: Platform.XboxOne, label: 'Xbox One' },
    { value: Platform.NintendoSwitch, label: 'Nintendo Switch' },
    { value: Platform.Mobile, label: 'Mobile (iOS/Android)' },
    { value: Platform.Multiplatform, label: 'Multi-platform' },
];