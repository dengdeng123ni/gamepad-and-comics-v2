/*
 * Public API Surface of library
 */

export * from './context-menu/context-menu-controller.service';
export * from './context-menu/context-menu-event.service';
export * from './context-menu/context-menu/context-menu.component';

// export * from './gamepad/gamepad-explanation/gamepad-explanation.component';
// export * from './gamepad/gamepad-vioce/gamepad-vioce.component';
// export * from './gamepad/gamepad-controller.service';
// export * from './gamepad/gamepad-event.service';
// export * from './gamepad/gamepad-input.service';
// export * from './gamepad/gamepad-sound.service';

// export * from './cache/cache.service';
export * from './download/download.service';
export * from './i18n/i18n.service';
export * from './data/data.service';
export * from './db/db-controller.service';
export * from './db/db-event.service';

// export * from './temporary-file/temporary-file.service'
export * from './message/message-controller.service'
export * from './message/message-event.service'

export * from './utils/utils.service'


export interface PagesItem { id: string, src: string, width: number, height: number }
export interface ComicsInfo {
  cover: string,
  title: string,
  author?: string,
  intro?: string,
  chapter_id: string
}
export interface ChaptersItem {
  id: string,
  cover: string,
  title: string,
  pub_time?: string | Date | number,
  read?: number,
  selected?: boolean
}
export interface ComicsItem { id: string | number, cover: string, title: string, subTitle: string,selected?: boolean }
