export enum GuideType {
  Walkthrough = 'walkthrough',
  Levelling = 'levelling guide',
  Cheats = 'cheat sheet',
  Unlocks = 'unlock guide',
}

export enum Platform {
  PC = 'PC',
  PlayStation5 = 'PlayStation 5',
  PlayStation4 = 'PlayStation 4',
  XboxSeriesX = 'Xbox Series X/S',
  XboxOne = 'Xbox One',
  NintendoSwitch = 'Nintendo Switch',
  Mobile = 'Mobile (iOS/Android)',
  Multiplatform = 'Multi-platform',
}

export interface Reference {
  uri: string;
  title: string;
}
