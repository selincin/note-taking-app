import { Pipe, PipeTransform } from '@angular/core';
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
      if (diffInMinutes < 1) return 'now';
      if (diffInMinutes === 1) return '1 minute ago';
      return `${diffInMinutes} minutes ago`;
    }

    if (dateTime.isToday()) {
      if (diffInHours === 1) return '1 hour ago';
      return `${diffInHours} hours ago`;
    }

    if (dateTime.isYesterday()) return 'yesterday';

    return dateTime.format('DD/MM/YYYY');
  }
}