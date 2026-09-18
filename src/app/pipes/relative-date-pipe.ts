import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localeData from 'dayjs/plugin/localeData';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(localeData);
dayjs.extend(advancedFormat);

type DateInput = string | Date | number | undefined | null;

@Pipe({
  name: 'relativeDate',
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  public transform(dateTimeInput?: DateInput): string {
    if (!dateTimeInput) return '';

    const now = dayjs();
    const dateTime = dayjs(dateTimeInput);

    if (!dateTime.isValid()) {
      console.error('Invalid date:', dateTimeInput);
      return '';
    }

    const diffInMinutes = now.diff(dateTime, 'minute');
    const diffInHours = now.diff(dateTime, 'hour');

    if (diffInMinutes < 60) {
      if (diffInMinutes < 1) return this.translate.instant('RELATIVE_DATE.NOW');
      if (diffInMinutes === 1) return this.translate.instant('RELATIVE_DATE.MINUTE_AGO');
      return this.translate.instant('RELATIVE_DATE.MINUTES_AGO', { count: diffInMinutes });
    }

    if (dateTime.isToday()) {
      if (diffInHours === 1) return this.translate.instant('RELATIVE_DATE.HOUR_AGO');
      return this.translate.instant('RELATIVE_DATE.HOURS_AGO', { count: diffInHours });
    }

    if (dateTime.isYesterday()) return this.translate.instant('RELATIVE_DATE.YESTERDAY');

    return dateTime.format('DD/MM/YYYY');
  }
}