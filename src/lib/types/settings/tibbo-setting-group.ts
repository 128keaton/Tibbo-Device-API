import { TibboSetting } from './tibbo-setting';
import { TibboValueMapping } from '../tibbo-shared';

export class TibboSettingGroup {
  readonly id: string;
  readonly displayName: string;
  settings: TibboSetting[] = [];

  constructor(raw: TibboValueMapping) {
    this.id = raw['id'];
    this.displayName = raw['displayName'];
  }
}
