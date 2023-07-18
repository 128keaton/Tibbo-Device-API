import { TibboSettingValidation, TibboValueMapping } from '../tibbo-shared';

export class TibboSetting {
  id: string;
  type: string;
  control: string;

  readonly value: any;
  readonly rawValue: number | string;

  private readonly greaterThan?: number;
  private readonly lessThan?: number;
  private readonly invalidMessage?: string;
  private readonly valueMapping?: TibboValueMapping;

  constructor(
    value: number | string,
    raw: {
      id: string;
      type: string;
      control: string;
      validation?: TibboSettingValidation;
      valueMapping?: TibboValueMapping;
    },
  ) {
    this.rawValue = value;
    this.id = raw.id;
    this.type = raw.type;
    this.control = raw.control;

    if (!!raw.validation) {
      this.greaterThan = raw.validation.greaterThan;
      this.lessThan = raw.validation.lessThan;
      this.invalidMessage = raw.validation.message;
    }

    if (!!raw.valueMapping) this.valueMapping = raw.valueMapping;

    this.value = !!this.valueMapping
      ? this.mapValue(this.rawValue)
      : this.rawValue;
  }

  validateValue(value: string | number) {
    if (
      this.greaterThan !== undefined &&
      this.lessThan !== undefined &&
      !!this.invalidMessage !== undefined
    ) {
      if (!isNaN(Number(value))) {
        return Number(value) > this.greaterThan && Number(value) < this.lessThan
          ? null
          : this.invalidMessage;
      } else if (typeof value === 'string') {
        return `${value}`.length > this.greaterThan &&
          `${value}`.length < this.lessThan
          ? null
          : this.invalidMessage;
      }
    }

    return null;
  }

  mapValue(value: number | string) {
    if (!!this.valueMapping) return this.valueMapping[value];

    return value;
  }
}
